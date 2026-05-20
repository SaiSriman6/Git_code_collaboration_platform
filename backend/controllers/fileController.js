import cloudinary from "../config/cloudinary.js";
import { File } from "../models/File.js";
import streamifier from "streamifier";
import { Commit } from "../models/Commit.js";
import fs from "fs";

export const uploadFile = async (req, res) => {
  try {
    const { repository, branch } = req.body;
    if (!req.file) {
      return res.status(400).json({
        message: "No file uploaded",
      });
    }

    console.log("Uploading:", req.file.path);

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "auto",
      }
    );

    // delete local file
    fs.unlinkSync(req.file.path);

    // Save file in DB
    const file = await File.create({
      repository,
      branch: branch || "main",
      name: req.file.originalname,
      path: req.file.path,
      fileUrl: result.secure_url,
      fileType: req.file.mimetype,
      uploadedBy: req.user.userId,
    });

    res.status(201).json({
      message: "File uploaded successfully",
      file,
    });
  } catch (err) {
    console.log(err);

    res.status(500).json({
      message: err.message,
    });
  }
};


// Upload multiple files
export const uploadMultipleFiles = async (req, res) => {
  try {

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        message: "No files uploaded"
      });
    }

    const uploadedFiles = [];

    for (const file of req.files) {

      const result = await cloudinary.uploader.upload(file.path);

      uploadedFiles.push({
        fileName: file.originalname,
        fileUrl: result.secure_url
      });
    }
  // delete local file
  fs.unlinkSync(req.file.path);  
    res.json({
      message: "Files uploaded successfully",
      files: uploadedFiles
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
export const deleteFile = async (req, res) => {

 try {

  const { id } = req.params;
  const { message } = req.body;

  const file = await File.findById(id);

  if (!file) {
   return res.status(404).json({
    message: "File not found"
   });
  }

  const publicId = file.fileUrl
   .split("/upload/")[1]
   .split(".")[0];

  await cloudinary.uploader.destroy(publicId, {
   resource_type: "raw"
  });

  await Commit.create({
   repository: file.repository,
   message: message || `Deleted file ${file.name}`,
   files: [file._id],
   author: req.user.userId
  });

  await File.findByIdAndDelete(id);

  res.json({
   message: "File deleted successfully"
  });

 } catch (err) {

  console.error(err); 

  res.status(500).json({
   message: err.message
  });

 }

};


//Update file

export const updateFile = async (req, res) => {

 try {

  const { id } = req.params;
  const { content, message } = req.body;

  if (!content) {
   return res.status(400).json({
    message: "Content is required"
   });
  }

  const file = await File.findById(id);

  if (!file) {
   return res.status(404).json({
    message: "File not found"
   });
  }

  // extract publicId safely from URL
  const publicId = file.fileUrl
   .split("/upload/")[1]
   .split(".")[0];

  // delete old file from Cloudinary
  await cloudinary.uploader.destroy(publicId, {
   resource_type: "raw"
  });

  // helper function for stream upload
  const streamUpload = () =>
   new Promise((resolve, reject) => {

    const stream = cloudinary.uploader.upload_stream(
     {
      resource_type: "raw",
      public_id: publicId,
      overwrite: true
     },
     (error, result) => {
      if (result) resolve(result);
      else reject(error);
     }
    );

    streamifier
     .createReadStream(Buffer.from(content))
     .pipe(stream);
   }
  );

  // upload updated content
  const result = await streamUpload();

  // update DB with new file URL
  file.fileUrl = result.secure_url;

  if (!file.fileType) {
  file.fileType = "text/plain";
}

  await file.save();
  await Commit.create({
   repository: file.repository,
   message: message || `Updated file ${file.name}`,
   files: [file._id],
   author: req.user.userId
  });

  res.json({
   message: "File updated successfully",
   file
  });

 } catch (err) {

  console.error("Update error:", err);

  res.status(500).json({
   message: err.message
  });

 }

};

// Get single file by ID
export const getFileById = async (req, res) => {
  try {
    const file = await File.findById(req.params.id).populate("uploadedBy", "username email");

    if (!file) {
      return res.status(404).json({ message: "File not found" });
    }

    res.json(file);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// get all files of repository
export const getFilesOfRepo = async (req, res) => {
  try {
    const { branch } = req.query;
    const files = await File.find({
      repository: req.params.repoId,
      branch: branch || "main"
    }).populate("uploadedBy");
    res.status(200).json(files);
  } catch (err) {
    res.status(500).json({
      message: err.message
    });
  }
};
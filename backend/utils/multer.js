import multer from "multer";
import fs from "fs";
import path from "path";

const uploadPath = "uploads/";

if (!fs.existsSync(uploadPath)) {
 fs.mkdirSync(uploadPath, { recursive: true });
}

const storage = multer.diskStorage({
 destination: function (req, file, cb) {
  cb(null, uploadPath);
 },

 filename: function (req, file, cb) {
  cb(null, Date.now() + "-" + file.originalname);
 }
});

export const upload = multer({
 storage,
 limits: {
  fileSize: 1024 * 1024 * 100
 }
});
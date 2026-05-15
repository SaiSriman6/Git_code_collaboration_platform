import express from "express";
import {
  uploadFile,
  uploadMultipleFiles,
  deleteFile,
  updateFile
} from "../controllers/uploadController.js";

import { upload } from "../utils/fileUpload.js";
import { verifyToken } from "../middlewares/verifyToken.js";

export const uploadRoutes = express.Router();

// Upload project file
uploadRoutes.post(
  "/",
  verifyToken,
  upload.single("file"),
  uploadFile
);

// Upload multiple files
uploadRoutes.post(
  "/multiple",
  verifyToken,
  upload.array("files"),
  uploadMultipleFiles
);

// Delete file
uploadRoutes.delete("/", verifyToken, deleteFile);

// Update file
uploadRoutes.put(
  "/",
  verifyToken,
  upload.single("file"),
  updateFile
);
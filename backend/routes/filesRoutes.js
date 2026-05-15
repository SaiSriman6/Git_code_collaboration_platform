import express from "express";
import {
  uploadFile,
  uploadMultipleFiles,
  getFilesOfRepo,
  getFileById,
  deleteFile,
  updateFile
} from "../controllers/fileController.js";

import { verifyToken } from "../middlewares/verifyToken.js";
import {upload} from "../utils/multer.js"; // keep consistent

const router = express.Router();


// Upload single file
router.post(
  "/upload",
  verifyToken,
  upload.single("file"),
  uploadFile
);


// Upload multiple files
router.post(
  "/upload-multiple",
  verifyToken,
  upload.array("files"),
  uploadMultipleFiles
);


// Get all files of a repository
router.get(
  "/repo/:repoId",
  verifyToken,
  getFilesOfRepo
);


// Get single file
router.get(
  "/:id",
  verifyToken,
  getFileById
);


// Update file
router.put(
  "/:id",
  verifyToken,
  updateFile
);


// Delete file
router.delete(
  "/:id",
  verifyToken,
  deleteFile
);

export default router;
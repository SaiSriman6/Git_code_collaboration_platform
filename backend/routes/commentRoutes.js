import express from "express";
import {
  addComment,
  getComments,
  getPRComments,
  getCommentById,
  updateComment,
  deleteComment
} from "../controllers/commentController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Add comment
router.post("/", verifyToken, addComment);

// Get comments of issue
router.get("/issue/:issueId", getComments);

// Get comments of pr
router.get("/pr/:prId",getPRComments)

// Get single comment
router.get("/:id", getCommentById);

// Update comment
router.put("/:id", verifyToken, updateComment);

// Delete comment
router.delete("/:id", verifyToken, deleteComment);

export default router;
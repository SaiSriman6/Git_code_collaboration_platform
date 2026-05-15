import express from "express";
import {
  createCommit,
  getCommits,
  getCommitById,
  deleteCommit,
  updateCommitMessage,
  getCommitsByAuthor
} from "../controllers/commitController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Create commit
router.post("/", verifyToken, createCommit);

// Get commits by repo
router.get("/repo/:repoId", getCommits);

// Get commits by author
router.get("/author/:userId", getCommitsByAuthor);

// Get single commit
router.get("/:id", getCommitById);

// Update commit message
router.put("/:id", verifyToken, updateCommitMessage);

// Delete commit
router.delete("/:id", verifyToken, deleteCommit);

export default router;
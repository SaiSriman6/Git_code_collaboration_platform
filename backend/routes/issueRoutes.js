import express from "express";
import {
  createIssue,
  getIssues,
  closeIssue,
  getIssueById,
  reopenIssue,
  updateIssue,
  deleteIssue,
  getIncomingIssues
} from "../controllers/issueController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Create issue
router.post("/", verifyToken, createIssue);

// Get issues of repo
router.get("/repo/:repoId", getIssues);

// Get single issue
router.get("/:id", getIssueById);

// Close issue
router.patch("/close/:id", verifyToken, closeIssue);

// Reopen issue
router.patch("/reopen/:id", verifyToken, reopenIssue);

// Update issue
router.put("/:id", verifyToken, updateIssue);

// Delete issue
router.delete("/:id", verifyToken, deleteIssue);

// Incoming Issues
router.get("/incoming/:userId",verifyToken,getIncomingIssues);

export default router;
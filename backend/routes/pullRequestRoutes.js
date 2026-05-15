import express from "express";
import {
  createPR,
  getPRs,
  mergePR,
  getPRById,
  closePR,
  reopenPR,
  updatePR,
  deletePR,
  getPRByUser,
  getIncomingPullRequests
} from "../controllers/pullRequestController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Create pull request
router.post("/", verifyToken, createPR);

// Get PRs of a repository
router.get("/repo/:repoId", getPRs);

// Get single PR
router.get("/:id", getPRById);

// Merge PR
router.patch("/merge/:id", verifyToken, mergePR);

// pull-requests by author
router.get("/author/:id",verifyToken,getPRByUser)

// Incoming PR requests
router.get("/incoming/:userId",verifyToken,getIncomingPullRequests)

// Close PR
router.patch("/close/:id", verifyToken, closePR);

// Reopen PR
router.patch("/reopen/:id", verifyToken, reopenPR);

// Update PR
router.put("/:id", verifyToken, updatePR);

// Delete PR
router.delete("/:id", verifyToken, deletePR);

export default router;
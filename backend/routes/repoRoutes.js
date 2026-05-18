import express from "express";
import {
  createRepo,
  getRepos,
  ownRepos,
  getRepoById,
  deleteRepo,
  updateRepo,
  addCollaborator,
  removeCollaborator,
  updateCollaboratorRole,
  getCollaborators,
  changeVisibility,
  createBranch
} from "../controllers/repoController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();


// Create repository
router.post("/", verifyToken, createRepo);


// Get all repositories
router.get("/", getRepos);

// Get repos by owner
router.get("/repos-owner/:id",verifyToken,ownRepos);


// Get collaborators of repo
router.get("/:id/collaborators", getCollaborators);


// Add collaborator
router.post("/:id/collaborators", verifyToken, addCollaborator);


// Update collaborator role
router.patch("/:id/collaborators/:userId", verifyToken, updateCollaboratorRole);


// Remove collaborator
router.delete("/:id/collaborators/:userId", verifyToken, removeCollaborator);


// Get single repository
router.get("/:id", getRepoById);


// Update repository
router.patch("/:id", verifyToken, updateRepo);


// Delete repository
router.delete("/:id", verifyToken, deleteRepo);

// toggle visibility
router.patch("/:id/visibility" , verifyToken , changeVisibility)

// create branch
router.post( "/:repoId/branches",verifyToken,createBranch); 

export default router;
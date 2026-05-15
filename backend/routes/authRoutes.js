import express from "express";
import {
  register,
  login,
  logout,
  getProfile,
  changePassword,
  updateProfile,
  getAllUsers
} from "../controllers/authController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/login", login);
router.get("/logout", logout);

// Profile
router.get("/me", verifyToken, getProfile);
router.put("/change-password", verifyToken, changePassword);
router.patch("/update-profile", verifyToken, updateProfile);

// Users
router.get("/users", verifyToken, getAllUsers);

export default router;
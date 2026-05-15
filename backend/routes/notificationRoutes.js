import express from "express";

import {
  getNotifications,
  markAsRead
} from "../controllers/notificationController.js";

import { verifyToken } from "../middlewares/verifyToken.js";

const router = express.Router();


// GET ALL USER NOTIFICATIONS
router.get(
  "/",
  verifyToken,
  getNotifications
);


// MARK AS READ
router.put(
  "/:id/read",
  verifyToken,
  markAsRead
);

export default router;
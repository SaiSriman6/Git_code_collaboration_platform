import mongoose from "mongoose";

const notificationSchema =
  new mongoose.Schema({

    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    type: {
      type: String,
      enum: [
      "newPR",
      "prMerged",
      "newIssue",
      "newComment",
      "repoActivity",
      "collaboratorAdded"
    ],
    required: true
    },

    message: {
      type: String,
      required: true
    },

    repoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository"
    },

    isRead: {
      type: Boolean,
      default: false
    }

  }, {
    timestamps: true
  });

const Notification =
  mongoose.model(
    "Notification",
    notificationSchema
  );

export default Notification;
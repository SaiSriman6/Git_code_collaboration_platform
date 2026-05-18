import mongoose from "mongoose";

const fileSchema = new mongoose.Schema(
  {
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true,
    },

    // IMPORTANT
    branch: {
      type: String,
      default: "main",
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    path: {
      type: String,
      required: true,
    },

    fileUrl: {
      type: String,
      required: true,
    },

    // ADD THIS
    fileType: {
      type: String,
      required: true,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

fileSchema.index({ repository: 1 });
fileSchema.index({ branch: 1 });

export const File = mongoose.model("File", fileSchema);
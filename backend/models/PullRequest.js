import mongoose from "mongoose";

const pullRequestSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    },

    // Repository this PR belongs to
    repository: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Repository",
      required: true
    },

    // User who created PR
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    // Branch info (important for Git-like system)
    sourceBranch: {
      type: String,
      default: "feature"
    },

    targetBranch: {
      type: String,
      default: "main"
    },

    // PR status
    status: {
      type: String,
      enum: ["open", "closed", "merged"],
      default: "open"
    },

    // Commits included in PR
    commits: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Commit"
      }
    ],

    // Files changed (optional but useful)
    filesChanged: [
    {
     fileName: String,

    oldContent: {
      type: String,
      default: ""
    },

    newContent: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["added", "modified", "deleted"],
      default: "modified"
    }
    }
   ],

    // Reviewers (optional)
    reviewers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    // Merge info
    mergedAt: {
      type: Date
    },

    mergedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  },
  {
    timestamps: true
  }
);

export const PullRequest = mongoose.model("PullRequest", pullRequestSchema);
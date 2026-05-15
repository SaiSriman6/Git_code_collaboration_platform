import mongoose from "mongoose";

const issueSchema = new mongoose.Schema(
{
  repository: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Repository",
    required: true
  },

  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  title: {
    type: String,
    required: [true, "Issue title is required"],
    trim: true,
    minlength: 3,
    maxlength: 200
  },

  description: {
    type: String,
    trim: true,
    maxlength: 2000,
    default: ""
  },

  status: {
    type: String,
    enum: ["open", "closed"],
    default: "open"
  },

  comments: {
    type: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comment"
      }
    ],
    default: []
  }

},
{
  timestamps: true
});


// indexes for performance
issueSchema.index({ repository: 1 });
issueSchema.index({ author: 1 });
issueSchema.index({ status: 1 });

export const Issue = mongoose.model("Issue", issueSchema);
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  issue: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Issue"
  },

  pullRequest: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "PullRequest"
  },

  text: {
    type: String,
    required: [true, "Comment text is required"],
    trim: true,
    minlength: 1,
    maxlength: 1000
  }

},{
  timestamps:true
});


// indexes for faster comment queries
commentSchema.index({ issue: 1 });
commentSchema.index({ pullRequest: 1 });

export const Comment = mongoose.model("Comment", commentSchema);
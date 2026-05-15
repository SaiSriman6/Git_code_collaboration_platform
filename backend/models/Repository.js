import mongoose from "mongoose";

const repositorySchema = new mongoose.Schema({

  name: {
    type: String,
    required: [true, "Repository name is required"],
    trim: true,
    minlength: 2,
    maxlength: 100
  },

  description: {
    type: String,
    trim: true,
    maxlength: 500,
    default: ""
  },

  visibility: {
    type: String,
    enum: ["public", "private"],
    default: "public"
  },

  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  collaborators: {
    type: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true
        },

        role: {
          type: String,
          enum: ["collaborator", "viewer"],
          default: "viewer"
        }
      }
    ],
    default: []
  }

},
{
  timestamps: true
});


// indexes for faster queries
repositorySchema.index({ owner: 1 });
repositorySchema.index({ "collaborators.user": 1 });

// prevent duplicate repo names per owner
repositorySchema.index({ owner: 1, name: 1 }, { unique: true });

export const Repository = mongoose.model("Repository", repositorySchema);
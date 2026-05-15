import mongoose from "mongoose";

const commitSchema = new mongoose.Schema({

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

  message: {
    type: String,
    required: [true, "Commit message is required"],
    trim: true,
    minlength: 1,
    maxlength: 300
  },

  files:{
type:[
{
type:mongoose.Schema.Types.ObjectId,
ref:"File"
}
],
default:[]
}

},{
  timestamps:true
});


// indexes for faster commit history queries
commitSchema.index({ repository: 1 });
commitSchema.index({ author: 1 });

export const Commit = mongoose.model("Commit", commitSchema);
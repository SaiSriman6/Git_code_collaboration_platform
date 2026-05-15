import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
{
  username: {
    type: String,
    required: [true, "Username is required"],
    trim: true,
    minlength: 3,
    maxlength: 30
  },

  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    match: [/.+\@.+\..+/, "Please enter a valid email"]
  },

  password: {
    type: String,
    required: [true, "Password is required"],
    minlength: 6
  },

  avatar: {
    type: String,
    default: ""
  }

},
{
  timestamps: true
}
);

userSchema.index({ email: 1 });

export const User = mongoose.model("User", userSchema);
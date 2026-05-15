import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

// Register user
export const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser)
      return res.status(409).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.status(201).json({
      message: "User registered successfully",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    
    if (!user){
       
      return res.status(404).json({ message: "User not found" });
    }
    
    const match = await bcrypt.compare(password, user.password);
    
    if (!match){

      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({
      message: "Login successful",
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Logout user
export const logout = (req, res) => {
  try {

    const token = req.cookies.token;
    

    // if (!token) {   
    //   return res.status(401).json({
    //     message: "User not logged in"
    //   });
    // }

    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
    });

    res.json({
      message: "Logged out successfully",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get current logged-in user profile
export const getProfile = async (req, res) => {
  try {

    const user = await User.findById(req.user.userId).select("-password");

    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Change password
export const changePassword = async (req, res) => {
  try {

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.userId);
    
    if (!user){
      return res.status(404).json({ message: "User not found" });
    }
    
    const match = await bcrypt.compare(currentPassword, user.password);
    
    if (!match){
      return res.status(401).json({ message: "Current password incorrect" });
    }
    
    user.password = await bcrypt.hash(newPassword, 10);
    

    await user.save();

    res.status(200).json({
      message: "Password updated successfully",
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Update user profile
export const updateProfile = async (req, res) => {
  try {

    const { username, email } = req.body;

    const user = await User.findById(req.user.userId);

    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (username) user.username = username;
    if (email) user.email = email;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user
    });

   
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// Get all users (useful for collaborators)
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
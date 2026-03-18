import User from "../models/User.js";
import OTP from "../models/OTP.js";
import {
  generateOTP,
  hashPassword,
  comparePasswords,
} from "../utils/helpers.js";
import { sendOtpEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, confirmPassword } =
      req.body;

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const normalizedEmail = email.toLowerCase();

    // Check if user already exists (completed registration before)
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered. Please login instead." });
    }

    // Check if there's a pending OTP for this email
    const pendingOtp = await OTP.findOne({ email: normalizedEmail });
    if (pendingOtp) {
      return res.status(400).json({
        message:
          "An OTP is already sent to this email. Please verify it first or wait 10 minutes to request a new one.",
        email: normalizedEmail,
      });
    }

    const hashedPassword = await hashPassword(password);
    const otp = generateOTP();

    // Store OTP in MongoDB (user NOT created yet)
    await OTP.create({
      email: normalizedEmail,
      otp,
      userData: { fullName, email: normalizedEmail, phoneNumber, password: hashedPassword },
    });

    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Continue with registration even if email fails
    }

    const response = {
      message: "OTP sent to email. Verify to complete registration.",
      email: normalizedEmail,
    };

    res.status(200).json(response);
  } catch (error) {
    console.error("Registration error:", error);
    res
      .status(500)
      .json({ message: "Registration failed", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const normalizedEmail = email.toLowerCase();

    // Find OTP record
    const storedOtpData = await OTP.findOne({ email: normalizedEmail });

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP expired or invalid email" });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check if user already exists
    let user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      // Create new user
      try {
        const userData = storedOtpData.userData;
        
        // Validate userData exists
        if (!userData || !userData.fullName || !userData.phoneNumber || !userData.password) {
          console.error("Invalid userData in OTP:", storedOtpData);
          return res.status(400).json({ message: "Invalid registration data. Please register again." });
        }

        user = new User({
          fullName: userData.fullName,
          email: userData.email,
          phoneNumber: userData.phoneNumber,
          password: userData.password,
          isEmailVerified: true,
        });

        await user.save();
      } catch (userError) {
        console.error("User creation error:", userError);
        
        // If it's a duplicate key error, user exists from previous attempt
        if (userError.code === 11000) {
          user = await User.findOne({ email: normalizedEmail });
          if (!user) {
            return res.status(500).json({ message: "User creation failed", error: userError.message });
          }
        } else {
          return res.status(500).json({ message: "Failed to create user", error: userError.message });
        }
      }
    }

    // Delete OTP after successful verification
    try {
      await OTP.deleteOne({ email: normalizedEmail });
    } catch (otpDeleteError) {
      console.error("OTP deletion error:", otpDeleteError);
      // Continue despite OTP deletion error
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.status(201).json({
      message: "Registration successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("OTP verification error:", error);
    res
      .status(500)
      .json({ message: "Verification failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.status(200).json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const otp = generateOTP();
    
    // Delete any existing OTP for this email and create new one
    await OTP.deleteOne({ email: email.toLowerCase() });
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      userData: { email: email.toLowerCase() }, // Just store email for password reset
    });

    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
    }

    res.status(200).json({
      message: "Password reset OTP sent to email",
      email: email.toLowerCase(),
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    res
      .status(500)
      .json({ message: "Failed to process request", error: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword, confirmPassword } = req.body;

    if (!email || !otp || !newPassword || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const normalizedEmail = email.toLowerCase();
    const storedOtpData = await OTP.findOne({ email: normalizedEmail });

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP expired or invalid email" });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const hashedPassword = await hashPassword(newPassword);
    const user = await User.findOneAndUpdate(
      { email: normalizedEmail },
      { password: hashedPassword },
      { new: true },
    ).select("-password");

    // Delete OTP after successful reset
    await OTP.deleteOne({ email: normalizedEmail });

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRATION,
    });

    res.status(200).json({
      message: "Password reset successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error("Password reset error:", error);
    res
      .status(500)
      .json({ message: "Password reset failed", error: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.body;
    const { fullName, phoneNumber, avatar } = req.body;

    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const updateData = {};
    if (fullName) updateData.fullName = fullName;
    if (phoneNumber) updateData.phoneNumber = phoneNumber;
    if (avatar) updateData.avatar = avatar;

    const user = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
    }).select("-password");

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update profile", error: error.message });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { userId, currentPassword, newPassword } = req.body;

    if (!userId || !currentPassword || !newPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await comparePasswords(
      currentPassword,
      user.password,
    );
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update password", error: error.message });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res
        .status(400)
        .json({ message: "User ID and email are required" });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const otp = generateOTP();
    
    // Delete any existing OTP for this email and create new one
    await OTP.deleteOne({ email: email.toLowerCase() });
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      userData: { email: email.toLowerCase(), userId },
    });

    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to new email",
      email,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update email", error: error.message });
  }
};

export const verifyEmailUpdate = async (req, res) => {
  try {
    const { userId, email, otp } = req.body;

    if (!userId || !otp || !email) {
      return res.status(400).json({ message: "User ID, email and OTP are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const storedOtpData = await OTP.findOne({ email: normalizedEmail });

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { email: normalizedEmail },
      { new: true },
    ).select("-password");

    // Delete OTP after successful verification
    await OTP.deleteOne({ email: normalizedEmail });

    res.status(200).json({
      message: "Email updated successfully",
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to verify email update", error: error.message });
  }
};

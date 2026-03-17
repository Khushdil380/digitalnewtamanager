import User from "../models/User.js";
import {
  generateOTP,
  hashPassword,
  comparePasswords,
} from "../utils/helpers.js";
import { sendOtpEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const otpStore = new Map();

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

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already registered" });
    }

    // Check if OTP is already pending for this email
    const pendingOtp = otpStore.get(email);
    if (pendingOtp && Date.now() - pendingOtp.createdAt < 10 * 60 * 1000) {
      return res.status(400).json({
        message:
          "An OTP is already sent to this email. Please verify it first or wait 10 minutes to request a new one.",
        email,
      });
    }

    const hashedPassword = await hashPassword(password);
    const otp = generateOTP();

    otpStore.set(email, {
      otp,
      userData: { fullName, email, phoneNumber, password: hashedPassword },
      createdAt: Date.now(),
    });

    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Continue with registration even if email fails
      // The OTP is still stored and can be used with the demo OTP
    }

    const response = {
      message: "OTP sent to email. Verify to complete registration.",
      email,
    };

    // Include OTP in development mode for testing
    if (process.env.NODE_ENV === "development") {
      response.otp = otp;
    }

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

    const storedOtpData = otpStore.get(email);

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP expired or invalid email" });
    }

    if (Date.now() - storedOtpData.createdAt > 10 * 60 * 1000) {
      otpStore.delete(email);
      return res.status(400).json({ message: "OTP expired" });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = new User(storedOtpData.userData);
    user.isEmailVerified = true;
    await user.save();

    otpStore.delete(email);

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
    otpStore.set(`reset-${email}`, {
      otp,
      createdAt: Date.now(),
    });

    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Continue with request even if email fails
    }

    const response = {
      message: "Password reset OTP sent to email",
      email,
    };

    // Include OTP in development mode for testing
    if (process.env.NODE_ENV === "development") {
      response.otp = otp;
    }

    res.status(200).json(response);
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

    const storedOtpData = otpStore.get(`reset-${email}`);

    if (!storedOtpData || storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() - storedOtpData.createdAt > 10 * 60 * 1000) {
      otpStore.delete(`reset-${email}`);
      return res.status(400).json({ message: "OTP expired" });
    }

    const hashedPassword = await hashPassword(newPassword);
    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { password: hashedPassword },
      { new: true },
    ).select("-password");

    otpStore.delete(`reset-${email}`);

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
    otpStore.set(`email-${userId}`, {
      otp,
      email,
      createdAt: Date.now(),
    });

    await sendOtpEmail(email, otp);

    res.status(200).json({
      message: "OTP sent to new email",
      email,
      otp: process.env.NODE_ENV === "development" ? otp : undefined,
    });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to update email", error: error.message });
  }
};

export const verifyEmailUpdate = async (req, res) => {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      return res.status(400).json({ message: "User ID and OTP are required" });
    }

    const storedOtpData = otpStore.get(`email-${userId}`);

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP expired or invalid" });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (Date.now() - storedOtpData.createdAt > 10 * 60 * 1000) {
      otpStore.delete(`email-${userId}`);
      return res.status(400).json({ message: "OTP expired" });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { email: storedOtpData.email.toLowerCase() },
      { new: true },
    ).select("-password");

    otpStore.delete(`email-${userId}`);

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

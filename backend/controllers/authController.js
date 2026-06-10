import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { generateOTP, hashPassword, comparePasswords } from "../utils/helpers.js";
import { sendOtpEmail } from "../utils/emailService.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export const register = async (req, res) => {
  try {
    const { fullName, email, phoneNumber, password, confirmPassword } = req.body;

    if (!fullName || !email || !phoneNumber || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const normalizedEmail = email.toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered. Please login instead." });
    }

    const pendingOtp = await OTP.findOne({ email: normalizedEmail });
    if (pendingOtp) {
      return res.status(400).json({
        message: "An OTP is already sent to this email. Please verify it first or wait 10 minutes to request a new one.",
        email: normalizedEmail,
      });
    }

    const hashedPassword = await hashPassword(password);
    const otp = generateOTP();

    const userData = {
      fullName: fullName.trim(),
      email: normalizedEmail,
      phoneNumber: phoneNumber.trim(),
      password: hashedPassword,
    };

    await OTP.create({ email: normalizedEmail, otp, userData });

    try {
      await sendOtpEmail(email, otp);
    } catch (emailError) {
      console.error("Email sending error:", emailError);
    }

    res.status(200).json({
      message: "OTP sent to email. Verify to complete registration.",
      email: normalizedEmail,
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ message: "Registration failed", error: error.message });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({ message: "Email and OTP are required" });
    }

    const normalizedEmail = email.toLowerCase();
    const storedOtpData = await OTP.findOne({ email: normalizedEmail });

    if (!storedOtpData) {
      return res.status(400).json({ message: "OTP expired or invalid email" });
    }

    if (storedOtpData.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      try {
        const userData = storedOtpData.userData;

        if (!userData || !userData.fullName || !userData.phoneNumber || !userData.password) {
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

    await OTP.deleteOne({ email: normalizedEmail });

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
    res.status(500).json({ message: "Verification failed", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
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

    await OTP.deleteOne({ email: email.toLowerCase() });
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      userData: { email: email.toLowerCase() },
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
    res.status(500).json({ message: "Failed to process request", error: error.message });
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
    res.status(500).json({ message: "Password reset failed", error: error.message });
  }
};

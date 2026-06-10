import User from "../models/User.js";
import OTP from "../models/OTP.js";
import { generateOTP, hashPassword, comparePasswords } from "../utils/helpers.js";
import { sendOtpEmail } from "../utils/emailService.js";

export const updateProfile = async (req, res) => {
  try {
    const { userId, fullName, phoneNumber, avatar } = req.body;

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
    res.status(500).json({ message: "Failed to update profile", error: error.message });
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

    const isPasswordValid = await comparePasswords(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Current password is incorrect" });
    }

    const hashedPassword = await hashPassword(newPassword);
    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.status(200).json({ message: "Password updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to update password", error: error.message });
  }
};

export const updateEmail = async (req, res) => {
  try {
    const { userId, email } = req.body;

    if (!userId || !email) {
      return res.status(400).json({ message: "User ID and email are required" });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase(),
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email already in use" });
    }

    const otp = generateOTP();

    await OTP.deleteOne({ email: email.toLowerCase() });
    await OTP.create({
      email: email.toLowerCase(),
      otp,
      userData: { email: email.toLowerCase(), userId },
    });

    await sendOtpEmail(email, otp);

    res.status(200).json({ message: "OTP sent to new email", email });
  } catch (error) {
    res.status(500).json({ message: "Failed to update email", error: error.message });
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
    res.status(500).json({ message: "Failed to verify email update", error: error.message });
  }
};

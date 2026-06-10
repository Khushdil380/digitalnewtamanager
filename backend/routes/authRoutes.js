import express from "express";
import { register, verifyOtp, login, forgotPassword, resetPassword } from "../controllers/authController.js";
import { updateProfile, updatePassword, updateEmail, verifyEmailUpdate } from "../controllers/profileController.js";

const router = express.Router();

// Auth
router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

// Profile
router.post("/update-profile", updateProfile);
router.post("/update-password", updatePassword);
router.post("/update-email", updateEmail);
router.post("/verify-email-update", verifyEmailUpdate);

export default router;

import express from "express";
import {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
  updateProfile,
  updatePassword,
  updateEmail,
  verifyEmailUpdate,
} from "../controllers/authController.js";

const router = express.Router();

router.post("/register", register);
router.post("/verify-otp", verifyOtp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/update-profile", updateProfile);
router.post("/update-password", updatePassword);
router.post("/update-email", updateEmail);
router.post("/verify-email-update", verifyEmailUpdate);

export default router;

import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    unique: true,
  },
  otp: {
    type: String,
    required: true,
  },
  userData: {
    fullName: String,
    email: String,
    phoneNumber: String,
    password: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 600, // Auto-delete after 10 minutes (600 seconds)
  },
});

const OTP = mongoose.model("OTP", otpSchema);
export default OTP;

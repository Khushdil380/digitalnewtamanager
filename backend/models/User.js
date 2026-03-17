import mongoose from "mongoose";
const { Schema } = mongoose;

const userSchema = new Schema({
  fullName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    maxlength: 100,
    index: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    trim: true,
    maxlength: 15,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    type: String,
    default: null,
    maxlength: 500,
  },
  isEmailVerified: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);

export default User;

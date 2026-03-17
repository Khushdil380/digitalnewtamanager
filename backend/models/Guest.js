import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },
    village: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
      index: true,
    },
    mobileNumber: {
      type: String,
      default: null,
      trim: true,
      maxlength: 15,
      sparse: true,
      index: true,
    },
    tag: {
      type: String,
      enum: ["friend", "family", "relative", "neighbour", "other"],
      default: "other",
      index: true,
    },
    priority: {
      type: Number,
      enum: [1, 2, 3],
      default: 3,
      index: true,
    },
    addedOn: {
      type: String,
      enum: ["beforeWedding", "onWeddingDay"],
      default: "beforeWedding",
      index: true,
    },
    invitedStatus: {
      type: Boolean,
      default: true,
    },
    attendedStatus: {
      type: Boolean,
      default: false,
    },
    contributionAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    contributionType: {
      type: String,
      enum: ["cash", "upi", "check", "envelope", null],
      default: null,
    },
    givenBy: {
      type: String,
      default: null,
      trim: true,
      maxlength: 100,
    },
    notes: {
      type: String,
      default: null,
      maxlength: 500,
    },
  },
  { timestamps: true },
);

// Compound indexes for optimized queries
guestSchema.index({ weddingId: 1, createdAt: -1 });
guestSchema.index({ weddingId: 1, name: 1 });
guestSchema.index({ weddingId: 1, village: 1 });
guestSchema.index({ userId: 1, weddingId: 1 });

export default mongoose.model("Guest", guestSchema);

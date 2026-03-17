import mongoose from "mongoose";

const contributionSchema = new mongoose.Schema(
  {
    weddingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wedding",
      required: true,
      index: true,
    },
    guestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
      required: true,
      index: true,
    },
    guestName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    village: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    type: {
      type: String,
      enum: ["cash", "envelope"],
      default: "cash",
    },
    givenPersonally: {
      type: Boolean,
      default: true,
    },
    givenBy: {
      type: String,
      default: null,
      trim: true,
      maxlength: 100,
    },
    description: {
      type: String,
      default: null,
      trim: true,
      maxlength: 500,
    },
    attended: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Compound indexes for efficient queries
contributionSchema.index({ weddingId: 1, createdAt: -1 });
contributionSchema.index({ weddingId: 1, guestId: 1 });
contributionSchema.index({ guestId: 1, weddingId: 1 });

export default mongoose.model("Contribution", contributionSchema);

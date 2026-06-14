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
    },
    // "earlier" = added via guest form before wedding, "wedding" = added on wedding day
    addedOn: {
      type: String,
      enum: ["earlier", "wedding"],
      default: "earlier",
    },
    // true if any contribution (cash/upi/envelope) was recorded for this guest
    attended: {
      type: Boolean,
      default: false,
    },
    // "personally" or "someone" — how the contribution was given
    attendedBy: {
      type: String,
      enum: ["personally", "someone", null],
      default: null,
    },
    // Contribution amount (0 for envelope if unknown)
    amount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // Payment method
    paymentType: {
      type: String,
      enum: ["cash", "upi", "envelope", null],
      default: null,
    },
    // Soft delete flag
    isDeleted: {
      type: Boolean,
      default: false,
    },
    // Card distribution tracking
    cardDistributed: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Compound indexes for optimized queries
guestSchema.index({ weddingId: 1, createdAt: -1 });
guestSchema.index({ weddingId: 1, name: 1 });
guestSchema.index({ userId: 1, weddingId: 1 });

export default mongoose.model("Guest", guestSchema);

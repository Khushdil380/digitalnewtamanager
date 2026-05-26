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
    paymentType: {
      type: String,
      enum: ["cash", "upi", "envelope"],
      default: "cash",
    },
    // "personally" = guest came in person, "someone" = sent via another person
    givenBy: {
      type: String,
      enum: ["personally", "someone"],
      default: "personally",
    },
  },
  { timestamps: true },
);

contributionSchema.index({ weddingId: 1, createdAt: -1 });
contributionSchema.index({ weddingId: 1, guestId: 1 });

export default mongoose.model("Contribution", contributionSchema);

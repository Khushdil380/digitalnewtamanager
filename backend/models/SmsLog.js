import mongoose from "mongoose";

const smsLogSchema = new mongoose.Schema(
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
    messageType: {
      type: String,
      enum: ["card", "reminder", "custom"],
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

smsLogSchema.index({ weddingId: 1, guestId: 1, messageType: 1 });

export default mongoose.model("SmsLog", smsLogSchema);

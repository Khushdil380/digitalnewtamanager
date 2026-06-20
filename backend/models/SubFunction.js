import mongoose from "mongoose";

const subFunctionSchema = new mongoose.Schema(
  {
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
      maxlength: 50,
    },
    // Guest IDs who are invited to this sub-function
    invitedGuests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
    }],
    // Guest IDs who actually attended this sub-function
    attendedGuests: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: "Guest",
    }],
  },
  { timestamps: true },
);

subFunctionSchema.index({ weddingId: 1, name: 1 });

export default mongoose.model("SubFunction", subFunctionSchema);

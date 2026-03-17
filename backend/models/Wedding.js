import mongoose from "mongoose";
const { Schema } = mongoose;

const weddingSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
    index: true,
  },
  brideName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  groomName: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  date: {
    type: Date,
    required: true,
    index: true,
  },
  venue: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200,
  },
  totalGuestsInvited: {
    type: Number,
    default: 0,
    min: 0,
  },
  totalGuestsAttended: {
    type: Number,
    default: 0,
    min: 0,
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

// Index for efficient user wedding queries
weddingSchema.index({ userId: 1, createdAt: -1 });

const Wedding = mongoose.model("Wedding", weddingSchema);

export default Wedding;

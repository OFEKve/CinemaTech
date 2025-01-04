import mongoose from "mongoose";

const cancellationRequestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "approved", "rejected"], // שים לב לאותיות קטנות
    default: "pending",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export const CancellationRequest = mongoose.model(
  "CancellationRequest",
  cancellationRequestSchema
);

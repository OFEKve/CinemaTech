import mongoose from "mongoose";
const userSchema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: "",
  },
  phone: {
    type: String,
    required: false,
    unique: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  tickets: [
    {
      orderNumber: { type: String, required: true },
      movieName: { type: String, required: true },
      selectedSeats: [{ type: String, required: false }],
      qrData: { type: Object },
      qrImage: { type: String },
      movieImage: { type: String, required: false },
      createdAt: { type: Date, default: Date.now },
      selectedTimeSlot: { type: String },
      hallNumber: { type: Number, required: false },
    },
  ],
});

export const User = mongoose.model("User", userSchema);

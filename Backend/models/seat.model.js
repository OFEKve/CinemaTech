import mongoose from "mongoose";

const seatSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true,
  },
  seatNumber: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true, // שדה חדש לתמיכה בשעות
  },
  date: {
    type: Date,
    required: true, // שדה לתאריך הנבחר
  },
});

const Seat = mongoose.model("Seat", seatSchema);

export default Seat;

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
    required: false, // טלפון נדרש בעת ההרשמה
    unique: true, // כדי להבטיח שהטלפון יהיה ייחודי
  },
  isAdmin: {
    type: Boolean,
    default: false, // משתמש רגיל כברירת מחדל
  },
  tickets: [
    {
      movieName: { type: String, required: true },
      selectedSeats: [{ type: String, required: false }],
      qrData: { type: Object }, // שמירת נתוני QR
      qrImage: { type: String }, // שמירת תמונת QR
      movieImage: { type: String, required: false }, // שמירת תמונת הסרט
      createdAt: { type: Date, default: Date.now },
      selectedTimeSlot: { type: String },
      hallNumber: { type: Number, required: false }, // מספר האולם
    },
  ],
});

export const User = mongoose.model("User", userSchema);

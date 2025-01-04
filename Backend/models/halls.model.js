import mongoose from "mongoose";

const hallSchema = new mongoose.Schema({
  movieId: {
    type: String,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  hallNumber: {
    type: Number,
    required: true,
  },
});

const Hall = mongoose.model("Hall", hallSchema);
export default Hall;

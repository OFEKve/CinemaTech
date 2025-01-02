import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  picture: { type: String, required: true }, // שדה picture

  size: { type: String }, // אופציונלי לגדלים של שתייה וכו'
  components: [String], // אופציונלי למרכיבי דילים
});

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  items: [itemSchema],
});

const Menu = mongoose.model("Menu", categorySchema);

export default Menu;

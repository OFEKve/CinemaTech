import mongoose from "mongoose";
import Menu from "./models/menu.model.js"; // ייבוא המודל של Mongoose
import menuData from "../Front/public/menu.json" assert { type: "json" }; // ייבוא JSON
import connectDB from "./config/db.js";

// ייבוא הנתונים למסד הנתונים
export const importData = async () => {
  try {
    await connectDB(); // חיבור למסד הנתונים

    // מחיקת נתונים קיימים
    await Menu.deleteMany();
    console.log("Existing data deleted");

    // הוספת נתונים ממבנה ה-JSON למסד הנתונים
    await Menu.insertMany(
      menuData.categories.map((category) => ({
        name: category.name,
        items: category.items,
      }))
    );

    console.log("Data imported successfully");
  } catch (error) {
    console.error("Error importing data:", error);
  }
};

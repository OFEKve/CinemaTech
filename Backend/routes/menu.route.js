import express from "express";
import {
  addItemToCategory,
  updateItemInCategory,
  deleteItemFromCategory,
  getAllCategories,
  getMenuItemsByCategory,
} from "../controllers/menu.controller.js";

const router = express.Router();

// ניהול מוצרים בתוך קטגוריה
router.get("/", getAllCategories);
router.get("/:categoryName", getMenuItemsByCategory);
router.post("/:id/items", addItemToCategory); // הוספת מוצר לקטגוריה
router.put("/:categoryId/items/:itemId", updateItemInCategory); // עדכון מוצר בקטגוריה
router.delete("/:categoryId/items/:itemId", deleteItemFromCategory); // מחיקת מוצר מקטגוריה

export default router;

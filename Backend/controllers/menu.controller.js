import Menu from "../models/menu.model.js";
export const getMenuItemsByCategory = async (req, res) => {
  let { categoryName } = req.params;

  categoryName = categoryName.trim();

  try {
    const category = await Menu.findOne({ name: categoryName });

    if (!category) {
      console.error(`Category '${categoryName}' not found`);
      return res.status(404).json({
        success: false,
        message: `Category '${categoryName}' not found`,
      });
    }

    const formattedItems = category.items.map((item) => ({
      ...item.toObject(),
      price: `${Number(item.price).toFixed(2)} ₪`, // המרה למספר ופורמט
    }));

    res.status(200).json({
      success: true,
      items: formattedItems,
    });
  } catch (error) {
    console.error("Error fetching menu items:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getAllCategories = async (req, res) => {
  try {
    const categories = await Menu.find();

    const formattedCategories = categories.map((category) => ({
      ...category.toObject(),
      items: category.items.map((item) => ({
        ...item.toObject(),
        price: `${Number(item.price).toFixed(2)} ₪`, // המרה למספר ופורמט
      })),
    }));

    res.status(200).json({ success: true, categories: formattedCategories });
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

// הוספת מוצר לקטגוריה
export const addItemToCategory = async (req, res) => {
  const { id } = req.params; // מזהה הקטגוריה
  const { name, description, price, picture, size, components } = req.body;

  try {
    const category = await Menu.findById(id);
    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const newItem = { name, description, price, picture, size, components };
    category.items.push(newItem); // מוסיף את המוצר לקטגוריה
    await category.save();

    res.status(201).json({
      success: true,
      message: "Item added to category",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error adding item",
      error: error.message,
    });
  }
};

// עדכון מוצר בקטגוריה
export const updateItemInCategory = async (req, res) => {
  const { categoryId, itemId } = req.params;
  const { name, description, price, picture, size, components } = req.body;

  try {
    const category = await Menu.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const item = category.items.id(itemId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    item.name = name || item.name;
    item.description = description || item.description;
    item.price = price || item.price;
    item.picture = picture || item.picture;
    item.size = size || item.size;
    item.components = components || item.components;

    await category.save();

    res.status(200).json({
      success: true,
      message: "Item updated successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating item",
      error: error.message,
    });
  }
};

// מחיקת מוצר מקטגוריה
export const deleteItemFromCategory = async (req, res) => {
  const { categoryId, itemId } = req.params;

  try {
    const category = await Menu.findById(categoryId);

    if (!category) {
      return res
        .status(404)
        .json({ success: false, message: "Category not found" });
    }

    const item = category.items.id(itemId);
    if (!item) {
      return res
        .status(404)
        .json({ success: false, message: "Item not found" });
    }

    item.remove();
    await category.save();

    res.status(200).json({
      success: true,
      message: "Item deleted successfully",
      data: category,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting item",
      error: error.message,
    });
  }
};

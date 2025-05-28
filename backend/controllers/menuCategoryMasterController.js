const MenuCategoryMaster = require('../models/menuCategoryMaster');

const getAllCategories = async (req, res) => {
  try {
    const categories = await MenuCategoryMaster.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const addCategory = async (req, res) => {
//   try {
//     const category = new MenuCategoryMaster(req.body);
//     await category.save();
//     res.status(201).json(category);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

const addCategory = async (req, res) => {
  const { categoryName, items } = req.body;

  if (!categoryName || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "Category name and items are required." });
  }

  try {
    // Check if the category already exists
    const existingCategory = await MenuCategoryMaster.findOne({ categoryName });

    if (existingCategory) {
      // Append new items to the existing category
      existingCategory.items.push(...items);
      await existingCategory.save();
      return res.status(200).json({ message: "Items added to existing category", category: existingCategory });
    } else {
      // Create a new category if it doesn't exist
      const newCategory = new MenuCategoryMaster({ categoryName, items });
      await newCategory.save();
      return res.status(201).json({ message: "New category created", category: newCategory });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error" });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { categoryName, items } = req.body;

  try {
    const updated = await MenuCategoryMaster.findByIdAndUpdate(
      id,
      { categoryName, items },
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ error: "Category not found" });

    res.json({ message: "Category updated", category: updated });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};


const deleteCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    await MenuCategoryMaster.findByIdAndDelete(categoryId);
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteItemFromCategory = async (req, res) => {
  const { categoryId, itemId } = req.params;

  try {
    const category = await MenuCategoryMaster.findById(categoryId);
    if (!category) return res.status(404).json({ error: "Category not found" });

    category.items.id(itemId).remove();
    await category.save();

    res.json({ message: "Item deleted", category });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};




module.exports = {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  deleteItemFromCategory
};

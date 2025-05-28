// routes/menuRoutes.js
const express = require('express');
const router = express.Router();
const {
  getAllCategories,
  addCategory,
  updateCategory,
  deleteCategory,
  deleteItemFromCategory
} = require('../controllers/menuCategoryMasterController');

router.put("/menu/categories", updateCategory);

// Delete entire category
router.delete("/menu/categories/:categoryId", deleteCategory);

// Delete single item in category
router.delete("menu/categories/:categoryId/items/:itemId", deleteItemFromCategory);

router.get('/menu/categories', getAllCategories);
router.post('/menu/categories', addCategory);

module.exports = router;



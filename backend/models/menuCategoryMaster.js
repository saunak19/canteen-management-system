const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ["veg", "non-veg"], required: true },
});

const menuCategorySchema = new mongoose.Schema({
  categoryName: { type: String, required: true },
  items: [itemSchema],
});

module.exports = mongoose.model("MenuCategoryMaster", menuCategorySchema);

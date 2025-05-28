const mongoose = require("mongoose");

const tenderSchema = new mongoose.Schema({
  mealType: { type: String, enum: ["breakfast", "lunch", "dinner"], required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "menuCategoryMaster", required: true },
  tenderAmount: { type: Number, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Tender", tenderSchema);

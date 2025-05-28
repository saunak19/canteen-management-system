// models/weeklyMealPlan.js
const mongoose = require("mongoose");

const mealItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: {
    type: String,
    enum: ['veg', 'non-veg'],
    required: true
  },
  category: { type: String, required: true }
});

const dailyMealSchema = new mongoose.Schema({
  breakfast: [mealItemSchema],
  lunch: [mealItemSchema],
  dinner: [mealItemSchema]
});

const weeklyMealPlanSchema = new mongoose.Schema({
  weekStartDate: {
    type: Date,
    required: true,
    unique: true
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  days: {
    Monday: dailyMealSchema,
    Tuesday: dailyMealSchema,
    Wednesday: dailyMealSchema,
    Thursday: dailyMealSchema,
    Friday: dailyMealSchema,
    Saturday: dailyMealSchema,
    Sunday: dailyMealSchema
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('WeeklyMealPlan', weeklyMealPlanSchema);

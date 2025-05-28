// routes/weeklyMealRoutes.js
const express = require('express');
const router = express.Router();
const {
  createWeeklyMealPlan,
  getWeeklyMealPlan,getAllWeeklyMealPlans,
  getUpcomingWeeklyPlans
} = require('../controllers/weeklyMealPlanController');

router.post('/meal/weekly-meal-plan', createWeeklyMealPlan);
router.get('/meal/weekly-meal-plan', getWeeklyMealPlan);
router.get('/meal/all/weekly-meal-plan', getAllWeeklyMealPlans);
router.get('/meal/weekly-plan/upcoming', getUpcomingWeeklyPlans);

module.exports = router;

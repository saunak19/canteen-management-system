const WeeklyMealPlan = require('../models/weeklyMealPlan');
const Category = require('../models/menuCategoryMaster'); // Assuming your categories are in this model

// Helper: Convert frontend planDays to backend schema format
const transformPlanDaysForDB = (planDays, categories) => {
  const transformed = {};

  Object.entries(planDays).forEach(([day, meals]) => {
    transformed[day] = { breakfast: [], lunch: [], dinner: [] };

    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      const meal = meals[mealType]; // meal is { categoryName: [itemName, ...], ... }
      if (!meal) return;

      Object.entries(meal).forEach(([categoryName, itemNames]) => {
        itemNames.forEach(itemName => {
          // Find item type from categories data
          const categoryObj = categories.find(cat => cat.categoryName === categoryName);
          if (!categoryObj) return;

          const itemObj = categoryObj.items.find(i => i.name === itemName);
          if (!itemObj) return;

          transformed[day][mealType].push({
            name: itemName,
            category: categoryName,
            type: itemObj.type
          });
        });
      });
    });
  });

  return transformed;
};

// Helper: Convert backend plan.days to frontend format
const transformPlanDaysForFrontend = (days) => {
  const transformed = {};

  Object.entries(days).forEach(([day, meals]) => {
    transformed[day] = { breakfast: {}, lunch: {}, dinner: {} };

    ['breakfast', 'lunch', 'dinner'].forEach(mealType => {
      const items = meals[mealType] || [];
      items.forEach(item => {
        if (!transformed[day][mealType][item.category]) {
          transformed[day][mealType][item.category] = [];
        }
        transformed[day][mealType][item.category].push(item.name);
      });
    });
  });

  return transformed;
};

// const createWeeklyMealPlan = async (req, res) => {
//   try {
//     const { weekStartDate, createdBy, days } = req.body;

//     // Fetch categories from DB to get item types
//     const categories = await Category.find({});

//     // Transform frontend structure to backend schema format
//     const transformedDays = transformPlanDaysForDB(days, categories);

//     const plan = new WeeklyMealPlan({
//       weekStartDate,
//       createdBy,
//       days: transformedDays
//     });

//     await plan.save();
//     res.status(201).json(plan);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };


const createWeeklyMealPlan = async (req, res) => {
  try {
    const { weekStartDate, createdBy, days } = req.body;

    const newPlanDate = new Date(weekStartDate);
    newPlanDate.setHours(0, 0, 0, 0);

    // Get the most recent plan created by this user
    const latestPlan = await WeeklyMealPlan.findOne({ createdBy })
      .sort({ weekStartDate: -1 });

    if (latestPlan) {
      const lastPlanDate = new Date(latestPlan.weekStartDate);
      lastPlanDate.setHours(0, 0, 0, 0);

      // Allow only if newPlanDate is at least 6 days after the lastPlanDate
      const minAllowedDate = new Date(lastPlanDate);
      minAllowedDate.setDate(minAllowedDate.getDate() + 5);

      if (newPlanDate <= minAllowedDate) {
        return res.status(400).json({
          error: `You can only create a new weekly meal plan at least 5 days after the last one (${lastPlanDate.toDateString()}). Try a date after ${minAllowedDate.toDateString()}.`
        });
      }
    }

    // Fetch categories
    const categories = await Category.find({});

    // Transform frontend to DB structure
    const transformedDays = transformPlanDaysForDB(days, categories);

    const plan = new WeeklyMealPlan({
      weekStartDate: newPlanDate,
      createdBy,
      days: transformedDays
    });

    await plan.save();
    res.status(201).json(plan);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

const getWeeklyMealPlan = async (req, res) => {
  try {
    const weekStartDate = new Date(req.query.date);
    const plan = await WeeklyMealPlan.findOne({ weekStartDate });

    if (!plan) return res.status(404).json({ error: 'Plan not found' });

    // Transform backend data to frontend expected format
    const transformedDays = transformPlanDaysForFrontend(plan.days);

    res.json({
      ...plan.toObject(),
      days: transformedDays
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// const getAllWeeklyMealPlans = async (req, res) => {
//   try {
//     const plans = await WeeklyMealPlan.find().sort({ weekStartDate: -1 }); // latest first

//     // Optionally transform each plan's `days` field for frontend
//     const transformedPlans = plans.map(plan => ({
//       ...plan.toObject(),
//       days: transformPlanDaysForFrontend(plan.days)
//     }));

//     res.json(transformedPlans);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

const getAllWeeklyMealPlans = async (req, res) => {
  try {
    const today = new Date();
    const plans = await WeeklyMealPlan.find({
      weekStartDate: { $gte: today }
    }).sort({ weekStartDate: 1 });

    const transformedPlans = plans.map(plan => ({
      ...plan.toObject(),
      days: transformPlanDaysForFrontend(plan.days)
    }));

    res.json(transformedPlans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// controller/menuController.js
const getUpcomingWeeklyPlans = async (req, res) => {
  try {
    const today = new Date();
    const plans = await WeeklyMealPlan.find({ weekStartDate: { $gte: today } })
      .sort({ weekStartDate: 1 });

    const transformedPlans = plans.map(plan => ({
      ...plan.toObject(),
      days: transformPlanDaysForFrontend(plan.days)
    }));

    res.json(transformedPlans);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


module.exports = {
  createWeeklyMealPlan,
  getWeeklyMealPlan,
  getAllWeeklyMealPlans,
  getUpcomingWeeklyPlans
};

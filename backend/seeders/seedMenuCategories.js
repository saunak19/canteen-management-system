const mongoose = require('mongoose');
const dotenv = require('dotenv');
const MenuCategoryMaster = require('../models/menuCategoryMaster');

// dotenv.config({ path: path.resolve(__dirname, '../config/config.env') });

const sampleCategories = [
    { categoryName: 'Main Course', items: [ { name: 'Paneer Butter Masala', type: 'veg' }, { name: 'Kadai Chicken', type: 'non-veg' } ] },
    { categoryName: 'Rice Items', items: [ { name: 'Jeera Rice', type: 'veg' }, { name: 'Egg Fried Rice', type: 'non-veg' } ] },
    { categoryName: 'Sweets / Desserts', items: [ { name: 'Gulab Jamun', type: 'veg' }, { name: 'Rasgulla', type: 'veg' } ] },
    { categoryName: 'Snacks / Starters', items: [ { name: 'Samosa', type: 'veg' }, { name: 'Chicken Lollipop', type: 'non-veg' } ] },
    { categoryName: 'Breads / Roti / Paratha', items: [ { name: 'Tandoori Roti', type: 'veg' }, { name: 'Aloo Paratha', type: 'veg' } ] },
    { categoryName: 'Curries / Gravies', items: [ { name: 'Rajma', type: 'veg' }, { name: 'Chicken Curry', type: 'non-veg' } ] },
    { categoryName: 'Dry Sabzi / Vegetables', items: [ { name: 'Aloo Gobi', type: 'veg' }, { name: 'Bhindi Fry', type: 'veg' } ] },
    { categoryName: 'Dal / Lentils', items: [ { name: 'Dal Tadka', type: 'veg' }, { name: 'Dal Fry', type: 'veg' } ] },
    { categoryName: 'Salads', items: [ { name: 'Cucumber Salad', type: 'veg' }, { name: 'Mixed Veg Salad', type: 'veg' } ] },
    { categoryName: 'Pickles / Chutneys', items: [ { name: 'Mango Pickle', type: 'veg' }, { name: 'Green Chutney', type: 'veg' } ] },
    { categoryName: 'Beverages', items: [ { name: 'Tea', type: 'veg' }, { name: 'Buttermilk', type: 'veg' } ] },
    { categoryName: 'Soups', items: [ { name: 'Tomato Soup', type: 'veg' }, { name: 'Chicken Soup', type: 'non-veg' } ] },
    { categoryName: 'Fruits', items: [ { name: 'Banana', type: 'veg' }, { name: 'Papaya', type: 'veg' } ] },
    { categoryName: 'Special Items / Regional Dishes', items: [ { name: 'Pav Bhaji', type: 'veg' }, { name: 'Sarson da Saag', type: 'veg' } ] },
    { categoryName: 'Side Dishes', items: [ { name: 'Boiled Egg', type: 'non-veg' }, { name: 'Fried Papad', type: 'veg' } ] },
    { categoryName: 'Breakfast Items', items: [ { name: 'Idli', type: 'veg' }, { name: 'Poha', type: 'veg' } ] }
  ];

const seedMenuCategories = async () => {
  try {
    // console.log('Connecting to DB URL:', process.env.DB_URL);  // debug line
    await mongoose.connect('mongodb://localhost:27017/DineApp');
    await MenuCategoryMaster.deleteMany();
    await MenuCategoryMaster.insertMany(sampleCategories);
    console.log('✅ Categories seeded with Veg/Non-Veg flags');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedMenuCategories();


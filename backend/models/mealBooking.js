const mongoose = require('mongoose');

// const mealBookingSchema = new mongoose.Schema({
//   employeeId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User', // assuming your user model
//     required: true
//   },
//   mealType: {
//     type: String,
//     enum: ['breakfast', 'lunch', 'dinner'],
//     required: true
//   },
//   menuItem: {
//     name: String,
//     category: String,
//     type: String
//   },
//   timeSlot: String, // e.g. "8:00 AM - 9:00 AM"
//   bookingDate: {
//     type: Date,
//     default: Date.now
//   },
//   mealDate: {
//     type: Date,
//     required: true
//   }
// });




const mealBookingSchema = new mongoose.Schema({
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mealType: { type: String, enum: ['breakfast', 'lunch', 'dinner'], required: true },
    menuItem: {
      name: { type: String, required: true },
      category: { type: String, required: true },
      type: { type: String, enum: ['Veg', 'Non-Veg'], required: true }
    },
    timeSlot: { type: String, required: true },
    mealDate: { type: Date, required: true }
  });
  


module.exports = mongoose.model('MealBooking', mealBookingSchema);

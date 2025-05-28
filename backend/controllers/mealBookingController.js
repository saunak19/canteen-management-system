// const MealBooking = require('../models/mealBooking');

// const bookMeal = async (req, res) => {
//     try {
//       const { employeeId, mealType, menuItem, timeSlot, mealDate } = req.body;
  
//       // Prevent duplicate booking
//       const existingBooking = await MealBooking.findOne({
//         employeeId,
//         mealType,
//         mealDate: new Date(mealDate)
//       });
  
//       if (existingBooking) {
//         return res.status(400).json({ error: 'You already booked this meal on this date' });
//       }
  
//       const booking = new MealBooking({
//         employeeId,
//         mealType,
//         menuItem,
//         timeSlot,
//         mealDate: new Date(mealDate)
//       });
  
//       await booking.save();
//       res.status(201).json({ message: 'Meal booked successfully', booking });
//     } catch (err) {
//       res.status(400).json({ error: err.message });
//     }
//   };
  

// const getBookingsByEmployee = async (req, res) => {
//   try {
//     const { employeeId } = req.params;
//     const bookings = await MealBooking.find({ employeeId });
//     res.json(bookings);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// module.exports = {
//   bookMeal,
//   getBookingsByEmployee
// };

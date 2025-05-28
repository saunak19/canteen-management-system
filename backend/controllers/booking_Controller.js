const Booking = require('../models/Booking');
const User = require('../models/userModel'); // import User model

const allowedMealTimes = {
  breakfast: '08:00',
  lunch: '13:00',
  dinner: '20:00',
};

const isSameDate = (d1, d2) =>
  d1.getFullYear() === d2.getFullYear() &&
  d1.getMonth() === d2.getMonth() &&
  d1.getDate() === d2.getDate();

const isBookingTooLateForToday = (mealType, mealDateStr) => {
  const now = new Date();
  const mealDate = new Date(mealDateStr);

  if (!isSameDate(now, mealDate)) return false;

  const [hour, minute] = allowedMealTimes[mealType].split(':').map(Number);
  mealDate.setHours(hour, minute, 0, 0);

  const diffMs = mealDate - now;
  const diffHours = diffMs / (1000 * 60 * 60);

  return diffHours < 2;
};

exports.bulkBookMeals = async (req, res) => {
  const { bookings } = req.body;

  if (!Array.isArray(bookings) || bookings.length === 0) {
    return res.status(400).json({ error: 'No bookings provided.' });
  }

  try {
    const insertOps = [];

    for (const booking of bookings) {
      const { employeeId, mealType, mealDate, timeSlot } = booking;

      if (!employeeId || !mealType || !mealDate) {
        continue;
      }

      // ✅ Fetch user and check block status
      const user = await User.findById(employeeId);
      if (!user) {
        continue; // skip invalid user
      }

      if (user.blocked) {
        return res.status(403).json({
          error: `User ${user.name} is blocked and cannot book meals.`,
        });
      }

      if (isBookingTooLateForToday(mealType, mealDate)) {
        return res.status(400).json({
          error: `Too late to book ${mealType} for ${mealDate}. Must be booked 2 hours in advance for today.`,
        });
      }

      const exists = await Booking.findOne({ employeeId, mealType, mealDate });
      if (!exists) {
        insertOps.push({ employeeId, mealType, mealDate, timeSlot: timeSlot || null });
      }
    }

    if (insertOps.length === 0) {
      return res.status(400).json({ message: 'All bookings already exist or are invalid.' });
    }

    await Booking.insertMany(insertOps);
    res.status(201).json({ message: 'Bookings created successfully.' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error while booking meals.' });
  }
};

// Get bookings for upcoming dates
exports.getEmployeeBookings = async (req, res) => {
  try {
    const { employeeId } = req.params;
    const today = new Date().toISOString().split('T')[0];

    const bookings = await Booking.find({
      employeeId,
      mealDate: { $gte: today }
    }).sort({ mealDate: 1 });

    res.json(bookings);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch bookings.' });
  }
};

//cancel meal
exports.cancelMeal = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }
    await Booking.findByIdAndDelete(req.params.bookingId);
    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/v1/booking/all
exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate("employeeId", "name email role") // Populate employee details
      .sort({ mealDate: 1 });

    res.status(200).json({ success: true, bookings });
  } catch (error) {
    console.error("Error fetching all bookings:", error);
    res.status(500).json({ success: false, message: "Failed to fetch bookings." });
  }
};
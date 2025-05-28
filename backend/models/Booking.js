const mongoose = require("mongoose")

const bookingSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner'],
    required: true
  },
  mealDate: {
    type: String, // YYYY-MM-DD
    required: true
  },
  timeSlot: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Prevent duplicate booking (employee + mealType + mealDate)
bookingSchema.index({ employeeId: 1, mealType: 1, mealDate: 1 }, { unique: true });

module.exports = mongoose.model('Booking', bookingSchema);

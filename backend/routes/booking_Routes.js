const express = require('express');
const router = express.Router();
const { bulkBookMeals, getEmployeeBookings,cancelMeal,getAllBookings  } = require('../controllers/booking_Controller');

// POST /api/v1/booking/bulk
router.post('/booking/bulk', bulkBookMeals);
router.get("/booking/all", getAllBookings);
// GET /api/v1/booking/:employeeId
router.get('/booking/:employeeId', getEmployeeBookings);
router.delete('/booking/cancel/:bookingId',cancelMeal)

module.exports = router;

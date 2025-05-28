/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const BookedMeals = () => {
  const [bookings, setBookings] = useState([]);

  const fetchBookings = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/booking/my", {
        withCredentials: true,
      });
      setBookings(res.data.bookings);
    } catch (err) {
      toast.error("Failed to fetch booked meals");
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-center mb-6">My Booked Meals</h2>
      {bookings.length > 0 ? (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking._id} className="border rounded p-4 shadow">
              <p><strong>Date:</strong> {new Date(booking.bookedAt).toLocaleDateString()}</p>
              <p><strong>Day:</strong> {booking.menu.day}</p>
              <p><strong>Meal Type:</strong> {booking.mealType.toUpperCase()}</p>
              <p><strong>Time Slot:</strong> {booking.timeSlot}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No meals booked yet.</p>
      )}
    </div>
  );
};

export default BookedMeals;
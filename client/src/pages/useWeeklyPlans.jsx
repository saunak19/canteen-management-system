import React, { useState } from 'react';
import useWeeklyPlans from '../hooks/useWeeklyPlans';
import axios from 'axios';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const WeeklyMenuBooking = ({ employeeId }) => {
  const { plans, loading } = useWeeklyPlans();
  const [selectedSlot, setSelectedSlot] = useState('');

  const handleBook = async (mealType, item, date) => {
    if (!selectedSlot) {
      toast.warning('Please select a time slot');
      return;
    }

    try {
      await axios.post('/api/v1/bookings', {
        employeeId,
        mealType,
        menuItem: item,
        timeSlot: selectedSlot,
        mealDate: date
      });
      toast.success(`${mealType} booked for ${date}`);
    } catch (err) {
      toast.error(err.response?.data?.error || 'Booking failed');
    }
  };

  if (loading) return <div className="text-center p-4">Loading plans...</div>;

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Weekly Meal Plans</h1>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Select Time Slot:</label>
        <select
          className="p-2 border rounded w-full"
          value={selectedSlot}
          onChange={(e) => setSelectedSlot(e.target.value)}
        >
          <option value="">-- Choose a time slot --</option>
          <option value="8:00 AM - 9:00 AM">8:00 AM - 9:00 AM</option>
          <option value="1:00 PM - 2:00 PM">1:00 PM - 2:00 PM</option>
          <option value="7:00 PM - 8:00 PM">7:00 PM - 8:00 PM</option>
        </select>
      </div>

      {plans.map((plan, idx) => (
        <div key={idx} className="mb-6 border rounded-lg shadow p-4 bg-white">
          <h2 className="text-xl font-semibold mb-2">
            Week starting: {new Date(plan.weekStartDate).toLocaleDateString()}
          </h2>

          {Object.entries(plan.days).map(([day, meals]) => (
            <div key={day} className="mb-4">
              <h3 className="text-lg font-medium text-blue-600 mb-2">{day}</h3>

              {['breakfast', 'lunch', 'dinner'].map((mealType) => (
                <div key={mealType} className="mb-3">
                  <h4 className="font-semibold capitalize mb-1">{mealType}</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {Object.entries(meals[mealType] || {}).map(([category, items]) => (
                      items.map((itemName, i) => {
                        const item = { name: itemName, category, type: 'Veg' }; // or fetch type from backend if needed
                        const mealDate = new Date(plan.weekStartDate);
                        const offset = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'].indexOf(day);
                        mealDate.setDate(mealDate.getDate() + offset);
                        const formattedDate = mealDate.toISOString().split('T')[0];

                        return (
                          <div
                            key={`${mealType}-${itemName}-${i}`}
                            className="border rounded p-3 bg-gray-50 shadow-sm"
                          >
                            <p className="font-medium">{itemName}</p>
                            <p className="text-sm text-gray-600">{category}</p>
                            <button
                              onClick={() => handleBook(mealType, item, formattedDate)}
                              className="mt-2 px-3 py-1 bg-green-500 hover:bg-green-600 text-white rounded"
                            >
                              Book
                            </button>
                          </div>
                        );
                      })
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default WeeklyMenuBooking;

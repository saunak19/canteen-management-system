/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "../api/axiosInstance";
import { getUserFromStorage } from "../features/getUserFromStorage";
import Navbar from "../components/Navbar";

const meals = ["breakfast", "lunch", "dinner"];
const currentYear = new Date().getFullYear();

// Meal time configurations
const mealTimeConfig = {
  breakfast: {
    slots: [
      { value: "8:00 AM - 9:00 AM", time: "08:00" },
    ],
    defaultSlot: "8:00 AM - 9:00 AM",
    cutoffHours: 2
  },
  lunch: {
    slots: [
      { value: "1:00 PM - 2:00 PM", time: "13:00" },
    ],
    defaultSlot: "1:00 PM - 2:00 PM",
    cutoffHours: 2
  },
  dinner: {
    slots: [
      { value: "8:00 PM - 9:00 PM", time: "20:00" }
    ],
    defaultSlot: "8:00 PM - 9:00 PM",
    cutoffHours: 2
  }
};

const EmployeeMealBooking = () => {
    const employeeID = getUserFromStorage();
    const [mode, setMode] = useState("daily");
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedDates, setSelectedDates] = useState([]);
    const [mealSelections, setMealSelections] = useState({
      breakfast: false,
      lunch: false,
      dinner: false,
    });
    const [employeeId, setEmployeeId] = useState(employeeID._id);
    const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
    const [selectedWeekStart, setSelectedWeekStart] = useState(null);
  
    // Function to get date in YYYY-MM-DD format without timezone issues
    const getFormattedDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };
  
    // Check if a specific time slot is still available
    const isSlotAvailable = (mealType, slotTime, date) => {
      const now = new Date();
      const bookingDate = new Date(date);
      
      const slotConfig = mealTimeConfig[mealType].slots.find(
        slot => slot.time === slotTime
      );
      
      if (!slotConfig) return false;
      
      const [hour, minute] = slotConfig.time.split(':').map(Number);
      const slotDateTime = new Date(bookingDate);
      slotDateTime.setHours(hour, minute, 0, 0);
      
      const diffMs = slotDateTime - now;
      const diffHours = diffMs / (1000 * 60 * 60);
      
      return diffHours > mealTimeConfig[mealType].cutoffHours;
    };
  
    // Check if meal selection should be disabled
    const isMealDisabled = (mealType) => {
      if (mode !== "daily") return false;
      return !mealTimeConfig[mealType].slots.some(slot => 
        isSlotAvailable(mealType, slot.time, selectedDate)
      );
    };
  
    // Utility: Get all week start dates in a month
    const getWeekStartsInMonth = (year, month) => {
      const date = new Date(year, month, 1);
      const weeks = [];
      while (date.getMonth() === month) {
        if (date.getDay() === 1 || weeks.length === 0) {
          weeks.push(new Date(date));
        }
        date.setDate(date.getDate() + 1);
      }
      return weeks;
    };
  
    useEffect(() => {
      if (mode === "weekly" && selectedWeekStart) {
        const week = Array.from({ length: 7 }, (_, i) => {
          const d = new Date(selectedWeekStart);
          d.setDate(d.getDate() + i);
          return d;
        });
        setSelectedDates(week);
      }
  
      if (mode === "monthly") {
        const start = new Date(currentYear, selectedMonth, 1);
        const dates = [];
        while (start.getMonth() === selectedMonth) {
          dates.push(new Date(start));
          start.setDate(start.getDate() + 1);
        }
        setSelectedDates(dates);
      }
  
      if (mode === "daily") {
        setSelectedDates([selectedDate]);
      }
    }, [mode, selectedDate, selectedWeekStart, selectedMonth]);
  
    const handleMealToggle = (meal) => {
      if (mode === "daily" && isMealDisabled(meal)) {
        toast.warning(`Cannot book ${meal} for selected date as the time has passed`);
        return;
      }
      setMealSelections({ ...mealSelections, [meal]: !mealSelections[meal] });
    };
  
    const handleBooking = async () => {
      const selectedMeals = Object.keys(mealSelections).filter(
        meal => mealSelections[meal]
      );
      
      if (!selectedMeals.length) {
        return toast.error("Please select at least one meal.");
      }
  
      const bookings = [];
      const errors = [];
  
      selectedDates.forEach(date => {
        const isoDate = getFormattedDate(date); // Use our formatted date function
  
        selectedMeals.forEach(mealType => {
          const defaultSlot = mealTimeConfig[mealType].defaultSlot;
          const slotTime = mealTimeConfig[mealType].slots.find(
            slot => slot.value === defaultSlot
          )?.time;
          
          if (!isSlotAvailable(mealType, slotTime, date)) {
            errors.push(`Time slot not available for ${mealType} on ${isoDate}`);
            return;
          }
          
          bookings.push({
            employeeId,
            mealType,
            mealDate: isoDate, // This will now be the correct date
            timeSlot: defaultSlot
          });
        });
      });
  
      if (errors.length > 0) {
        errors.forEach(error => toast.warning(error));
      }
  
      if (bookings.length === 0) {
        return toast.error("No valid bookings could be made.");
      }
  
      try {
        await axios.post('/booking/bulk', { bookings });
        toast.success(`Successfully booked ${bookings.length} meal(s)!`);
        setMealSelections({
          breakfast: false,
          lunch: false,
          dinner: false,
        });
      } catch (err) {
        toast.error('Error in booking!');
        console.error(err);
      }
    };

  const renderModeSelector = () => (
    <div className="flex justify-center gap-4 mb-8">
      {["daily", "weekly", "monthly"].map((opt) => (
        <button
          key={opt}
          className={`px-6 py-3 rounded-lg font-medium text-sm transition-all ${
            mode === opt 
              ? "bg-indigo-600 text-white shadow-md" 
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
          onClick={() => setMode(opt)}
        >
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  );

  const renderCalendarOrSelectors = () => {
    if (mode === "daily") {
      return (
        <div className="mb-8">
          <div className="flex justify-center">
            <Calendar 
              onChange={setSelectedDate} 
              value={selectedDate} 
              className="border rounded-lg shadow-sm p-4"
              minDate={new Date()}
            />
          </div>
          <p className="text-center mt-3 text-gray-600 font-medium">
            Selected: {selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      );
    }

    if (mode === "weekly") {
      const weeks = getWeekStartsInMonth(currentYear, new Date().getMonth());
      return (
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-medium mb-2">Select Week</label>
          <select
            className="block w-full max-w-md mx-auto border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            onChange={(e) => setSelectedWeekStart(new Date(e.target.value))}
          >
            <option value="">Select a week</option>
            {weeks.map((d, i) => (
              <option key={i} value={d.toISOString()}>
                Week of {d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(d.getTime() + 6 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </option>
            ))}
          </select>
        </div>
      );
    }

    if (mode === "monthly") {
      return (
        <div className="mb-8">
          <label className="block text-gray-700 text-sm font-medium mb-2">Select Month</label>
          <select
            className="block w-full max-w-md mx-auto border border-gray-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
          >
            {Array.from({ length: 12 }, (_, i) => (
              <option key={i} value={i}>
                {new Date(currentYear, i).toLocaleString("default", {
                  month: "long",
                })}
              </option>
            ))}
          </select>
        </div>
      );
    }
  };

  return (
  <div>
    <Navbar/>
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Booking</h1>
            <p className="text-gray-600">Book your meals for the selected period</p>
          </div>

          <ToastContainer position="top-center" autoClose={3000} />

          {renderModeSelector()}
          {renderCalendarOrSelectors()}

          <div className="bg-gray-50 p-4 rounded-lg mb-8">
            <p className="text-center text-gray-700 font-medium">
              You have selected <span className="text-indigo-600 font-bold">{selectedDates.length}</span> {selectedDates.length === 1 ? 'date' : 'dates'}
            </p>
          </div>

          <div className="mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4 text-center">Select Meals</h3>
            <div className="flex flex-wrap justify-center gap-6">
              {meals.map((meal) => (
                <div 
                  key={meal} 
                  className={`px-6 py-3 rounded-lg cursor-pointer transition-all ${
                    mealSelections[meal] 
                      ? 'bg-indigo-100 border-2 border-indigo-300' 
                      : isMealDisabled(meal)
                        ? 'bg-gray-100 border-2 border-gray-200 cursor-not-allowed opacity-50'
                        : 'bg-gray-100 border-2 border-gray-200 hover:bg-gray-50'
                  }`}
                  onClick={() => !isMealDisabled(meal) && handleMealToggle(meal)}
                >
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={mealSelections[meal]}
                      onChange={() => !isMealDisabled(meal) && handleMealToggle(meal)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                      disabled={isMealDisabled(meal)}
                    />
                    <span className="text-gray-700 capitalize">{meal}</span>
                    {isMealDisabled(meal) && (
                      <span className="text-xs text-red-500">(Unavailable)</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <button
              className="w-full max-w-md mx-auto block bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-md shadow-md transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleBooking}
              disabled={Object.values(mealSelections).every(v => !v)}
            >
              Confirm Bookings
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
};

export default EmployeeMealBooking;
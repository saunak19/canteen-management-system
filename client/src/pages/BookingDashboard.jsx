import React, { useEffect, useState } from "react";
import { fetchAllBookings } from "../api/userApi";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

const BookingDashboard = () => {
  const [bookings, setBookings] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [search, setSearch] = useState("");
  const [mealTypeFilter, setMealTypeFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [groupBy, setGroupBy] = useState("date");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setIsLoading(true);
      const response = await fetchAllBookings();
      setBookings(response.data.bookings);
      setFilteredBookings(response.data.bookings);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
      toast.error("Failed to load bookings", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    filterBookings(value, mealTypeFilter, fromDate, toDate);
  };

  const handleMealTypeFilter = (e) => {
    const value = e.target.value;
    setMealTypeFilter(value);
    filterBookings(search, value, fromDate, toDate);
  };

  const handleFromDateChange = (e) => {
    const value = e.target.value;
    setFromDate(value);
    filterBookings(search, mealTypeFilter, value, toDate);
  };

  const handleToDateChange = (e) => {
    const value = e.target.value;
    setToDate(value);
    filterBookings(search, mealTypeFilter, fromDate, value);
  };

  const filterBookings = (searchTerm, mealFilter, from, to) => {
    const filtered = bookings.filter((booking) => {
      const matchesName = booking.employeeId?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesMeal = mealFilter ? booking.mealType === mealFilter : true;

      const bookingDate = new Date(booking.mealDate)
        .toISOString()
        .split("T")[0];
      const isAfterFrom = from ? bookingDate >= from : true;
      const isBeforeTo = to ? bookingDate <= to : true;

      return matchesName && matchesMeal && isAfterFrom && isBeforeTo;
    });

    setFilteredBookings(filtered);
  };

  const groupByDate = () => {
    const grouped = {};

    filteredBookings.forEach((booking) => {
      const date = new Date(booking.mealDate).toISOString().split("T")[0];
      if (!grouped[date])
        grouped[date] = { breakfast: 0, lunch: 0, dinner: 0, bookings: [] };

      grouped[date][booking.mealType]++;
      grouped[date].bookings.push(booking);
    });

    return grouped;
  };

  const groupByEmployee = () => {
    const grouped = {};

    filteredBookings.forEach((booking) => {
      const name = booking.employeeId?.name || "Unknown";
      if (!grouped[name]) grouped[name] = [];

      grouped[name].push(booking);
    });

    return grouped;
  };

  const groupedData = groupBy === "date" ? groupByDate() : groupByEmployee();

  if (isLoading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className='min-h-screen bg-gray-50 p-4 md:p-8'>
        <ToastContainer />
        <div className='max-w-7xl mx-auto'>
          <div className='bg-white shadow rounded-lg overflow-hidden'>
            <div className='px-6 py-5 border-b border-gray-200'>
              <h2 className='text-2xl font-semibold text-gray-800'>
                Booking Dashboard
              </h2>
              <p className='mt-1 text-sm text-gray-500'>
                View and manage all meal bookings
              </p>
            </div>

            <div className='px-6 py-4 bg-gray-50 border-b border-gray-200'>
              <div className='grid grid-cols-1 md:grid-cols-5 gap-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Search Employee
                  </label>
                  <input
                    type='text'
                    placeholder='Search by name...'
                    value={search}
                    onChange={handleSearch}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Meal Type
                  </label>
                  <select
                    value={mealTypeFilter}
                    onChange={handleMealTypeFilter}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  >
                    <option value=''>All Meals</option>
                    <option value='breakfast'>Breakfast</option>
                    <option value='lunch'>Lunch</option>
                    <option value='dinner'>Dinner</option>
                  </select>
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    From Date
                  </label>
                  <input
                    type='date'
                    value={fromDate}
                    onChange={handleFromDateChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    To Date
                  </label>
                  <input
                    type='date'
                    value={toDate}
                    onChange={handleToDateChange}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-1'>
                    Group By
                  </label>
                  <select
                    value={groupBy}
                    onChange={(e) => setGroupBy(e.target.value)}
                    className='w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500'
                  >
                    <option value='date'>Date</option>
                    <option value='employee'>Employee</option>
                  </select>
                </div>
              </div>
            </div>

            <div className='px-6 py-4'>
              {filteredBookings.length === 0 ? (
                <div className='text-center py-12'>
                  <svg
                    className='mx-auto h-12 w-12 text-gray-400'
                    fill='none'
                    viewBox='0 0 24 24'
                    stroke='currentColor'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2'
                    />
                  </svg>
                  <h3 className='mt-2 text-lg font-medium text-gray-900'>
                    No bookings found
                  </h3>
                  <p className='mt-1 text-sm text-gray-500'>
                    Try adjusting your search or filter criteria
                  </p>
                </div>
              ) : groupBy === "date" ? (
                Object.entries(groupedData)
                  .sort(([dateA], [dateB]) => new Date(dateB) - new Date(dateA))
                  .map(([date, data]) => (
                    <div
                      key={date}
                      className='mb-8 border border-gray-200 rounded-lg overflow-hidden'
                    >
                      <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
                        <div className='flex justify-between items-center'>
                          <h3 className='text-lg font-medium text-gray-900'>
                            {new Date(date).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </h3>
                          <div className='flex space-x-4 text-sm'>
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full bg-yellow-100 text-yellow-800'>
                              🥣 {data.breakfast}
                            </span>
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800'>
                              🍛 {data.lunch}
                            </span>
                            <span className='inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800'>
                              🍽️ {data.dinner}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className='overflow-x-auto'>
                        <table className='min-w-full divide-y divide-gray-200'>
                          <thead className='bg-gray-50'>
                            <tr>
                              <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                              >
                                Employee
                              </th>
                              <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                              >
                                Email
                              </th>
                              <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                              >
                                Meal Type
                              </th>
                              <th
                                scope='col'
                                className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                              >
                                Time Slot
                              </th>
                            </tr>
                          </thead>
                          <tbody className='bg-white divide-y divide-gray-200'>
                            {data.bookings.map((booking) => (
                              <tr key={booking._id}>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                  <div className='flex items-center'>
                                    <div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center'>
                                      <span className='text-gray-600 font-medium'>
                                        {booking.employeeId?.name
                                          ?.charAt(0)
                                          ?.toUpperCase() || "U"}
                                      </span>
                                    </div>
                                    <div className='ml-4'>
                                      <div className='text-sm font-medium text-gray-900'>
                                        {booking.employeeId?.name || "Unknown"}
                                      </div>
                                    </div>
                                  </div>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  {booking.employeeId?.email || "-"}
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap'>
                                  <span
                                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                                      booking.mealType === "breakfast"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : booking.mealType === "lunch"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {booking.mealType}
                                  </span>
                                </td>
                                <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                  {booking.timeSlot || "-"}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))
              ) : (
                Object.entries(groupedData).map(([employee, bookings]) => (
                  <div
                    key={employee}
                    className='mb-8 border border-gray-200 rounded-lg overflow-hidden'
                  >
                    <div className='bg-gray-50 px-4 py-3 border-b border-gray-200'>
                      <div className='flex items-center'>
                        <div className='flex-shrink-0 h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center mr-3'>
                          <span className='text-gray-600 font-medium'>
                            {employee.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <h3 className='text-lg font-medium text-gray-900'>
                          {employee}
                        </h3>
                      </div>
                    </div>
                    <div className='overflow-x-auto'>
                      <table className='min-w-full divide-y divide-gray-200'>
                        <thead className='bg-gray-50'>
                          <tr>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              Date
                            </th>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              Meal Type
                            </th>
                            <th
                              scope='col'
                              className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'
                            >
                              Time Slot
                            </th>
                          </tr>
                        </thead>
                        <tbody className='bg-white divide-y divide-gray-200'>
                          {bookings.map((booking) => (
                            <tr key={booking._id}>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                {new Date(
                                  booking.mealDate
                                ).toLocaleDateString()}
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap'>
                                <span
                                  className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full capitalize ${
                                    booking.mealType === "breakfast"
                                      ? "bg-yellow-100 text-yellow-800"
                                      : booking.mealType === "lunch"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-blue-100 text-blue-800"
                                  }`}
                                >
                                  {booking.mealType}
                                </span>
                              </td>
                              <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                                {booking.timeSlot || "-"}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDashboard;

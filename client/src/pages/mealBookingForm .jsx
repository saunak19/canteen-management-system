import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

const MealBookingForm = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({}); // { [menuId]: "lunch" }

  const fetchMenus = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/menu", {
        withCredentials: true,
      });
      setMenus(res.data.menus || []);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = async (menuId) => {
    const mealType = booking[menuId];
    if (!mealType) {
      toast.error("Please select a meal type before booking.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/v1/book",
        { menuId, mealType },
        {
          headers: { "Content-Type": "application/json" },
          withCredentials: true,
        }
      );
      toast.success(res.data.message || "Meal booked successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to book meal");
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  if (loading) return <div className='text-center py-10'>Loading...</div>;

  return (
    <div>
      <Navbar/>
      <div className='p-6'>
        <h2 className='text-2xl font-semibold mb-6 text-center'>Weekly Menu</h2>
        <div className='overflow-x-auto rounded-lg shadow-md'>
          <table className='min-w-full bg-white border border-gray-200'>
            <thead className='bg-gray-100 text-gray-700'>
              <tr>
                <th className='border px-4 py-3'>Day</th>
                <th className='border px-4 py-3'>Meals</th>
                <th className='border px-4 py-3'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {menus.map((menu) => (
                <tr key={menu._id} className='text-center hover:bg-gray-50'>
                  <td className='border px-4 py-2 font-medium'>{menu.day}</td>
                  <td className='border px-4 py-2 text-left'>
                    {menu.meals.map((meal, idx) => (
                      <div key={idx} className='mb-3'>
                        <p className='font-semibold text-indigo-600'>
                          {meal.type.toUpperCase()}
                        </p>
                        <ul className='list-disc ml-6 text-sm text-gray-700'>
                          {meal.items.map((item, index) => (
                            <li key={index}>
                              {item.name} - ₹{item.price}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </td>
                  <td className='border px-4 py-2 space-y-2'>
                    <select
                      className='w-full border px-2 py-1 rounded'
                      value={booking[menu._id] || ""}
                      onChange={(e) =>
                        setBooking({ ...booking, [menu._id]: e.target.value })
                      }
                    >
                      <option value=''>Select Meal</option>
                      <option value='breakfast'>Breakfast</option>
                      <option value='lunch'>Lunch</option>
                      <option value='dinner'>Dinner</option>
                    </select>
                    <button
                      onClick={() => handleBooking(menu._id)}
                      className='bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded w-full'
                    >
                      Book
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ToastContainer position='top-right' autoClose={1000} />
      </div>
    </div>
  );
};

export default MealBookingForm;

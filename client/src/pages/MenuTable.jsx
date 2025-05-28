import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Navbar from "../components/Navbar";

const MenuTable = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchMenus = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/v1/menu", {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      setMenus(res.data.menus || []);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirm = window.confirm("Are you sure you want to delete this menu?");
    if (!confirm) return;

    try {
      await axios.delete(`http://localhost:4000/api/v1/menu/${id}`, {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      });
      toast.success("Menu deleted successfully");
      fetchMenus();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Error deleting menu");
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-800">Weekly Menu Management</h2>
            <p className="text-gray-600 mt-1">View and manage your weekly meal offerings</p>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Day</th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">Meals</th>
                  <th className="px-6 py-4 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menus.length > 0 ? (
                  menus.map((menu) => (
                    <tr key={menu._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="font-medium text-gray-900">{menu.day}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-4">
                          {menu.meals.map((meal, index) => (
                            <div key={index}>
                              <p className="font-semibold text-blue-600">{meal.type.toUpperCase()}</p>
                              <ul className="mt-1 space-y-1">
                                {meal.items.map((item, idx) => (
                                  <li key={idx} className="flex justify-between text-sm text-gray-700">
                                    <span>{item.name}</span>
                                    <span className="font-medium">₹{item.price}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <button
                          onClick={() => {
                            setEditData(menu);
                            setIsEditing(true);
                          }}
                          className="mr-3 text-indigo-600 hover:text-indigo-900 transition-colors"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(menu._id)}
                          className="text-red-600 hover:text-red-900 transition-colors"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="px-6 py-8 text-center text-gray-500">
                      No menus available. Please add some menus to get started.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {isEditing && editData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">Edit Menu - {editData.day}</h2>
            </div>
            
            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
              {editData.meals.map((meal, mealIndex) => (
                <div key={mealIndex} className="space-y-3">
                  <h3 className="font-semibold text-gray-700 uppercase">{meal.type}</h3>
                  <div className="space-y-4">
                    {meal.items.map((item, itemIndex) => (
                      <div key={itemIndex} className="grid grid-cols-12 gap-4 items-center">
                        <div className="col-span-7">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Item Name</label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={item.name}
                            onChange={(e) => {
                              const newEditData = { ...editData };
                              newEditData.meals[mealIndex].items[itemIndex].name = e.target.value;
                              setEditData(newEditData);
                            }}
                          />
                        </div>
                        <div className="col-span-3">
                          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
                          <input
                            type="number"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={item.price}
                            onChange={(e) => {
                              const newEditData = { ...editData };
                              newEditData.meals[mealIndex].items[itemIndex].price = e.target.value;
                              setEditData(newEditData);
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-600 border border-transparent rounded-md text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                onClick={async () => {
                  try {
                    await axios.put(
                      `http://localhost:4000/api/v1/menu/${editData._id}`,
                      editData,
                      {
                        headers: {
                          "Content-Type": "application/json",
                        },
                        withCredentials: true,
                      }
                    );
                    toast.success("Menu updated successfully");
                    setIsEditing(false);
                    fetchMenus();
                  } catch (error) {
                    toast.error(error.response?.data?.message || "Update failed");
                  }
                }}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer 
        position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
};

export default MenuTable;
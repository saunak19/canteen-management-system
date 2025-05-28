import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const WeeklyMealPlan = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/v1/meal/all/weekly-meal-plan"
        );
        setPlans(res.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching weekly plans:", err);
        setError("Failed to load meal plans");
        setLoading(false);
      }
    };

    fetchPlans();
  }, []);

  const daysOfWeek = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  const mealTypes = ["breakfast", "lunch", "dinner"];

  const renderMealItems = (items) => {
    // Ensure items is always an array
    if (!Array.isArray(items)) return <span className="text-gray-400">—</span>;
    
    // Filter items properly by checking the type property
    const vegItems = items.filter(item => item.type === 'veg');
    const nonVegItems = items.filter(item => item.type === 'veg');

    return (
      <div className="space-y-2">
        {vegItems.length > 0 && (
          <div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <span className="text-xs font-medium text-gray-600">Veg</span>
            </div>
            <ul className="ml-5 space-y-1">
              {vegItems.map((item, idx) => (
                <li key={`veg-${idx}`} className="text-sm">
                  {item.name} ({item.category})
                </li>
              ))}
            </ul>
          </div>
        )}
        
        {nonVegItems.length > 0 && (
          <div>
            <div className="flex items-center mb-1">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <span className="text-xs font-medium text-gray-600">Non-Veg</span>
            </div>
            <ul className="ml-5 space-y-1">
              {nonVegItems.map((item, idx) => (
                <li key={`nonveg-${idx}`} className="text-sm">
                  {item.name} ({item.category})
                </li>
              ))}
            </ul>
          </div>
        )}

        {vegItems.length === 0 && nonVegItems.length === 0 && (
          <span className="text-gray-400">—</span>
        )}
      </div>
    );
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Loading meal plans...</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-500">{error}</p></div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-800 mb-8">Weekly Meal Plans</h2>
          
          {plans.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <p className="text-gray-600">No meal plans available. Create your first plan!</p>
            </div>
          ) : (
            <div className="space-y-8">
              {plans.map((plan) => (
                <div key={plan._id} className="bg-white rounded-xl shadow-md overflow-hidden">
                  <div className="p-6 bg-gradient-to-r from-green-500 to-green-600">
                    <h3 className="text-xl font-semibold text-white">
                      Week of {new Date(plan.weekStartDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </h3>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
                          {mealTypes.map((meal) => (
                            <th key={meal} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider capitalize">
                              {meal}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200">
                        {daysOfWeek.map((day) => (
                          <tr key={day} className="hover:bg-gray-50">
                            <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-900">
                              {day}
                            </td>
                            {mealTypes.map((meal) => {
                              const mealData = plan.days?.[day]?.[meal] || {};
                              const items = Object.entries(mealData).flatMap(
                                ([category, itemList]) => {
                                  // Ensure itemList is an array
                                  if (!Array.isArray(itemList)) return [];
                                  
                                  return itemList.map((item) => ({
                                    name: item.name || item, // Handle both object and string formats
                                    category,
                                    type: item.type || 'veg' // Default to veg if type not specified
                                  }));
                                }
                              );
                              
                              return (
                                <td key={meal} className="px-4 py-3">
                                  {renderMealItems(items)}
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default WeeklyMealPlan;
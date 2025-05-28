// import React, { useState } from "react";
// import { toast } from "react-toastify";
// import axios from "axios";
// import Navbar from "./Navbar";

// const AddMenu = () => {
//   const [menuData, setMenuData] = useState({
//     day: "Monday",
//     meals: [
//       { type: "breakfast", items: [{ name: "", price: "" }] },
//       { type: "lunch", items: [{ name: "", price: "" }] },
//       { type: "dinner", items: [{ name: "", price: "" }] },
//     ],
//   });

//   const handleItemChange = (mealType, index, field, value) => {
//     const updatedMeals = menuData.meals.map((meal) => {
//       if (meal.type === mealType) {
//         const updatedItems = [...meal.items];
//         updatedItems[index][field] = value;
//         return { ...meal, items: updatedItems };
//       }
//       return meal;
//     });
//     setMenuData({ ...menuData, meals: updatedMeals });
//   };

//   const addItem = (mealType) => {
//     const updatedMeals = menuData.meals.map((meal) => {
//       if (meal.type === mealType) {
//         return { ...meal, items: [...meal.items, { name: "", price: "" }] };
//       }
//       return meal;
//     });
//     setMenuData({ ...menuData, meals: updatedMeals });
//   };

//   const removeItem = (mealType, index) => {
//     const updatedMeals = menuData.meals.map((meal) => {
//       if (meal.type === mealType) {
//         const updatedItems = [...meal.items];
//         if (updatedItems.length > 1) {
//           updatedItems.splice(index, 1);
//           return { ...meal, items: updatedItems };
//         }
//       }
//       return meal;
//     });
//     setMenuData({ ...menuData, meals: updatedMeals });
//   };

//   const calculateMealTotal = (items) => {
//     return items.reduce((total, item) => {
//       const price = parseFloat(item.price);
//       return total + (isNaN(price) ? 0 : price);
//     }, 0);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const formattedData = {
//         day: menuData.day,
//         meals: menuData.meals.map((meal) => ({
//           type: meal.type,
//           items: meal.items
//             .filter((item) => item.name.trim() !== "")
//             .map((item) => ({
//               name: item.name.trim(),
//               price: parseFloat(item.price) || 0,
//             })),
//         })),
//       };

//       await axios.post("http://localhost:4000/api/v1/menu", formattedData, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//         withCredentials: true,
//       });

//       toast.success("✅ Menu added successfully!", {
//         position: "top-right",
//         autoClose: 3000,
//       });

//       setMenuData({
//         day: "Monday",
//         meals: [
//           { type: "breakfast", items: [{ name: "", price: "" }] },
//           { type: "lunch", items: [{ name: "", price: "" }] },
//           { type: "dinner", items: [{ name: "", price: "" }] },
//         ],
//       });
//     } catch (err) {
//       toast.error(
//         `❌ ${err.response?.data?.message || "Something went wrong"}`,
//         {
//           position: "top-right",
//           autoClose: 3000,
//         }
//       );
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <Navbar />
//       <div className="container mx-auto px-4 py-8">
//         <div className="max-w-3xl mx-auto">
//           <div className="bg-white rounded-xl shadow-md overflow-hidden">
//             <div className="p-6 border-b border-gray-200">
//               <h2 className="text-2xl font-bold text-gray-800">Add Weekly Menu</h2>
//               <p className="text-gray-600 mt-1">Create a new menu for your weekly meal offerings</p>
//             </div>

//             <form onSubmit={handleSubmit} className="p-6">
//               <div className="mb-6">
//                 <label className="block text-sm font-medium text-gray-700 mb-2">
//                   Select Day
//                 </label>
//                 <select
//                   value={menuData.day}
//                   onChange={(e) => setMenuData({ ...menuData, day: e.target.value })}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                 >
//                   {[
//                     "Monday",
//                     "Tuesday",
//                     "Wednesday",
//                     "Thursday",
//                     "Friday",
//                     "Saturday",
//                     "Sunday",
//                   ].map((day) => (
//                     <option key={day} value={day}>
//                       {day}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div className="space-y-8">
//                 {menuData.meals.map((meal) => (
//                   <div key={meal.type} className="border border-gray-200 rounded-lg p-5">
//                     <div className="flex justify-between items-center mb-4">
//                       <h3 className="text-lg font-semibold text-gray-800 capitalize">
//                         {meal.type}
//                       </h3>
//                       <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded-full">
//                         {meal.items.length} items
//                       </span>
//                     </div>

//                     <div className="space-y-4">
//                       {meal.items.map((item, index) => (
//                         <div key={index} className="grid grid-cols-12 gap-4 items-center">
//                           <div className="col-span-7">
//                             <input
//                               type="text"
//                               placeholder="Item name"
//                               value={item.name}
//                               onChange={(e) =>
//                                 handleItemChange(meal.type, index, "name", e.target.value)
//                               }
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                           </div>
//                           <div className="col-span-3">
//                             <input
//                               type="number"
//                               placeholder="Price (₹)"
//                               value={item.price}
//                               onChange={(e) =>
//                                 handleItemChange(meal.type, index, "price", e.target.value)
//                               }
//                               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//                             />
//                           </div>
//                           <div className="col-span-2">
//                             {meal.items.length > 1 && (
//                               <button
//                                 type="button"
//                                 onClick={() => removeItem(meal.type, index)}
//                                 className="w-full px-3 py-2 bg-red-100 text-red-600 rounded-md hover:bg-red-200 transition-colors"
//                               >
//                                 Remove
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <div className="flex justify-between items-center mt-4">
//                       <button
//                         type="button"
//                         onClick={() => addItem(meal.type)}
//                         className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center"
//                       >
//                         <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                           <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
//                         </svg>
//                         Add Item
//                       </button>
//                       <div className="text-sm font-medium text-gray-700">
//                         Subtotal: <span className="text-green-600">₹{calculateMealTotal(meal.items).toFixed(2)}</span>
//                       </div>
//                     </div>
//                   </div>
//                 ))}
//               </div>

//               <div className="mt-8">
//                 <button
//                   type="submit"
//                   className="w-full px-4 py-3 bg-blue-600 border border-transparent rounded-md shadow-sm text-lg font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
//                 >
//                   Submit Menu
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AddMenu;
// import React, { useState } from "react";

// const MealMenu = () => {
//   const [selectedMeal, setSelectedMeal] = useState("breakfast");

//   const menuData = {
//     // breakfast: ["Idli", "Dosa", "Poha", "Sandwich", "Paratha"],
//     // lunch: ["Rice", "Roti", "Paneer Masala", "Dal", "Salad"],
//     // dinner: ["Fried Rice", "Chapati", "Mixed Veg", "Dal Tadka", "Curd"],
//     // tea: ["Samosa", "Biscuits", "Pakora", "Banana Chips"],
//     // coffee: ["Cookies", "Brownie", "Muffin", "Choco Donut"],
//   };

//   const mealTypes = Object.keys(menuData);

//   return (
//     <div className="max-w-4xl mx-auto mt-10 p-4 bg-white shadow-lg rounded-xl">
//       <h1 className="text-2xl font-bold mb-6 text-center text-green-700">
//         Canteen Meal Menu
//       </h1>

//       {/* Meal Selector */}
//       <div className="flex justify-center gap-4 mb-6 flex-wrap">
//         {mealTypes.map((meal) => (
//           <button
//             key={meal}
//             onClick={() => setSelectedMeal(meal)}
//             className={`px-4 py-2 rounded-full text-sm font-semibold border transition ${
//               selectedMeal === meal
//                 ? "bg-green-600 text-white"
//                 : "bg-white border-gray-300 text-gray-600 hover:bg-gray-100"
//             }`}
//           >
//             {meal.charAt(0).toUpperCase() + meal.slice(1)}
//           </button>
//         ))}
//       </div>

//       {/* Menu Items */}
//       <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
//         {menuData[selectedMeal].map((item, index) => (
//           <div
//             key={index}
//             className="bg-green-50 border border-green-200 rounded-lg px-4 py-2 text-center font-medium text-green-800"
//           >
//             {item}
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default MealMenu;

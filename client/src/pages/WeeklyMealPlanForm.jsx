import React, { useEffect, useState } from "react";
import axios from "axios";
import { getUserFromStorage } from "../features/getUserFromStorage";
import Navbar from "../components/Navbar";

const daysOfWeek = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];
const meals = ["breakfast", "lunch", "dinner"];

const WeeklyMealPlanForm = () => {
  const user = getUserFromStorage();
  const [categories, setCategories] = useState([]);
  const [weekStartDate, setWeekStartDate] = useState("");
  const [createdBy] = useState(user?._id || "");
  const [planDays, setPlanDays] = useState({});
  const [selectedCategories, setSelectedCategories] = useState({});

  useEffect(() => {
    axios
      .get("http://localhost:4000/api/v1/menu/categories")
      .then((res) => setCategories(res.data || []))
      .catch((err) => console.error("Failed to load categories", err));
  }, []);

  useEffect(() => {
    const initPlan = {};
    const initSelectedCat = {};
    daysOfWeek.forEach((day) => {
      initPlan[day] = { breakfast: {}, lunch: {}, dinner: {} };
      meals.forEach((meal) => {
        initSelectedCat[`${day}-${meal}`] = [];
      });
    });
    setPlanDays(initPlan);
    setSelectedCategories(initSelectedCat);
  }, []);

  const handleCategoryChange = (day, mealType, event) => {
    const selectedOptions = Array.from(
      event.target.selectedOptions,
      (option) => option.value
    );
    const key = `${day}-${mealType}`;
    setSelectedCategories((prev) => ({
      ...prev,
      [key]: selectedOptions,
    }));
  };

  const toggleItem = (day, mealType, category, itemName) => {
    setPlanDays((prev) => {
      const currentItems = prev?.[day]?.[mealType]?.[category] || [];
      const exists = currentItems.includes(itemName);
      const updatedItems = exists
        ? currentItems.filter((item) => item !== itemName)
        : [...currentItems, itemName];

      return {
        ...prev,
        [day]: {
          ...prev[day],
          [mealType]: {
            ...prev[day][mealType],
            [category]: updatedItems,
          },
        },
      };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!weekStartDate) {
      alert("Please select a week start date");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/v1/meal/weekly-meal-plan", {
        weekStartDate,
        createdBy,
        days: planDays,
      });
      alert("Weekly meal plan created!");
    } catch (err) {
      alert("Failed to create weekly meal plan");
      console.error(err);
    }
  };

  const removeCategoryFromMeal = (day, mealType, category) => {
    const key = `${day}-${mealType}`;
    setSelectedCategories((prev) => ({
      ...prev,
      [key]: prev[key].filter((cat) => cat !== category),
    }));

    setPlanDays((prev) => {
      const updatedMealData = { ...prev[day][mealType] };
      delete updatedMealData[category];

      return {
        ...prev,
        [day]: {
          ...prev[day],
          [mealType]: updatedMealData,
        },
      };
    });
  };

  return (
    <>
      <div>
        <Navbar />
        <div className='max-w-5xl mx-auto p-6'>
          <h1 className='text-2xl font-bold mb-4'>Create Weekly Meal Plan</h1>

          <label className='block mb-4'>
            Week Start Date:{" "}
            <input
              type='date'
              value={weekStartDate}
              onChange={(e) => setWeekStartDate(e.target.value)}
              className='border p-2 rounded'
            />
          </label>

          <form onSubmit={handleSubmit} className='space-y-10'>
            {daysOfWeek.map((day) => (
              <div key={day} className='border p-4 rounded bg-white'>
                <h2 className='font-semibold text-xl mb-4'>{day}</h2>

                {meals.map((mealType) => {
                  const key = `${day}-${mealType}`;
                  const selectedCats = selectedCategories[key] || [];
                  const mealData = planDays[day]?.[mealType] || {};

                  return (
                    <div key={mealType} className='mb-8'>
                      <h3 className='font-semibold mb-2 capitalize'>
                        {mealType}
                      </h3>

                      <select
                        multiple
                        value={selectedCats}
                        onChange={(e) => handleCategoryChange(day, mealType, e)}
                        className='border p-2 rounded w-full mb-3'
                        size={Math.min(5, categories.length)}
                      >
                        {categories.map((cat) => (
                          <option key={cat._id} value={cat.categoryName}>
                            {cat.categoryName}
                          </option>
                        ))}
                      </select>

                      {selectedCats.length > 0 ? (
                        selectedCats.map((catName) => {
                          const categoryObj = categories.find(
                            (cat) => cat.categoryName === catName
                          );
                          if (!categoryObj) return null;

                          return (
                            <div
                              key={catName}
                              className='mb-4 border p-3 rounded bg-gray-50'
                            >
                              <h4 className='font-semibold mb-2'>{catName}</h4>
                              <div className='grid grid-cols-3 gap-2'>
                                {categoryObj.items.map((item) => {
                                  const checked =
                                    mealData?.[catName]?.includes(item.name) ||
                                    false;
                                  return (
                                    <label
                                      key={item.name}
                                      className='flex items-center space-x-2'
                                    >
                                      <input
                                        type='checkbox'
                                        checked={checked}
                                        onChange={() =>
                                          toggleItem(
                                            day,
                                            mealType,
                                            catName,
                                            item.name
                                          )
                                        }
                                      />
                                      <span>
                                        {item.name} ({item.type})
                                      </span>
                                    </label>
                                  );
                                })}
                              </div>
                            </div>
                          );
                        })
                      ) : (
                        <p className='italic text-gray-500'>
                          Select categories to view items
                        </p>
                      )}

                      <div className='mt-4 p-4 border rounded bg-green-50'>
                        <h4 className='font-semibold mb-2'>
                          ✅ Added Categories & Items for{" "}
                          {mealType.charAt(0).toUpperCase() + mealType.slice(1)}
                        </h4>
                        {Object.keys(mealData).length === 0 ? (
                          <p className='italic text-gray-600'>
                            No items added yet.
                          </p>
                        ) : (
                          Object.entries(mealData).map(
                            ([cat, items]) =>
                              items.length > 0 && (
                                <div
                                  key={cat}
                                  className='mb-2 flex justify-between items-start'
                                >
                                  <div>
                                    <strong>{cat}</strong>
                                    <ul className='list-disc list-inside ml-4'>
                                      {items.map((item) => (
                                        <li key={item}>{item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                  <button
                                    type='button'
                                    onClick={() =>
                                      removeCategoryFromMeal(day, mealType, cat)
                                    }
                                    className='text-red-600 hover:text-red-800 ml-4 self-start'
                                  >
                                    Remove
                                  </button>
                                </div>
                              )
                          )
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}

            <button
              type='submit'
              className='bg-blue-600 text-white py-2 px-6 rounded hover:bg-blue-700'
            >
              Save Weekly Plan
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default WeeklyMealPlanForm;

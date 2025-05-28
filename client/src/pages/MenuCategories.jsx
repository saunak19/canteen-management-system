import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

const MenuCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [selectedSeed, setSelectedSeed] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [items, setItems] = useState([{ name: "", type: "veg" }]);

  const fetchCategories = async () => {
    try {
      const res = await axios.get(
        "http://localhost:4000/api/v1/menu/categories"
      );
      setCategories(res.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load categories");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSeedSelect = (categoryId) => {
    setSelectedSeed(categoryId);
    const found = categories.find((c) => c._id === categoryId);
    if (found) {
      setCustomCategory(found.categoryName);
      setItems(found.items);
    } else {
      setCustomCategory("");
      setItems([{ name: "", type: "veg" }]);
    }
  };

  const handleAddItem = () => {
    setItems([...items, { name: "", type: "veg" }]);
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!customCategory.trim()) {
      alert("Category name is required");
      return;
    }

    const cleanedItems = items.filter((item) => item.name.trim());
    if (cleanedItems.length === 0) {
      alert("At least one item with a name is required");
      return;
    }

    try {
      await axios.post("http://localhost:4000/api/v1/menu/categories", {
        categoryName: customCategory.trim(),
        items: cleanedItems,
      });

      alert("Category added!");
      setCustomCategory("");
      setItems([{ name: "", type: "veg" }]);
      setSelectedSeed("");
      fetchCategories();
    } catch (err) {
      console.error(err);
      alert("Error adding category. Please check your input.");
    }
  };

  if (loading) return <p>Loading categories...</p>;
  if (error) return <p>{error}</p>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Add New Category Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Add New Category</h2>
            
            <div className="mb-4">
              <label className="block font-semibold mb-2 text-gray-700">
                Select Existing Category (as seed):
              </label>
              <select
                onChange={(e) => handleSeedSelect(e.target.value)}
                value={selectedSeed}
                className="border p-2 rounded w-full max-w-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.categoryName}
                  </option>
                ))}
              </select>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block font-semibold text-gray-700">Category Name:</label>
                <input
                  type="text"
                  value={customCategory}
                  onChange={(e) => setCustomCategory(e.target.value)}
                  className="w-full max-w-md p-2 border rounded focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  required
                />
              </div>

              <div className="space-y-3">
                {items.map((item, index) => (
                  <div key={index} className="flex gap-4 items-center">
                    <input
                      type="text"
                      placeholder="Item Name"
                      value={item.name}
                      onChange={(e) =>
                        handleItemChange(index, "name", e.target.value)
                      }
                      className="p-2 border rounded w-1/2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                      required
                    />
                    <select
                      value={item.type}
                      onChange={(e) =>
                        handleItemChange(index, "type", e.target.value)
                      }
                      className="p-2 border rounded w-1/2 focus:ring-2 focus:ring-green-500 focus:border-green-500"
                    >
                      <option value="veg">Veg</option>
                      <option value="non-veg">Non-Veg</option>
                    </select>
                  </div>
                ))}
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="text-green-600 hover:text-green-800 font-medium"
                >
                  + Add another item
                </button>

                <button
                  type="submit"
                  className="bg-green-600 text-white py-2 px-6 rounded-md hover:bg-green-700 transition duration-200 shadow-md"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>

          {/* Existing Categories Section */}
          <div>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Existing Categories</h2>
            
            {categories.length === 0 ? (
              <p className="text-gray-600">No categories available.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat) => (
                  <div key={cat._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition duration-200">
                    <div className="p-5">
                      <h3 className="font-semibold text-lg text-gray-800 mb-3">{cat.categoryName}</h3>
                      <ul className="space-y-2">
                        {cat.items.map((item, idx) => (
                          <li key={idx} className="flex justify-between items-center">
                            <span className="text-gray-700">{item.name}</span>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.type === 'veg' 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {item.type}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-gray-50 px-5 py-3 border-t">
                      <button 
                        onClick={() => handleSeedSelect(cat._id)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Use as template
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuCategories;
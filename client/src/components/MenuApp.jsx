// import { useState, useEffect } from 'react';
// import axios from 'axios';

// const API_URL = 'http://localhost:4000/api/v1/menu';

// const MenuManager = () => {
//   const [menus, setMenus] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [formData, setFormData] = useState({
//     day: 'Monday',
//     type: 'breakfast',
//     items: '',
//     price: ''
//   });
//   const [editingId, setEditingId] = useState(null);

//   useEffect(() => {
//     fetchMenus();
//   }, []);

//   const fetchMenus = async () => {
//     try {
//       const response = await axios.get(API_URL);
//       setMenus(response.data);
//       setLoading(false);
//     } catch (err) {
//       setError(err.message);
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     const { name, value } = e.target;
//     setFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       if (editingId) {
//         // Update existing menu
//         await axios.put(`${API_URL}/${editingId}`, formData);
//       } else {
//         // Create new menu
//         await axios.post(API_URL, formData);
//       }
//       fetchMenus();
//       resetForm();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const handleEdit = (menu) => {
//     setFormData({
//       day: menu.day,
//       type: menu.type,
//       items: menu.items.join(', '),
//       price: menu.price
//     });
//     setEditingId(menu._id);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       fetchMenus();
//     } catch (err) {
//       setError(err.message);
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       day: 'Monday',
//       type: 'breakfast',
//       items: '',
//       price: ''
//     });
//     setEditingId(null);
//   };

//   if (loading) return <div className="text-center py-8">Loading...</div>;
//   if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;

//   return (
//     <div className="container mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold text-center mb-8">Menu Management System</h1>
      
//       {/* Menu Form */}
//       <div className="bg-white rounded-lg shadow-md p-6 mb-8">
//         <h2 className="text-xl font-semibold mb-4">
//           {editingId ? 'Edit Menu Item' : 'Add New Menu Item'}
//         </h2>
//         <form onSubmit={handleSubmit}>
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Day</label>
//               <select
//                 name="day"
//                 value={formData.day}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 required
//               >
//                 {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(day => (
//                   <option key={day} value={day}>{day}</option>
//                 ))}
//               </select>
//             </div>
            
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
//               <select
//                 name="type"
//                 value={formData.type}
//                 onChange={handleInputChange}
//                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//                 required
//               >
//                 {['breakfast', 'lunch', 'tea', 'dinner'].map(type => (
//                   <option key={type} value={type}>{type}</option>
//                 ))}
//               </select>
//             </div>
//           </div>
          
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Items (comma separated)</label>
//             <input
//               type="text"
//               name="items"
//               value={formData.items}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               placeholder="Idli, Sambar, Chutney"
//               required
//             />
//           </div>
          
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-1">Price</label>
//             <input
//               type="number"
//               name="price"
//               value={formData.price}
//               onChange={handleInputChange}
//               className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
//               placeholder="40"
//               required
//             />
//           </div>
          
//           <div className="flex justify-end space-x-3">
//             {editingId && (
//               <button
//                 type="button"
//                 onClick={resetForm}
//                 className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
//               >
//                 Cancel
//               </button>
//             )}
//             <button
//               type="submit"
//               className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
//             >
//               {editingId ? 'Update' : 'Add'} Menu Item
//             </button>
//           </div>
//         </form>
//       </div>
      
//       {/* Menu List */}
//       <div className="bg-white rounded-lg shadow-md p-6">
//         <h2 className="text-xl font-semibold mb-4">Current Menu Items</h2>
        
//         {menus.length === 0 ? (
//           <p className="text-gray-500">No menu items found. Add some using the form above.</p>
//         ) : (
//           <div className="overflow-x-auto">
//             <table className="min-w-full divide-y divide-gray-200">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Day</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {menus.map(menu => (
//                   <tr key={menu._id}>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{menu.day}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">{menu.type}</td>
//                     <td className="px-6 py-4 text-sm text-gray-500">
//                       <ul className="list-disc list-inside">
//                         {menu.items.map((item, index) => (
//                           <li key={index}>{item}</li>
//                         ))}
//                       </ul>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{menu.price}</td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
//                       <button
//                         onClick={() => handleEdit(menu)}
//                         className="text-blue-600 hover:text-blue-900 mr-3"
//                       >
//                         Edit
//                       </button>
//                       <button
//                         onClick={() => handleDelete(menu._id)}
//                         className="text-red-600 hover:text-red-900"
//                       >
//                         Delete
//                       </button>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default MenuManager;
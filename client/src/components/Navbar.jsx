import { Link, useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { handleSuccess } from "./utils";
import { ToastContainer } from "react-toastify";
import { getUserFromStorage } from "../features/getUserFromStorage";

const Navbar = () => {
  const [user, setUser] = useState({
    isAuthenticated: false,
    name: "",
    role: "",
  });
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Load user data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = getUserFromStorage()
    const name = user.name;
    const role = user.role;
 
    if (token && name && role) {
      setUser({
        isAuthenticated: true,
        name,
        role,
      });
    }
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);

  const commonLinks = [
    { name: "Dashboard", path: "/" },
    { name: "Meals", path: "/menu" },
  ];

  const employeeLinks = [
    { name: "My Meals", path: "/my-meals" },
    { name: "My Profile", path: "/profile" },
    { name: "Book Your Meals", path: "/meal-booking" },
  ];

  const dineManagerLinks = [
    {name: "Manage Dine", path: "/dine" },
    {name: "Inventory", path: "/inventory" },
    {name: "Add Menu",path:"/add-menu"},
    {name: "Weekly Menu",path:"/weekly-menu"},
    {name: "Weekly Meal View",path:"/view-meal"},
    {name: "All Bookings",path:"/all-bookings"},
    // {name: "Weekly Menu Booking",path:"/menu-booking"}
  ];

  const adminLinks = [
    { name: "My Profile", path: "/profile" },
    // { name: "Dashboard", path: "/admin" },
    { name: "User Management", path: "/admin/users" },
    {name: "Add Meal",path:"/add-menu"},
    {name: "Weekly Planner",path:"/weekly-menu"},
    {name: "Weekly Meals",path:"/view-meal"},
    {name: "All Bookings",path:"/all-bookings"},
  ];

  const hrAdminLinks = [
    { name: "My Meals", path: "/my-meals" },
    { name: "My Profile", path: "/profile" },
    { name: "Book Your Meals", path: "/meal-booking" },
    { name: "Employees", path: "/hr/employees" },
    { name: "Reports", path: "/hr/reports" },
    
  ];

  const getRoleLinks = () => {
    switch (user.role?.toLowerCase()) {
      case "employee":
        return employeeLinks;
      case "dine manager":
        return dineManagerLinks;
      case "admin":
        return adminLinks;
      case "hr":
        return hrAdminLinks;
      default:
        return [];
    }
  };
  const handleLogout = () => {
    const confirm = window.confirm("Are you sure you want to log out?");
    if (!confirm) return;
  
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  
    handleSuccess('User Logged Out');
  
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-green-700">
          CanteenApp
        </Link>

        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-gray-700 text-2xl">
            ☰
          </button>
        </div>

        <div className={`md:flex md:space-x-6 items-center ${isOpen ? "block mt-4 md:mt-0" : "hidden"} md:block`}>
          {[...commonLinks, ...getRoleLinks()].map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className="block text-gray-700 hover:text-green-700 transition"
            >
              {link.name}
            </Link>
          ))}

          {user.isAuthenticated ? (
            <>
              <span className="text-sm text-gray-600">Hi, {user.name}</span>
              <button
                onClick={handleLogout}
                className="text-red-500 hover:text-red-700 text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-700 hover:text-green-700">
                Login
              </Link>
              <Link to="/register" className="text-gray-700 hover:text-green-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
      <ToastContainer />
    </nav>
  );
};

export default Navbar;

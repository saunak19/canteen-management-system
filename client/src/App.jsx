// src/App.js
import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/AdminDashboard";
import DineManager from "./pages/DineManager";
import { getUserFromStorage } from "./features/getUserFromStorage";
import BookedMeals from "./pages/BookedMeals";
import WeeklyMealPlanForm from "./pages/WeeklyMealPlanForm";
import MenuCategories from "./pages/MenuCategories";
import WeeklyMealPlan from "./pages/WeeklyMealPlan";
import WeeklyMenuBooking from "./pages/useWeeklyPlans";
import ManageUsers from "./pages/ManageUsers";
import UserProfile from "./pages/UserProfile";
import EmployeeMealBooking from "./pages/EmployeeMealBooking";
import MyBookings from "./pages/MyBookings";
import BookingDashboard from "./pages/BookingDashboard";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for user on initial load
    const storedUser = getUserFromStorage();
    setUser(storedUser);
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <div className='flex justify-center items-center h-screen'>
        <div className='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500'></div>
      </div>
    );
  }
  return (
    <>
      <div>
        <Routes>
          <Route path='/' element={<Navigate to='/login' />} />
          <Route path='/login' element={<Login setUser={setUser} />} />
          <Route path='/register' element={<Register />} />
          <Route path='/home' element={<Home />} />
          <Route path='/menu' element={<WeeklyMealPlan />} />

          <Route path='/admin/users' element={<ManageUsers />} />
          <Route path='/hr/employees' element={<ManageUsers />} />
          <Route path='/profile' element={<UserProfile/> } />
          <Route path='/meal-booking' element={<EmployeeMealBooking/> } />
          <Route path='/my-meals' element={<MyBookings/> } />
          <Route path='/all-bookings' element={<BookingDashboard/> } />

          {/* Employee only route */}
        
          {/* <Route
            path='/meal-booking'
            element={
              <ProtectedRoute user={user} allowedRoles={["employee"]}>
                <MealBookingForm />
              </ProtectedRoute>
            }
          /> */}
          <Route
            path='/my-meals'
            element={
              <ProtectedRoute user={user} allowedRoles={["employee"]}>
                <BookedMeals />
              </ProtectedRoute>
            }
          />

          {/* Admin only */}
          <Route
            path='/admin'
            element={
              <ProtectedRoute user={user} allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* Dine Manager only */}
          <Route
            path='/dine'
            element={
              <ProtectedRoute user={user} allowedRoles={["dine manager"]}>
                <DineManager />
              </ProtectedRoute>
            }
          />

          <Route
            path='/add-menu'
            element={
              <ProtectedRoute user={user} allowedRoles={["dine manager","admin"]}>
                <MenuCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path='/weekly-menu'
            element={
              <ProtectedRoute user={user} allowedRoles={["dine manager","admin"]}>
                <WeeklyMealPlanForm />
              </ProtectedRoute>
            }
          />
          <Route
            path='/view-meal'
            element={
              <ProtectedRoute user={user} allowedRoles={["dine manager","admin"]}>
                <WeeklyMealPlan />
              </ProtectedRoute>
            }
          />
          <Route
            path='/menu-booking'
            element={
              <ProtectedRoute user={user} allowedRoles={["dine manager","admin"]}>
                <WeeklyMenuBooking />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </>
  );
}

export default App;

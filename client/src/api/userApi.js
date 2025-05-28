import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:4000/api/v1",
  withCredentials: true,
});

// Get all users
export const fetchAllUsers = () => API.get("/admin/users");

// Block user
export const blockUser = (id) => API.put(`/admin/user/block/${id}`);

// Unblock user
export const unblockUser = (id) => API.put(`/admin/user/unblock/${id}`);

// Delete user
export const deleteUser = (id) => API.delete(`/admin/user/${id}`);

// Update user role
export const updateUserRole = (id, role) =>
  API.put(`/admin/user/role/${id}`, { role });

export const profileDetails = () => API.get(`/me`);
export const fetchAllBookings=() => API.get(`/booking/all`)

// Update user role
export const updateUserDetails = (form) =>
  API.put(`/me/update`, { form });

///me/delete/:id
export const deleteMe = (id) => API.delete(`/me/delete/${id}`);
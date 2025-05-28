import React, { useEffect, useState } from "react";
import {
  fetchAllUsers,
  blockUser,
  unblockUser,
  deleteUser,
  updateUserRole
} from "../api/userApi";
import UserTable from "../components/UserTable";
import Navbar from "../components/Navbar";

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await fetchAllUsers();
      setUsers(res.data.users);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleBlockToggle = async (userId, isBlocked) => {
    try {
      isBlocked ? await unblockUser(userId) : await blockUser(userId);
      loadUsers();
    } catch (err) {
      console.error("Failed to update block status", err);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await deleteUser(userId);
        loadUsers();
      } catch (err) {
        console.error("Failed to delete user", err);
      }
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      loadUsers();
    } catch (err) {
      console.error("Failed to update role", err);
    }
  };

  return (
    <div>
        <Navbar/>
        <div className="p-6">
        
        <h2 className="text-xl font-semibold mb-4">Manage Users</h2>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <UserTable
          users={users}
          onBlockToggle={handleBlockToggle}
          onDelete={handleDelete}
          onRoleChange={handleRoleChange}
          />
        )}
      </div>
    </div>
  );
};

export default ManageUsers;


import React from 'react';
import { useNavigate } from 'react-router-dom';
import { handleSuccess } from './utils';
import { ToastContainer } from 'react-toastify';

const Logout = () => {
  const navigate = useNavigate();
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
    <div>
      <button onClick={handleLogout}>Logout</button>
      <ToastContainer />
    </div>
  );
};

export default Logout;

// src/features/getUserFromStorage.js
export const getUserFromStorage = () => {
  try {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  } catch (error) {
    console.error("Error parsing user from storage:", error);
    return null;
  }
};
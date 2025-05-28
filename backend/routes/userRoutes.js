const express = require("express");
const {
  registerUser,
  loginUser,
  logout,
  getUserDetails,
  updateUserProfile,
  getAllUsers,
  updateUserById,
  blockUser,
  unblockUser,
  deleteUser,
  updateUserRole
} = require("../controllers/userController");
const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

const router = express.Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.get("/me", isAuthenticatedUser, getUserDetails);
router.put("/me/update", isAuthenticatedUser, updateUserProfile);
router.delete("/me/delete/:id", isAuthenticatedUser, deleteUser);
router.get(
  "/admin/users",
  isAuthenticatedUser,
  authorizeRoles("hr", "admin"),
  getAllUsers
);
router.put(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("hr", "admin"),
  updateUserById
);

router.put(
  "/admin/user/block/:id",
  isAuthenticatedUser,
  authorizeRoles("hr", "admin"),
  blockUser
);
router.put(
  "/admin/user/unblock/:id",
  isAuthenticatedUser,
  authorizeRoles("hr", "admin"),
  unblockUser
);
router.delete(
  "/admin/user/:id",
  isAuthenticatedUser,
  authorizeRoles("hr", "admin"),
  deleteUser
);

router.put("/admin/user/role/:id", isAuthenticatedUser, authorizeRoles("admin","hr"), updateUserRole);


module.exports = router;

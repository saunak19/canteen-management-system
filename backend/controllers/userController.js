const ErrorHander = require("../utils/errorhander");
const catchAsyncErrors = require("../middleware/catchAsyncError.js");
const User = require("../models/userModel");
const sendToken = require("../utils/jwtToken.js");
const catchAsyncError = require("../middleware/catchAsyncError.js");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const user = await User.create({
      name,
      email,
      password,
    });

    sendToken(user, 201, res);
  } catch (error) {
    if (error.code === 11000) {
      return next(new ErrorHander("Email already exists", 409));
    }
    return next(error);
  }
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email || !password) {
    return next(new ErrorHander("Please Enter Email & Password", 400));
  }

  // Find user and include password field
  const user = await User.findOne({ email }).select("+password");

  if (!user) {
    return next(new ErrorHander("Invalid email or password", 401));
  }

  // Compare password
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHander("Invalid email or password", 401));
  }
  const token = user.getJWTToken();

  // Return token
  sendToken(user, 200, res);
});

//Logout user
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie("token", null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });
  res.status(200).json({
    success: true,
    message: "Logged Out",
  });
});


// Get currently logged-in user details
exports.getUserDetails = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id);
// console.log(user)
  res.status(200).json({
    success: true,
    user,
  });
});

// Get all users (for HR/Admin)
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    success: true,
    users,
  });
});

// Update user by ID (for HR/Admin)
exports.updateUserById = catchAsyncError(async (req, res, next) => {
  const newUserData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role, // Ensure only HR/Admins are allowed to change role
  };

  const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
    new: true,
    runValidators: true,
    useFindAndModify: false,
  });

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User updated successfully",
    user,
  });
});



// Update user profile (name, email, password)
exports.updateUserProfile = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user.id).select("+password");

  const { name, email, password, newPassword } = req.body;

  // Check if email or name is being updated
  if (name) user.name = name;
  if (email) user.email = email;

  // Change password only if requested
  if (password && newPassword) {
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return next(new ErrorHander("Current password is incorrect", 400));
    }
    user.password = newPassword;
  }

  await user.save();

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
  });
});


// Block a user
exports.blockUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  user.blocked = true;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User has been blocked",
  });
});

// Unblock a user
exports.unblockUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  user.blocked = false;
  await user.save();

  res.status(200).json({
    success: true,
    message: "User has been unblocked",
  });
});

// Delete a user
exports.deleteUser = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  await user.deleteOne();

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});


// Change user role (admin/hr only)
exports.updateUserRole = catchAsyncErrors(async (req, res, next) => {
  const userId = req.params.id;
  const { role } = req.body;

  const validRoles = ["employee", "hr", "admin","dine manager"];
  if (!validRoles.includes(role)) {
    return next(new ErrorHander("Invalid role specified", 400));
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { role },
    { new: true, runValidators: true }
  );

  if (!user) {
    return next(new ErrorHander("User not found", 404));
  }

  res.status(200).json({
    success: true,
    message: "User role updated successfully",
    user,
  });
});

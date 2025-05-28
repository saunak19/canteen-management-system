const ErrorHander = require("../utils/errorhander");
const catchAsyncError = require("./catchAsyncError");
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");

exports.isAuthenticatedUser = catchAsyncError(async (req, res, next) => {

  const { token } = req.cookies;
  // console.log(token)
  if (!token) {
    return next(new ErrorHander("Please Login to access this resource", 401));
  }

  const decodedData = jwt.verify(token, process.env.JWT_SECRET);
  req.user = await User.findById(decodedData._id);
  next();
});

exports.authorizeRoles = (...roles) => {
    return (req, res, next) => {
      // console.log(req.user.role)
      if (!req.user || !roles.includes(req.user.role)) {
        return next(
          new ErrorHander(
            `Role: ${req.user?.role || "undefined"} is not allowed to access this resource`,
            403
          )
        );
      }
      next();
    };
  };
  

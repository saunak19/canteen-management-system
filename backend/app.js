const express = require("express");
const app = express();
const cookieParser = require("cookie-parser")
const cors = require("cors");

// OR for more control:
app.use(
    cors({
      origin: "http://localhost:5173",  
      credentials: true,              
    })
  );

const errorMiddleware = require("./middleware/error");
app.use(express.json());
app.use(cookieParser());
//Route Imports

const user = require("./routes/userRoutes");
const menuRoutes = require('./routes/menuCategoryMasterRoute.js');
const weeklyMealRoutes = require('./routes/weeklyMealPlanRoute.js');
const bookingRoutes = require('./routes/booking_Routes');
app.use("/api/v1", user);
app.use('/api/v1', menuRoutes);
app.use('/api/v1', weeklyMealRoutes); 
app.use('/api/v1', bookingRoutes);     

//Middleware for error
app.use(errorMiddleware);

module.exports = app;

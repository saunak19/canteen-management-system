const app = require("./app");
const dotenv = require("dotenv");
const connectDB = require("./config/database");

//Handling Uncaught exception
process.on("uncaughtException",(err)=>{
  console.log(`Error:${err.message}`);
  console.log("Shutting down the server due to uncaughtException");
  process.exit(1)
})


//config
dotenv.config({ path: "backend/config/config.env" });

//Connection Database
connectDB();
const server = app.listen(process.env.PORT, () => {
  console.log(`Server is working on http://localhost:${process.env.PORT}`);
});

//unhandled Promise Rejection:
process.on("unhandledRejection", (err) => {
  {
    console.log(`Error:${err.message}`);
    console.log("Shutting down the server due to Unhandled Promises Rejection");
    server.close(()=>{
      process.exit(1)
    })
  }
});


import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

// Database Connection
connectDB()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is running at port :${process.env.PORT}`);
    });
  })
  .catch((error) => {
    console.log("MongoDB connection failed", error);
  });

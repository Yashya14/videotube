import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

/**
 * Initialize the express app
 */
const app = express();

app.use(
  cors({
    origin: process.env.CORS_ORIGIN, // accept requests from any frontend http://localhost:3000
    credentials: true,
  })
);

// to parse json data from the request body
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(express.urlencoded({ extended: true, limit: "16kb" })); // to parse urlencoded data from the request body (- <space>) %20%
app.use(express.static("public")); // to serve static files from the "public" directory
app.use(cookieParser()); // to parse cookies from the request

export { app };

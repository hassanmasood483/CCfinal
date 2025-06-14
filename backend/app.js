require("dotenv").config(); // Load environment variables
const createError = require("http-errors");
const express = require("express");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const cors = require("cors");
const connectDB = require("./config/DBconnection");

// Import Routes
const userRoutes = require("./routes/userRoutes");
const authRoutes = require("./routes/authRoutes");
const feedbackRoutes = require("./routes/feedbackRoutes");
const mealplanRoutes = require("./routes/mealplanRoutes");
const recipeRoutes = require("./routes/recipeRoutes");
const customRoutes = require("./routes/customRoutes");
const groqRoutes = require("./routes/groqRoutes"); // ✅ Chatbot Route

const app = express();

// Connect to MongoDB
connectDB();

// Handle Uncaught Exceptions
process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
  process.exit(1);
});

// Handle Unhandled Promise Rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Promise Rejection:", reason);
});

// CORS Configuration
const corsOptions = {
  origin: process.env.FRONTEND_URL || "http://localhost:5173",
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['set-cookie'],
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400 // 24 hours
};
app.use(cors(corsOptions));

// Middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Use Routes
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/mealplan", mealplanRoutes);
app.use("/api/recipes", recipeRoutes);
app.use("/api/custom", customRoutes);
app.use("/api/groq", groqRoutes); // ✅ Mounted Chatbot Endpoint

// 404 Handler
app.use((req, res, next) => {
  next(createError(404, "Resource not found"));
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error("Error:", err.message || err);

  const statusCode = err.status || 500;
  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;

// src/server.ts
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/authRoutes";

// Load env variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(
  cors({
    origin: "http://localhost:5173", // Your React app URL
    credentials: true,
  })
);
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);
app.use(cookieParser());
// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "🎓 Jain University Backend API",
    database: "MongoDB Atlas Connected",
    timestamp: new Date().toISOString(),
  });
});
// Routes
app.use("/api/auth", authRoutes);
// Health check route
app.get("/health", (req, res) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? "Connected" : "Disconnected";

  res.json({
    status: "OK",
    database: dbStatus,
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.use(
  (
    error: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error("Unhandled error:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
);
// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Environment: ${process.env.NODE_ENV}`);
  console.log(`📡 API: http://localhost:${PORT}`);
});

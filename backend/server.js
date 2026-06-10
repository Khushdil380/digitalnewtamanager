import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import weddingRoutes from "./routes/weddingRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import contributionRoutes from "./routes/contributionRoutes.js";
import noteRoutes from "./routes/noteRoutes.js";
import smsRoutes from "./routes/smsRoutes.js";
import bulkSmsRoutes from "./routes/bulkSmsRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
// Support multiple CORS origins (local + deployed)
const allowedOrigins = [
  "http://localhost:3000",
  process.env.FRONTEND_URL,
  process.env.CORS_ORIGIN,
].filter(Boolean);

console.log("Starting backend...");
console.log("MONGODB_URI:", MONGODB_URI ? "SET" : "NOT SET");
console.log("Allowed Origins:", allowedOrigins);
console.log("NODE_ENV:", process.env.NODE_ENV);

// CORS configuration - allows both local and deployed frontend
const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, curl, etc.)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};

app.use(cors(corsOptions));

// Handle preflight requests
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug endpoint - available before DB connection
app.get("/api/health", (req, res) => {
  res.json({ message: "Backend is running" });
});

// Keep-alive cron endpoint - pings MongoDB daily to prevent Atlas M0 inactivity
app.get("/api/keep-alive", async (req, res) => {
  try {
    await mongoose.connection.db.admin().ping();
    res.json({ status: "alive", timestamp: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ status: "error", message: err.message });
  }
});

app.get("/api/debug/config", (req, res) => {
  res.json({ 
    allowedOrigins,
    mongoConnected: mongoose.connection.readyState === 1,
    nodeEnv: process.env.NODE_ENV || "not set",
  });
});

// Connect to MongoDB with optimized settings for serverless
let isConnected = false;

const connectDB = async () => {
  if (isConnected && mongoose.connection.readyState === 1) return;
  try {
    await mongoose.connect(MONGODB_URI, {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 8000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
    });
    isConnected = true;
    console.log("Connected to MongoDB");
  } catch (err) {
    isConnected = false;
    console.error("MongoDB connection error:", err.message);
  }
};

if (MONGODB_URI) {
  connectDB();

  // Re-connect on disconnect (handles cold start reconnection)
  mongoose.connection.on("disconnected", () => {
    isConnected = false;
    console.log("MongoDB disconnected, will reconnect on next request");
  });
} else {
  console.error("ERROR: MONGODB_URI environment variable is not set!");
}

// Middleware: ensure DB is connected before processing requests
app.use(async (req, res, next) => {
  if (req.path === "/api/health") return next();
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      return res.status(503).json({ message: "Database temporarily unavailable. Please retry." });
    }
  }
  next();
});

app.use("/api/auth", authRoutes);
app.use("/api/weddings", weddingRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/contributions", contributionRoutes);
app.use("/api/notes", noteRoutes);
app.use("/api/sms", smsRoutes);
app.use("/api/bulk-sms", bulkSmsRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

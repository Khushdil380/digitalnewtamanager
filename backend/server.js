import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";
import weddingRoutes from "./routes/weddingRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import contributionRoutes from "./routes/contributionRoutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;
const CORS_ORIGIN = process.env.CORS_ORIGIN || "http://localhost:3000";

console.log("Starting backend...");
console.log("MONGODB_URI:", MONGODB_URI ? "SET" : "NOT SET");
console.log("CORS_ORIGIN:", CORS_ORIGIN);
console.log("NODE_ENV:", process.env.NODE_ENV);

// CORS configuration
const corsOptions = {
  origin: CORS_ORIGIN,
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

app.get("/api/debug/config", (req, res) => {
  res.json({ 
    corsOrigin: process.env.CORS_ORIGIN || "NOT SET (using default: http://localhost:3000)",
    mongoConnected: mongoose.connection.readyState === 1,
    nodeEnv: process.env.NODE_ENV || "not set",
  });
});

// Connect to MongoDB
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI)
    .then(() => {
      console.log("Connected to MongoDB");
    })
    .catch((err) => {
      console.error("MongoDB connection error:", err.message);
      // Don't exit - let the app serve requests anyway (useful for debugging on Vercel)
    });
} else {
  console.error("ERROR: MONGODB_URI environment variable is not set!");
}

app.use("/api/auth", authRoutes);
app.use("/api/weddings", weddingRoutes);
app.use("/api/guests", guestRoutes);
app.use("/api/contributions", contributionRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// BuildMySite — Express Server Entry Point
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/database");

// Route imports
const enquiryRoutes = require("./routes/enquiryRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// Error handler middleware
const errorHandler = require("./middleware/errorHandler");

// Connect to MongoDB
connectDB();

const app = express();

// ─── Middleware ────────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "BuildMySite API is running",
    timestamp: new Date().toISOString(),
  });
});

// ─── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/bookings", bookingRoutes);

// ─── 404 Handler ──────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// ─── Global Error Handler ─────────────────────────────────────────────────────
app.use(errorHandler);

// ─── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅  BuildMySite API running on http://localhost:${PORT}`);
  console.log(`🌱  Environment: ${process.env.NODE_ENV || "development"}`);
});

module.exports = app;
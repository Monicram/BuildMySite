// BuildMySite — Express Server Entry Point

require("dotenv").config();

const express = require("express");
const cors    = require("cors");
const fs      = require("fs");
const path    = require("path");

const { connectDB, pool } = require("./config/database");

// Routes
const enquiryRoutes = require("./routes/enquiryRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const authRoutes    = require("./routes/authRoutes");
const availabilityRoutes = require("./routes/availabilityRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const reviewRoutes = require("./routes/reviewRoutes");

// Error Handler
const errorHandler = require("./middleware/errorHandler");

// ─── Connect DB then run migrations ─────────────────────────────────────────
async function startServer() {
  await connectDB();

  // Auto-run idempotent schema migrations
  try {
    const migrationPath = path.join(__dirname, "config", "migrate.sql");
    if (fs.existsSync(migrationPath)) {
      const sql = fs.readFileSync(migrationPath, "utf8");
      await pool.query(sql);
      console.log("✅ DB migration applied");
    }
  } catch (err) {
    console.warn("⚠️  Migration warning (non-fatal):", err.message);
  }
}

const app = express();

// -----------------------------
// Middleware
// -----------------------------
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`\n${req.method} ${req.originalUrl}`);
  console.log("Headers:", req.headers);
  console.log("Body:", req.body);
  next();
});

// -----------------------------
// Health Check
// -----------------------------
app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "BuildMySite API is running",
    timestamp: new Date().toISOString(),
  });
});

// -----------------------------
// API Routes
// -----------------------------
app.use("/api/auth", authRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/availability", availabilityRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/reviews", reviewRoutes);

// -----------------------------
// 404 Handler
// -----------------------------
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// -----------------------------
// Global Error Handler
// -----------------------------
app.use(errorHandler);

// -----------------------------
// Start Server
// -----------------------------
const PORT = process.env.PORT || 5000;

startServer().then(() => {
  app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
    console.log(`🌱 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}).catch(err => {
  console.error("❌ Failed to start server:", err.message);
  process.exit(1);
});

module.exports = app;
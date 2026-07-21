// BuildMySite — Auth Routes
const express = require("express");
const router = express.Router();
const { adminLogin, verifyToken } = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

// POST /api/auth/login
router.post("/login", adminLogin);

// GET /api/auth/verify  (protected — checks token validity)
router.get("/verify", authMiddleware, verifyToken);

module.exports = router;

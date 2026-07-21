// BuildMySite — Admin Auth Controller
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * POST /api/auth/login
 * Validates admin credentials from .env and returns a signed JWT.
 */
exports.adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required.",
      });
    }

    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPasswordHash = process.env.ADMIN_PASSWORD_HASH;

    if (!adminEmail || !adminPasswordHash) {
      return res.status(500).json({
        success: false,
        message: "Admin credentials not configured on server.",
      });
    }

    // Case-insensitive email comparison
    if (email.toLowerCase() !== adminEmail.toLowerCase()) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const passwordMatch = await bcrypt.compare(password, adminPasswordHash);

    if (!passwordMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      return res.status(500).json({
        success: false,
        message: "JWT secret not configured on server.",
      });
    }

    const token = jwt.sign(
      {
        email: adminEmail,
        role: "admin",
      },
      jwtSecret,
      { expiresIn: process.env.JWT_EXPIRES_IN || "8h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful.",
      token,
      admin: {
        email: adminEmail,
        name: process.env.ADMIN_NAME || "Admin",
        role: "admin",
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/verify
 * Verifies the JWT token (used by frontend on load).
 */
exports.verifyToken = async (req, res) => {
  // req.admin is populated by authMiddleware
  res.status(200).json({
    success: true,
    admin: req.admin,
  });
};

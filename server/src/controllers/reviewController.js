const pool = require("../config/database").pool;

// ─── Get Approved Reviews (Public) ───────────────────────────────────────────
exports.getPublicReviews = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, name, company, role, photo_url, rating, message, created_at
       FROM reviews
       WHERE status = 'approved'
       ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Submit Review (Public) ──────────────────────────────────────────────────
exports.createReview = async (req, res, next) => {
  try {
    const { name, company, role, photo_url, rating, message, booking_id } = req.body;

    if (!name || !rating || !message) {
      return res.status(400).json({
        success: false,
        message: "Name, rating, and review message are required.",
      });
    }

    const ratingNum = parseInt(rating, 10);
    if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    const result = await pool.query(
      `INSERT INTO reviews (name, company, role, photo_url, rating, message, booking_id, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 'pending')
       RETURNING *`,
      [
        name.trim(),
        company?.trim() || null,
        role?.trim() || null,
        photo_url || null,
        ratingNum,
        message.trim(),
        booking_id || null,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Thank you! Your review has been submitted and is pending approval.",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get All Reviews (Admin) ─────────────────────────────────────────────────
exports.getAllReviews = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT * FROM reviews ORDER BY created_at DESC`
    );

    res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Update Review (Admin) ───────────────────────────────────────────────────
exports.updateReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, company, role, photo_url, rating, message, status } = req.body;

    const existing = await pool.query("SELECT * FROM reviews WHERE id = $1", [id]);
    if (existing.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    const current = existing.rows[0];
    const newRating = rating !== undefined ? parseInt(rating, 10) : current.rating;

    if (isNaN(newRating) || newRating < 1 || newRating > 5) {
      return res.status(400).json({
        success: false,
        message: "Rating must be between 1 and 5.",
      });
    }

    if (status && !["pending", "approved", "rejected"].includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status.",
      });
    }

    const result = await pool.query(
      `UPDATE reviews
       SET name = $1, company = $2, role = $3, photo_url = $4,
           rating = $5, message = $6, status = $7, updated_at = NOW()
       WHERE id = $8
       RETURNING *`,
      [
        name ?? current.name,
        company !== undefined ? company : current.company,
        role !== undefined ? role : current.role,
        photo_url !== undefined ? photo_url : current.photo_url,
        newRating,
        message ?? current.message,
        status ?? current.status,
        id,
      ]
    );

    res.status(200).json({
      success: true,
      message: "Review updated.",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// ─── Delete Review (Admin) ───────────────────────────────────────────────────
exports.deleteReview = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await pool.query(
      "DELETE FROM reviews WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Review not found." });
    }

    res.status(200).json({
      success: true,
      message: "Review deleted.",
    });
  } catch (err) {
    next(err);
  }
};

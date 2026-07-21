const pool = require("../models/Enquiry");

// ─── Create Enquiry ────────────────────────────────────────────────────────────
exports.createEnquiry = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      pages,
      features,
      support_needs,
      budget,
      notes,
    } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required fields.",
      });
    }

    const result = await pool.query(
      `INSERT INTO website_enquiries
      (name,email,phone,pages,features,support_needs,budget,notes,status)
      VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9)
      RETURNING *`,
      [
        name,
        email,
        phone || null,
        pages || null,
        features || [],
        support_needs || {},
        budget || null,
        notes || null,
        "new",
      ]
    );

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get All Enquiries ─────────────────────────────────────────────────────────
exports.getAllEnquiries = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM website_enquiries ORDER BY created_at DESC"
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

// ─── Get Single Enquiry ────────────────────────────────────────────────────────
exports.getEnquiryById = async (req, res, next) => {
  try {
    const result = await pool.query(
      "SELECT * FROM website_enquiries WHERE id=$1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// ─── Update Enquiry ────────────────────────────────────────────────────────────
exports.updateEnquiry = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      pages,
      features,
      support_needs,
      budget,
      notes,
      status,
    } = req.body;

    const result = await pool.query(
      `UPDATE website_enquiries
       SET
       name=$1,
       email=$2,
       phone=$3,
       pages=$4,
       features=$5,
       support_needs=$6,
       budget=$7,
       notes=$8,
       status=$9,
       updated_at=NOW()
       WHERE id=$10
       RETURNING *`,
      [
        name,
        email,
        phone,
        pages,
        features,
        support_needs,
        budget,
        notes,
        status,
        req.params.id,
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry updated.",
      data: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

// ─── Delete Enquiry ────────────────────────────────────────────────────────────
exports.deleteEnquiry = async (req, res, next) => {
  try {
    const result = await pool.query(
      "DELETE FROM website_enquiries WHERE id=$1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found.",
      });
    }

    res.status(200).json({
      success: true,
      message: "Enquiry deleted successfully.",
    });
  } catch (err) {
    next(err);
  }
};
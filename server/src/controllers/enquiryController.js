const WebsiteEnquiry = require("../models/Enquiry");

// ─── Create Enquiry ────────────────────────────────────────────────────────────
exports.createEnquiry = async (req, res, next) => {
  try {
    const { name, email, phone, pages, features, support_needs, budget, notes } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: "Name and email are required fields.",
      });
    }

    const enquiry = await WebsiteEnquiry.create({
      name,
      email,
      phone: phone || null,
      pages: pages || null,
      features: features || [],
      support_needs: support_needs || {},
      budget: budget || null,
      notes: notes || null,
    });

    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully.",
      data: enquiry,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get All Enquiries ─────────────────────────────────────────────────────────
exports.getAllEnquiries = async (req, res, next) => {
  try {
    const enquiries = await WebsiteEnquiry.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Single Enquiry ────────────────────────────────────────────────────────
exports.getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await WebsiteEnquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found." });
    }
    res.status(200).json({ success: true, data: enquiry });
  } catch (err) {
    next(err);
  }
};

// ─── Update Enquiry ────────────────────────────────────────────────────────────
exports.updateEnquiry = async (req, res, next) => {
  try {
    const enquiry = await WebsiteEnquiry.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found." });
    }
    res.status(200).json({ success: true, message: "Enquiry updated.", data: enquiry });
  } catch (err) {
    next(err);
  }
};

// ─── Delete Enquiry ────────────────────────────────────────────────────────────
exports.deleteEnquiry = async (req, res, next) => {
  try {
    const enquiry = await WebsiteEnquiry.findByIdAndDelete(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: "Enquiry not found." });
    }
    res.status(200).json({ success: true, message: "Enquiry deleted successfully." });
  } catch (err) {
    next(err);
  }
};
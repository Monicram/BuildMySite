const DiscoveryBooking = require("../models/Booking");

// ─── Create Booking ────────────────────────────────────────────────────────────
exports.createBooking = async (req, res, next) => {
  try {
    const { name, email, phone, company, budget_range, preferred_date, preferred_time, notes } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name, email, and phone are required fields.",
      });
    }

    const booking = await DiscoveryBooking.create({
      name,
      email,
      phone,
      company: company || null,
      budget_range: budget_range || null,
      preferred_date: preferred_date || null,
      preferred_time: preferred_time || null,
      notes: notes || null,
      status: "pending",
    });

    res.status(201).json({
      success: true,
      message: "Discovery call booking submitted successfully.",
      data: booking,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get All Bookings ──────────────────────────────────────────────────────────
exports.getAllBookings = async (req, res, next) => {
  try {
    const bookings = await DiscoveryBooking.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings,
    });
  } catch (err) {
    next(err);
  }
};

// ─── Get Single Booking ────────────────────────────────────────────────────────
exports.getBookingById = async (req, res, next) => {
  try {
    const booking = await DiscoveryBooking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
};

// ─── Update Booking ────────────────────────────────────────────────────────────
exports.updateBooking = async (req, res, next) => {
  try {
    const booking = await DiscoveryBooking.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }
    res.status(200).json({ success: true, message: "Booking updated.", data: booking });
  } catch (err) {
    next(err);
  }
};

// ─── Delete Booking ────────────────────────────────────────────────────────────
exports.deleteBooking = async (req, res, next) => {
  try {
    const booking = await DiscoveryBooking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found." });
    }
    res.status(200).json({ success: true, message: "Booking deleted successfully." });
  } catch (err) {
    next(err);
  }
};

const mongoose = require("mongoose");

/**
 * DiscoveryBooking — matches the "Book a Discovery Call" form
 * Mirrors the original `discovery_bookings` SQL table schema
 */
const discoveryBookingSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    company: {
      type: String,
      trim: true,
      default: null,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    budget_range: {
      type: String,
      default: null,
    },
    preferred_date: {
      type: String,
      default: null,
    },
    preferred_time: {
      type: String,
      default: null,
    },
    notes: {
      type: String,
      trim: true,
      maxlength: [2000, "Notes cannot exceed 2000 characters"],
      default: null,
    },
    status: {
      type: String,
      enum: ["pending", "confirmed", "completed", "cancelled"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("DiscoveryBooking", discoveryBookingSchema);

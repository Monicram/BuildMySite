const mongoose = require("mongoose");

/**
 * WebsiteEnquiry — matches the "Plan My Website" form
 * Mirrors the original `website_enquiries` SQL table schema
 */
const websiteEnquirySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: [100, "Name cannot exceed 100 characters"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please provide a valid email address"],
    },
    phone: {
      type: String,
      trim: true,
      default: null,
    },
    pages: {
      type: String,
      default: null,
    },
    features: {
      type: [String],
      default: [],
    },
    support_needs: {
      hosting: { type: String, default: "" },
      maintenance: { type: String, default: "" },
      seo: { type: String, default: "" },
    },
    budget: {
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
      enum: ["new", "contacted", "converted", "closed"],
      default: "new",
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

module.exports = mongoose.model("WebsiteEnquiry", websiteEnquirySchema);
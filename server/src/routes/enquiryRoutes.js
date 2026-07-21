const express = require("express");
const router = express.Router();

const {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} = require("../controllers/enquiryController");

// Create a new enquiry
router.post("/", createEnquiry);

// Get all enquiries
router.get("/", getAllEnquiries);

// Get a single enquiry by ID
router.get("/:id", getEnquiryById);

// Update an enquiry
router.put("/:id", updateEnquiry);

// Delete an enquiry
router.delete("/:id", deleteEnquiry);

module.exports = router;
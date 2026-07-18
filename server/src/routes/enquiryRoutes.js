const router = require("express").Router();
const {
  createEnquiry,
  getAllEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
} = require("../controllers/enquiryController");

// POST   /api/enquiries       — Submit a new website enquiry
// GET    /api/enquiries       — Get all enquiries
router.route("/")
  .post(createEnquiry)
  .get(getAllEnquiries);

// GET    /api/enquiries/:id   — Get single enquiry
// PUT    /api/enquiries/:id   — Update enquiry
// DELETE /api/enquiries/:id   — Delete enquiry
router.route("/:id")
  .get(getEnquiryById)
  .put(updateEnquiry)
  .delete(deleteEnquiry);

module.exports = router;
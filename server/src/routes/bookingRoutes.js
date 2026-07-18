const router = require("express").Router();
const {
  createBooking,
  getAllBookings,
  getBookingById,
  updateBooking,
  deleteBooking,
} = require("../controllers/bookingController");

// POST   /api/bookings       — Submit a new discovery call booking
// GET    /api/bookings       — Get all bookings
router.route("/")
  .post(createBooking)
  .get(getAllBookings);

// GET    /api/bookings/:id   — Get single booking
// PUT    /api/bookings/:id   — Update booking (e.g. status change)
// DELETE /api/bookings/:id   — Delete booking
router.route("/:id")
  .get(getBookingById)
  .put(updateBooking)
  .delete(deleteBooking);

module.exports = router;

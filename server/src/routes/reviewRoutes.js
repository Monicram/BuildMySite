const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");

router.get("/public", reviewController.getPublicReviews);
router.post("/", reviewController.createReview);
router.get("/", reviewController.getAllReviews);
router.put("/:id", reviewController.updateReview);
router.delete("/:id", reviewController.deleteReview);

module.exports = router;

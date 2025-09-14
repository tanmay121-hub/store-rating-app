const express = require("express");
const router = express.Router();
const ratingController = require("../controllers/ratingController");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const {
  validateRating,
  handleValidationErrors,
} = require("../middleware/validation");

router.post(
  "/",
  authenticateToken,
  authorizeRole("user"),
  validateRating,
  handleValidationErrors,
  ratingController.submitRating
);
router.get(
  "/dashboard-stats",
  authenticateToken,
  authorizeRole("admin"),
  ratingController.getDashboardStats
);

module.exports = router;

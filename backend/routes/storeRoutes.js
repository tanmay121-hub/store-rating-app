const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const {
  validateStore,
  handleValidationErrors,
} = require("../middleware/validation");

router.get("/", authenticateToken, storeController.getStores);
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  validateStore,
  handleValidationErrors,
  storeController.createStore
);
router.get(
  "/my-ratings",
  authenticateToken,
  authorizeRole("store_owner"),
  storeController.getStoreRatings
);

module.exports = router;

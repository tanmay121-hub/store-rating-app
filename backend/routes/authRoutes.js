const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken } = require("../middleware/auth");
const {
  validateUser,
  handleValidationErrors,
} = require("../middleware/validation");

router.post(
  "/register",
  validateUser,
  handleValidationErrors,
  authController.register
);
router.post("/login", authController.login);
router.put(
  "/update-password",
  authenticateToken,
  authController.updatePassword
);

module.exports = router;

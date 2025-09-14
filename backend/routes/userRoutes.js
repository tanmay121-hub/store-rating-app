const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { authenticateToken, authorizeRole } = require("../middleware/auth");
const {
  validateUser,
  handleValidationErrors,
} = require("../middleware/validation");

router.get(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  userController.getUsers
);
router.post(
  "/",
  authenticateToken,
  authorizeRole("admin"),
  validateUser,
  handleValidationErrors,
  userController.createUser
);
router.get(
  "/:id",
  authenticateToken,
  authorizeRole("admin"),
  userController.getUserById
);

module.exports = router;

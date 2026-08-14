const express = require("express");
const router = express.Router();

const { getEmployerStats } = require("../controllers/dashboardController");
const { protect } = require("../middleware/authMiddleware");

// Employer Dashboard Statistics
router.get("/stats", protect, getEmployerStats);

module.exports = router;
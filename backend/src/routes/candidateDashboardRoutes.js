const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getCandidateStats,
} = require("../controllers/candidateDashboardController");

router.get("/stats", protect, getCandidateStats);

module.exports = router;
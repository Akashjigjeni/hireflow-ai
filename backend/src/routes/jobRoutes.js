const express = require("express");
const router = express.Router();

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getDashboardStats,
  getRecommendedJobs,
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");

// =====================================
// Public Routes
// =====================================

// Get all jobs
router.get("/", getJobs);

// =====================================
// Protected Routes
// =====================================

// Employer Dashboard Statistics
router.get("/stats", protect, getDashboardStats);

// Employer's Posted Jobs
router.get("/my/jobs", protect, getMyJobs);

// AI Recommended Jobs
router.get("/recommended", protect, getRecommendedJobs);

// Create Job
router.post("/", protect, createJob);

// Update Job
router.put("/:id", protect, updateJob);

// Delete Job
router.delete("/:id", protect, deleteJob);

// Get Single Job (Keep this LAST)
router.get("/:id", getJobById);

module.exports = router;
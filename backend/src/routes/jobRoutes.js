const express = require("express");

const router = express.Router();

const {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getRecommendedJobs,
} = require("../controllers/jobController");

const { protect } = require("../middleware/authMiddleware");

// =====================================
// PUBLIC ROUTES
// =====================================

// Get all available jobs
router.get("/", getJobs);

// =====================================
// PROTECTED ROUTES
// =====================================

// Get jobs posted by logged-in employer
router.get("/my/jobs", protect, getMyJobs);

// AI recommended jobs for candidate
router.get("/recommended", protect, getRecommendedJobs);

// Create a new job
router.post("/", protect, createJob);

// Update a job
router.put("/:id", protect, updateJob);

// Delete a job
router.delete("/:id", protect, deleteJob);

// =====================================
// GET SINGLE JOB
// Keep this LAST because "/:id"
// can otherwise capture other routes
// =====================================

router.get("/:id", getJobById);

module.exports = router;
const express = require("express");
const router = express.Router();

const {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
} = require("../controllers/applicationController");

const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

// Apply for Job
router.post(
  "/:jobId",
  protect,
  upload.single("resume"),
  applyToJob
);

// Candidate Applications
router.get(
  "/my",
  protect,
  getMyApplications
);

// Employer View Applicants
router.get(
  "/job/:jobId",
  protect,
  getApplicationsForJob
);

// Accept / Reject
router.put(
  "/:id/status",
  protect,
  updateApplicationStatus
);

module.exports = router;
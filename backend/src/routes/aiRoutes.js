const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  analyzeApplicantResume,
  generateInterviewQuestions,
  generateCoverLetterForApplicant,
} = require("../controllers/aiController");

// =====================================
// AI Resume Analysis
// =====================================
router.post(
  "/analyze/:applicationId",
  protect,
  analyzeApplicantResume
);

// =====================================
// AI Interview Questions
// =====================================
router.get(
  "/interview/:applicationId",
  protect,
  generateInterviewQuestions
);

// =====================================
// AI Cover Letter
// =====================================
router.get(
  "/cover-letter/:applicationId",
  protect,
  generateCoverLetterForApplicant
);

module.exports = router;
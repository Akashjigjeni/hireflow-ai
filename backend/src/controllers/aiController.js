const path = require("path");

const Application = require("../models/Application");

const analyzeResume = require("../ai/resumeAnalyzer");
const generateInterviewQuestions = require("../ai/interviewGenerator");
const generateCoverLetter = require("../ai/coverLetterGenerator");

// =======================================
// Analyze Resume
// POST /api/ai/analyze/:applicationId
// =======================================
const analyzeApplicantResume = async (req, res) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (!application.resume) {
      return res.status(400).json({
        message: "Candidate has not uploaded a resume.",
      });
    }

    const resumePath = path.join(
      __dirname,
      "../../",
      application.resume
    );

    let resumeSource = resumePath;
    if (!fs.existsSync(resumePath) && application.resumeData) {
      resumeSource = Buffer.from(application.resumeData, "base64");
    }

    const fallbackCandidateText = `${application.applicant?.skills || ""} ${application.applicant?.education || ""} ${application.coverLetter || ""}`;

    const requiredSkills = [
      "Java",
      "React",
      "Node",
      "MongoDB",
      "Express",
      "HTML",
      "CSS",
      "JavaScript",
    ];

    const result = await analyzeResume(
      resumeSource,
      requiredSkills,
      fallbackCandidateText
    );

    res.json({
      candidate: application.applicant.name,
      job: application.job.title,
      score: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
    });
  } catch (err) {
    console.error("RESUME ANALYSIS ERROR:");
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Generate Interview Questions
// GET /api/ai/interview/:applicationId
// =======================================
const generateInterviewQuestionsController = async (
  req,
  res
) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(
      applicationId
    )
      .populate("job")
      .populate("applicant");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    const skills = application.applicant.skills
      ? application.applicant.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== "")
      : [];

    const questions =
      generateInterviewQuestions(skills);

    res.json({
      candidate: application.applicant.name,
      job: application.job.title,
      skills,
      questions,
    });
  } catch (err) {
    console.error("INTERVIEW QUESTIONS ERROR:");
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Generate Cover Letter
// GET /api/ai/cover-letter/:applicationId
// =======================================
const generateCoverLetterForApplicant = async (
  req,
  res
) => {
  try {
    const { applicationId } = req.params;

    const application = await Application.findById(
      applicationId
    )
      .populate("job")
      .populate("applicant");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (!application.applicant) {
      return res.status(404).json({
        message: "Applicant not found",
      });
    }

    if (!application.job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const skills = application.applicant.skills
      ? application.applicant.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter((skill) => skill !== "")
      : [];

    const coverLetter = generateCoverLetter(
      application.applicant.name,
      application.job.title,
      application.job.company,
      skills
    );

    res.json({
      candidate: application.applicant.name,
      company: application.job.company,
      job: application.job.title,
      coverLetter,
    });
  } catch (err) {
    console.error("COVER LETTER ERROR:");
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// =======================================
// Export Controllers
// =======================================
module.exports = {
  analyzeApplicantResume,
  generateInterviewQuestions:
    generateInterviewQuestionsController,
  generateCoverLetterForApplicant,
};
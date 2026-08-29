const fs = require("fs");
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

    const resumePath = application.resume
      ? path.join(__dirname, "../../", application.resume)
      : "";

    let resumeSource = null;
    if (resumePath && fs.existsSync(resumePath)) {
      resumeSource = resumePath;
    } else if (application.resumeData) {
      resumeSource = Buffer.from(application.resumeData, "base64");
    } else if (application.applicant?.resumeData) {
      resumeSource = Buffer.from(application.applicant.resumeData, "base64");
    }

    // Aggregate candidate data
    const fallbackCandidateText = [
      application.applicant?.skills || "",
      application.applicant?.education || "",
      application.applicant?.name || "",
      application.applicant?.location || "",
      application.coverLetter || "",
    ].join(" ");

    // Determine Job Required Skills dynamically based on Job
    let requiredSkills = [];

    // 1. From job.skills array if specified
    if (Array.isArray(application.job?.skills) && application.job.skills.length > 0) {
      requiredSkills = application.job.skills.flatMap((s) =>
        typeof s === "string"
          ? s.split(",").map((item) => item.trim()).filter(Boolean)
          : []
      );
    }

    // 2. If empty, deduce from Job Title & Description
    if (requiredSkills.length === 0) {
      const jobContext = `${application.job?.title || ""} ${application.job?.description || ""}`.toLowerCase();

      if (
        jobContext.includes("front") ||
        jobContext.includes("react") ||
        jobContext.includes("web")
      ) {
        requiredSkills = ["React", "JavaScript", "HTML", "CSS", "Node.js"];
      } else if (
        jobContext.includes("back") ||
        jobContext.includes("node") ||
        jobContext.includes("api")
      ) {
        requiredSkills = ["Node.js", "Express", "MongoDB", "JavaScript", "REST API"];
      } else if (
        jobContext.includes("full") ||
        jobContext.includes("mern")
      ) {
        requiredSkills = [
          "React",
          "Node.js",
          "MongoDB",
          "Express",
          "JavaScript",
          "HTML",
          "CSS",
        ];
      } else if (
        jobContext.includes("python") ||
        jobContext.includes("data") ||
        jobContext.includes("ai")
      ) {
        requiredSkills = ["Python", "SQL", "Git", "REST API"];
      } else if (jobContext.includes("java")) {
        requiredSkills = ["Java", "SQL", "Git", "REST API"];
      } else {
        requiredSkills = [
          "React",
          "JavaScript",
          "HTML",
          "CSS",
          "Node.js",
          "MongoDB",
        ];
      }
    }

    const result = await analyzeResume(
      resumeSource,
      requiredSkills,
      fallbackCandidateText
    );

    res.json({
      candidate: application.applicant?.name || "Candidate",
      job: application.job?.title || "Job Position",
      score: result.score,
      matchedSkills: result.matchedSkills,
      missingSkills: result.missingSkills,
    });
  } catch (err) {
    console.error("RESUME ANALYSIS ERROR:", err);
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
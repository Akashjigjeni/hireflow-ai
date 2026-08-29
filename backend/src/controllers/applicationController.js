const Application = require("../models/Application");
const Job = require("../models/Job");
const sendEmail = require("../utils/sendEmail");

// ===============================
// Apply for Job
// ===============================
const applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { coverLetter } = req.body;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    const fs = require("fs");
    let resumeData = "";
    if (req.file) {
      try {
        resumeData = fs.readFileSync(req.file.path, { encoding: "base64" });
      } catch (fileErr) {
        console.error("Could not read uploaded file into base64:", fileErr.message);
      }
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      coverLetter,
      resume: req.file ? `uploads/${req.file.filename}` : "",
      resumeData,
    });

    res.status(201).json(application);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "You have already applied to this job",
      });
    }

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// ===============================
// Candidate Applications
// ===============================
const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate("job", "title company location salaryRange")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// ===============================
// Recruiter - View Applicants
// ===============================
const getApplicationsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not Authorized",
      });
    }

    const applications = await Application.find({
      job: jobId,
    })
      .populate(
        "applicant",
        "name email phone location education skills profileImage resume"
      )
      .populate("job")
      .sort({
        createdAt: -1,
      });

    res.json(applications);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// ===============================
// Accept / Reject Application
// ===============================
const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const application = await Application.findById(req.params.id)
      .populate("job")
      .populate("applicant", "name email");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
      });
    }

    if (
      application.job.postedBy.toString() !==
      req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Not Authorized",
      });
    }

    application.status = status;

    await application.save();

    let subject = "";
    let message = "";

    if (status === "Accepted") {
      subject =
        "🎉 Congratulations! Your Job Application is Accepted";

      message = `
Hello ${application.applicant.name},

Congratulations!

Your application for the position of "${application.job.title}" has been ACCEPTED.

The employer will contact you shortly.

Thank you for using HireFlow AI.

Regards,
HireFlow AI Team
`;
    }

    if (status === "Rejected") {
      subject = "Job Application Update";

      message = `
Hello ${application.applicant.name},

Thank you for applying for "${application.job.title}".

Unfortunately your application was not selected.

We encourage you to apply for more jobs on HireFlow AI.

Regards,
HireFlow AI Team
`;
    }

    if (subject && message) {
      await sendEmail(
        application.applicant.email,
        subject,
        message
      );
    }

    res.json({
      message: "Application Updated",
      application,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getApplicationsForJob,
  updateApplicationStatus,
};
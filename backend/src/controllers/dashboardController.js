const Job = require("../models/Job");
const Application = require("../models/Application");

// @desc Get Employer Dashboard Statistics
// @route GET /api/dashboard/stats
// @access Private

const getEmployerStats = async (req, res) => {
  try {
    const employerId = req.user._id;

    // Get all jobs posted by logged-in employer
    const jobs = await Job.find({
      postedBy: employerId,
    });

    const jobIds = jobs.map((job) => job._id);

    // Get all applications for employer's jobs
    const applications = await Application.find({
      job: { $in: jobIds },
    });

    const totalJobs = jobs.length;
    const totalApplicants = applications.length;

    const accepted = applications.filter(
      (app) => app.status === "Accepted"
    ).length;

    const rejected = applications.filter(
      (app) => app.status === "Rejected"
    ).length;

    const pending = applications.filter(
      (app) => app.status === "Pending"
    ).length;

    res.status(200).json({
      totalJobs,
      totalApplicants,
      accepted,
      rejected,
      pending,
    });
  } catch (err) {
    console.error("Dashboard Error:", err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

module.exports = {
  getEmployerStats,
};
const Job = require("../models/Job");
const Application = require("../models/Application");

// =====================================
// GET EMPLOYER DASHBOARD STATISTICS
// GET /api/dashboard/stats
// Private
// =====================================

const getEmployerStats = async (req, res) => {
  try {
    const employerId = req.user._id;

    // Get all jobs posted by the logged-in employer
    const jobs = await Job.find({
      postedBy: employerId,
    });

    const jobIds = jobs.map((job) => job._id);

    // Get all applications for employer's jobs
    const applications = await Application.find({
      job: {
        $in: jobIds,
      },
    });

    const totalJobs = jobs.length;

    const totalApplicants = applications.length;

    const accepted = applications.filter(
      (application) =>
        application.status === "Accepted"
    ).length;

    const rejected = applications.filter(
      (application) =>
        application.status === "Rejected"
    ).length;

    const pending = applications.filter(
      (application) =>
        application.status === "Pending"
    ).length;

    res.status(200).json({
      totalJobs,
      totalApplicants,
      accepted,
      rejected,
      pending,
    });

  } catch (error) {
    console.error(
      "Dashboard Statistics Error:",
      error
    );

    res.status(500).json({
      message:
        "Failed to fetch dashboard statistics",
    });
  }
};

module.exports = {
  getEmployerStats,
};
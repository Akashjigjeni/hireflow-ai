const Application = require("../models/Application");
const SavedJob = require("../models/SavedJob");

const getCandidateStats = async (req, res) => {
  try {
    const candidateId = req.user._id;

    // Fetch applications with job details
    const applications = await Application.find({
      candidate: candidateId,
    })
      .populate("job")
      .sort({ createdAt: -1 });

    // Fetch saved jobs
    const savedJobs = await SavedJob.find({
      user: candidateId,
    });

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
      totalApplications: applications.length,
      accepted,
      rejected,
      pending,
      savedJobs: savedJobs.length,
      recentApplications: applications.slice(0, 5),
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
  getCandidateStats,
};
const SavedJob = require("../models/SavedJob");

// Save Job
const saveJob = async (req, res) => {
  try {
    const saved = await SavedJob.create({
      user: req.user._id,
      job: req.params.jobId,
    });

    res.status(201).json(saved);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({
        message: "Job already saved",
      });
    }

    res.status(500).json({
      message: err.message,
    });
  }
};

// Get Saved Jobs
const getSavedJobs = async (req, res) => {
  try {
    const jobs = await SavedJob.find({
      user: req.user._id,
    }).populate("job");

    res.json(jobs);
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

// Remove Saved Job
const removeSavedJob = async (req, res) => {
  try {
    await SavedJob.findOneAndDelete({
      user: req.user._id,
      job: req.params.jobId,
    });

    res.json({
      message: "Removed successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};

module.exports = {
  saveJob,
  getSavedJobs,
  removeSavedJob,
};
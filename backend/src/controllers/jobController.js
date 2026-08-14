const Job = require("../models/Job");
const Application = require("../models/Application");
const User = require("../models/User");
const calculateJobRecommendations = require("../ai/jobRecommendation");

// ===============================
// Create Job
// ===============================
const createJob = async (req, res) => {
  try {
    const {
      title,
      description,
      company,
      location,
      salaryRange,
      skills,
    } = req.body;

    console.log("=================================");
    console.log("Creating Job...");
    console.log("Logged in Employer ID:", req.user._id);
    console.log("Title:", title);
    console.log("Skills:", skills);
    console.log("=================================");

    const job = await Job.create({
      title,
      description,
      company,
      location,
      salaryRange,
      skills,
      postedBy: req.user._id,
    });

    console.log("✅ Job Created Successfully");
    console.log(job);

    res.status(201).json(job);
  } catch (err) {
    console.error("CREATE JOB ERROR:");
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// ===============================
// Get All Jobs
// ===============================
const getJobs = async (req, res) => {
  try {
    const {
      search,
      company,
      location,
      sort,
      page = 1,
    } = req.query;

    const limit = 5;

    let query = {};

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (company) {
      query.company = {
        $regex: company,
        $options: "i",
      };
    }

    if (location) {
      query.location = {
        $regex: location,
        $options: "i",
      };
    }

    let jobsQuery = Job.find(query).populate(
      "postedBy",
      "name email"
    );

    if (sort === "oldest") {
      jobsQuery = jobsQuery.sort({
        createdAt: 1,
      });
    } else {
      jobsQuery = jobsQuery.sort({
        createdAt: -1,
      });
    }

    const totalJobs = await Job.countDocuments(query);

    const jobs = await jobsQuery
      .skip((Number(page) - 1) * limit)
      .limit(limit);

    res.json({
      jobs,
      page: Number(page),
      pages: Math.ceil(totalJobs / limit),
      totalJobs,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// ===============================
// Get Job By ID
// ===============================
const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate(
      "postedBy",
      "name email"
    );

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.json(job);
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// ===============================
// Update Job
// ===============================
const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    Object.assign(job, req.body);

    await job.save();

    res.json(job);
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// ===============================
// Delete Job
// ===============================
const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "Not authorized",
      });
    }

    await job.deleteOne();

    res.json({
      message: "Job deleted successfully",
    });
  } catch (err) {
    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// ===============================
// My Jobs
// ===============================
const getMyJobs = async (req, res) => {
  try {
    console.log("=================================");
    console.log("Logged in User ID:", req.user._id);

    const jobs = await Job.find({
      postedBy: req.user._id,
    }).sort({
      createdAt: -1,
    });

    console.log("Jobs Found:", jobs.length);
    console.log(jobs);
    console.log("=================================");

    res.status(200).json(jobs);
  } catch (err) {
    console.error("GET MY JOBS ERROR:");
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// ===============================
// Dashboard Statistics
// ===============================
const getDashboardStats = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user._id,
    });

    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: {
        $in: jobIds,
      },
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

    res.json({
      totalJobs,
      totalApplicants,
      accepted,
      rejected,
      pending,
    });
  } catch (err) {
    console.error("DASHBOARD ERROR:");
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
// ===============================
// Recommended Jobs for Candidate
// ===============================
const getRecommendedJobs = async (req, res) => {
  try {
    console.log("========== AI RECOMMENDATION ==========");

    console.log("Logged In User ID:", req.user._id);

    const user = await User.findById(req.user._id);

    console.log("User Found:", user);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const candidateSkills = user.skills
      ? user.skills.split(",").map((skill) => skill.trim())
      : [];

    console.log("Candidate Skills:", candidateSkills);

    const jobs = await Job.find().populate(
      "postedBy",
      "name email"
    );

    console.log("Jobs Count:", jobs.length);

    jobs.forEach((job) => {
      console.log(job.title, job.skills);
    });

    const recommendations =
      calculateJobRecommendations(
        candidateSkills,
        jobs
      );

    console.log(
      "Recommendations:",
      recommendations
    );

    const filteredRecommendations = recommendations.filter(
  (job) => job.score > 0
);

res.status(200).json(filteredRecommendations);
  } catch (err) {
    console.error("RECOMMENDATION ERROR:");
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};
module.exports = {
  createJob,
  getJobs,
  getJobById,
  updateJob,
  deleteJob,
  getMyJobs,
  getDashboardStats,
  getRecommendedJobs,
};
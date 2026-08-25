const Job = require("../models/Job");
const Application = require("../models/Application");

// =====================================
// CREATE JOB
// POST /api/jobs
// =====================================

const createJob = async (req, res) => {
  try {
    const {
      title,
      company,
      location,
      salaryRange,
      description,
      skills,
    } = req.body;

    if (
      !title ||
      !company ||
      !location ||
      !salaryRange ||
      !description
    ) {
      return res.status(400).json({
        message: "Please fill all required fields",
      });
    }

    const job = await Job.create({
      title,
      company,
      location,
      salaryRange,
      description,
      skills: skills || [],
      postedBy: req.user._id,
    });

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (error) {
    console.error("CREATE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to create job",
      error: error.message,
    });
  }
};

// =====================================
// GET ALL JOBS
// GET /api/jobs
// =====================================

const getJobs = async (req, res) => {
  try {
    const { search, company, location, sort } = req.query;

    const query = {};

    if (search && search.trim()) {
      const searchRegex = { $regex: search.trim(), $options: "i" };
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { company: searchRegex },
        { skills: { $in: [new RegExp(search.trim(), "i")] } },
      ];
    }

    if (company && company.trim()) {
      query.company = { $regex: company.trim(), $options: "i" };
    }

    if (location && location.trim()) {
      query.location = { $regex: location.trim(), $options: "i" };
    }

    let sortOption = { createdAt: -1 };
    if (sort === "oldest") {
      sortOption = { createdAt: 1 };
    }

    const jobs = await Job.find(query)
      .populate("postedBy", "name email")
      .sort(sortOption);

    res.status(200).json(jobs);
  } catch (error) {
    console.error("GET JOBS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch jobs",
      error: error.message,
    });
  }
};

// =====================================
// GET SINGLE JOB
// GET /api/jobs/:id
// =====================================

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id)
      .populate("postedBy", "name email");

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    res.status(200).json(job);
  } catch (error) {
    console.error("GET JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch job",
      error: error.message,
    });
  }
};

// =====================================
// GET EMPLOYER'S JOBS
// GET /api/jobs/my/jobs
// =====================================

const getMyJobs = async (req, res) => {
  try {
    const jobs = await Job.find({
      postedBy: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(jobs);
  } catch (error) {
    console.error("GET MY JOBS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch your jobs",
      error: error.message,
    });
  }
};

// =====================================
// UPDATE JOB
// PUT /api/jobs/:id
// =====================================

const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Only the employer who posted the job can edit it
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to update this job",
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    res.status(200).json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (error) {
    console.error("UPDATE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to update job",
      error: error.message,
    });
  }
};

// =====================================
// DELETE JOB
// DELETE /api/jobs/:id
// =====================================

const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
      });
    }

    // Only job owner can delete
    if (job.postedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        message: "You are not authorized to delete this job",
      });
    }

    // Delete applications related to this job
    await Application.deleteMany({
      job: req.params.id,
    });

    // Delete job
    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "Job deleted successfully",
    });
  } catch (error) {
    console.error("DELETE JOB ERROR:", error);

    res.status(500).json({
      message: "Failed to delete job",
      error: error.message,
    });
  }
};

// =====================================
// EMPLOYER DASHBOARD STATISTICS
// GET /api/jobs/stats
// =====================================

const getDashboardStats = async (req, res) => {
  try {
    const employerId = req.user._id;

    // Get all jobs posted by employer
    const jobs = await Job.find({
      postedBy: employerId,
    });

    const jobIds = jobs.map((job) => job._id);

    // Get all applications for those jobs
    const applications = await Application.find({
      job: {
        $in: jobIds,
      },
    });

    const totalJobs = jobs.length;

    const totalApplicants = applications.length;

    const accepted = applications.filter(
      (application) =>
        application.status?.toLowerCase() === "accepted"
    ).length;

    const rejected = applications.filter(
      (application) =>
        application.status?.toLowerCase() === "rejected"
    ).length;

    const pending = applications.filter(
      (application) =>
        application.status?.toLowerCase() === "pending"
    ).length;

    res.status(200).json({
      totalJobs,
      totalApplicants,
      accepted,
      rejected,
      pending,
    });
  } catch (error) {
    console.error("DASHBOARD STATS ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch dashboard statistics",
      error: error.message,
    });
  }
};

// =====================================
// AI RECOMMENDED JOBS
// GET /api/jobs/recommended
// =====================================

const getRecommendedJobs = async (req, res) => {
  try {
    // Get all available jobs
    const jobs = await Job.find()
      .populate("postedBy", "name email")
      .sort({ createdAt: -1 });

    // If no jobs exist
    if (!jobs || jobs.length === 0) {
      return res.status(200).json([]);
    }

    // Basic recommendation score
    // AI recommendation can be improved later
    const recommendations = jobs.map((job) => {
      let score = 50;

      // Don't recommend jobs posted by the same user
      if (
        job.postedBy &&
        job.postedBy._id &&
        job.postedBy._id.toString() === req.user._id.toString()
      ) {
        score = 0;
      }

      return {
        ...job.toObject(),
        score,
      };
    });

    // Remove jobs with score 0
    const filteredRecommendations =
      recommendations.filter(
        (job) => job.score > 0
      );

    // Highest score first
    filteredRecommendations.sort(
      (a, b) => b.score - a.score
    );

    res.status(200).json(filteredRecommendations);
  } catch (error) {
    console.error("RECOMMENDATION ERROR:", error);

    res.status(500).json({
      message: "Failed to fetch recommended jobs",
      error: error.message,
    });
  }
};

// =====================================
// EXPORT CONTROLLERS
// =====================================

module.exports = {
  createJob,
  getJobs,
  getJobById,
  getMyJobs,
  updateJob,
  deleteJob,
  getDashboardStats,
  getRecommendedJobs,
};
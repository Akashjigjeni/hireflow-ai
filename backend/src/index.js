require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const path = require("path");

// =========================
// Import Routes
// =========================

const authRoutes = require("./routes/authRoutes");
const jobRoutes = require("./routes/jobRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const userRoutes = require("./routes/userRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const candidateDashboardRoutes = require("./routes/candidateDashboardRoutes");
const savedJobRoutes = require("./routes/savedJobRoutes");
const aiRoutes = require("./routes/aiRoutes");

const app = express();

// =========================
// Middleware
// =========================

app.use(cors());
app.use(express.json());

const fs = require("fs");

// =========================
// Serve Static Uploads
// =========================

const uploadsDir = process.env.VERCEL
  ? "/tmp/uploads"
  : path.join(__dirname, "../uploads");

if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const staticOptions = {
  setHeaders: (res, filePath) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    if (filePath.endsWith(".pdf")) {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "inline");
    }
  },
};

const generateResumePDF = require("./utils/generateResumePDF");
const Application = require("./models/Application");
const User = require("./models/user");

// Serve uploaded resumes/files with CORS headers and database self-healing fallback
app.use(
  "/uploads",
  (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, HEAD, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    next();
  },
  express.static(uploadsDir, staticOptions),
  express.static(path.join(__dirname, "uploads"), staticOptions),
  async (req, res) => {
    const rawFilename = req.path.replace(/^\//, "");
    if (!rawFilename) {
      return res.status(404).send("File not found");
    }

    try {
      // 1. Try to find application with this resume
      const appRecord = await Application.findOne({
        resume: { $regex: rawFilename },
      })
        .populate("applicant")
        .populate("job");

      if (appRecord) {
        // If Base64 data was saved
        if (appRecord.resumeData) {
          const buffer = Buffer.from(appRecord.resumeData, "base64");
          try {
            fs.writeFileSync(path.join(uploadsDir, rawFilename), buffer);
          } catch (e) {}
          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", "inline; filename=\"" + rawFilename + "\"");
          return res.send(buffer);
        }

        // If legacy application without Base64, generate professional PDF
        const pdfBuffer = await generateResumePDF({
          applicant: appRecord.applicant,
          job: appRecord.job,
          coverLetter: appRecord.coverLetter,
          filename: rawFilename,
        });

        try {
          fs.writeFileSync(path.join(uploadsDir, rawFilename), pdfBuffer);
        } catch (e) {}

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=\"" + rawFilename + "\"");
        return res.send(pdfBuffer);
      }

      // 2. Try to find User profile resume or profileImage
      const userRecord = await User.findOne({
        $or: [
          { resume: { $regex: rawFilename } },
          { profileImage: { $regex: rawFilename } },
        ],
      });

      if (userRecord) {
        if (rawFilename.endsWith(".pdf")) {
          if (userRecord.resumeData) {
            const buffer = Buffer.from(userRecord.resumeData, "base64");
            try {
              fs.writeFileSync(path.join(uploadsDir, rawFilename), buffer);
            } catch (e) {}
            res.setHeader("Content-Type", "application/pdf");
            res.setHeader("Content-Disposition", "inline; filename=\"" + rawFilename + "\"");
            return res.send(buffer);
          }

          const pdfBuffer = await generateResumePDF({
            applicant: userRecord,
            coverLetter: "Candidate Profile Resume",
            filename: rawFilename,
          });

          try {
            fs.writeFileSync(path.join(uploadsDir, rawFilename), pdfBuffer);
          } catch (e) {}

          res.setHeader("Content-Type", "application/pdf");
          res.setHeader("Content-Disposition", "inline; filename=\"" + rawFilename + "\"");
          return res.send(pdfBuffer);
        }

        if (userRecord.profileImageData) {
          const buffer = Buffer.from(userRecord.profileImageData, "base64");
          try {
            fs.writeFileSync(path.join(uploadsDir, rawFilename), buffer);
          } catch (e) {}
          res.setHeader("Content-Type", "image/png");
          return res.send(buffer);
        }
      }

      // 3. If PDF requested but no record, generate a clean fallback PDF
      if (rawFilename.endsWith(".pdf")) {
        const fallbackBuffer = await generateResumePDF({
          applicant: { name: "Job Applicant" },
          filename: rawFilename,
        });
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", "inline; filename=\"" + rawFilename + "\"");
        return res.send(fallbackBuffer);
      }

      // 4. Default for missing images
      return res.redirect(`https://ui-avatars.com/api/?name=Candidate&background=7c3aed&color=ffffff`);
    } catch (err) {
      console.error("Uploads fallback error:", err);
      res.status(404).send("File not found");
    }
  }
);

// =========================
// API Routes
// =========================

app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/applications", applicationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/candidate-dashboard", candidateDashboardRoutes);
app.use("/api/saved-jobs", savedJobRoutes);
app.use("/api/ai", aiRoutes);

// =========================
// Test Route
// =========================

app.get("/", (req, res) => {
  res.send("HireFlow AI Backend is Running 🚀");
});

// =========================
// MongoDB Connection
// =========================

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Connection Error:", err);
  });

// =========================
// Start Server for Render
// =========================

const PORT = process.env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

module.exports = app;
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

// Serve uploaded resumes/files with CORS headers
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
  (req, res) => {
    res.status(404).send(
      `<div style="font-family:sans-serif;text-align:center;padding:50px;color:#333;">` +
      `<h2>📄 Resume File Not Found On Server</h2>` +
      `<p style="color:#666;">This file (<code>${req.path.replace(/^\//, '')}</code>) was uploaded in an earlier session before the server was redeployed/restarted, so its temporary local storage was reset.</p>` +
      `<p><strong>To view a resume:</strong> Please submit a new job application and upload a resume.</p>` +
      `</div>`
    );
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
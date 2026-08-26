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

// =========================
// Serve Static Uploads
// =========================

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
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
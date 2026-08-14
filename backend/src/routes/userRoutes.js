const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getProfile,
  updateProfile,
} = require("../controllers/userController");

const upload = require("../middleware/uploadMiddleware");

// Get Logged In User
router.get("/profile", protect, getProfile);

// Update Profile
router.put(
  "/profile",
  protect,
  upload.fields([
    {
      name: "profileImage",
      maxCount: 1,
    },
    {
      name: "resume",
      maxCount: 1,
    },
  ]),
  updateProfile
);

module.exports = router;
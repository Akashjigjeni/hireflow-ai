const User = require("../models/user");

// ==========================
// Get Logged-in User Profile
// ==========================
const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Server Error",
      error: err.message,
    });
  }
};

// ==========================
// Update Profile
// ==========================
const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.name = req.body.name || user.name;
    user.phone = req.body.phone || user.phone;
    user.location = req.body.location || user.location;
    user.education = req.body.education || user.education;
    user.skills = req.body.skills || user.skills;

    const fs = require("fs");

    if (req.files?.profileImage) {
      user.profileImage =
        "uploads/" + req.files.profileImage[0].filename;
      try {
        user.profileImageData = fs.readFileSync(req.files.profileImage[0].path, {
          encoding: "base64",
        });
      } catch (err) {
        console.error("Failed to read profileImage buffer:", err.message);
      }
    }

    if (req.files?.resume) {
      user.resume =
        "uploads/" + req.files.resume[0].filename;
      try {
        user.resumeData = fs.readFileSync(req.files.resume[0].path, {
          encoding: "base64",
        });
      } catch (err) {
        console.error("Failed to read resume buffer:", err.message);
      }
    }

    const updatedUser = await user.save();

    res.json({
      message: "Profile Updated Successfully",
      user: updatedUser,
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
  getProfile,
  updateProfile,
};
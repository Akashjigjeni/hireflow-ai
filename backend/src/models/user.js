const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["candidate", "employer"],
      default: "candidate",
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    location: {
      type: String,
      default: "",
    },

    education: {
      type: String,
      default: "",
    },

    skills: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    profileImageData: {
      type: String,
      default: "",
    },

    resume: {
      type: String,
      default: "",
    },

    resumeData: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// Compare Password
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports =
  mongoose.models.User || mongoose.model("User", userSchema);
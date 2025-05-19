const User = require("../models/user.model");
const mongoose = require("mongoose");
const path = require("path");

// Get current user's profile
exports.getProfile = async (req, res) => {
  try {
    const username = req.user.username;
    const user = await User.findOne({ username }).select("-__v");
    if (!user)
      return res.status(404).json({ message: "User profile not found" });

    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update profile fields (name, email, phone, skills, certifications)

exports.updateProfile = async (req, res) => {
  try {
    const username = req.user.username;
    const updateData = { ...req.body };

    // Only HR can update name and email
    if (req.user.role !== 'hr') {
      delete updateData.name;
      delete updateData.email;
    }

    const user = await User.findOneAndUpdate({ username }, updateData, {
      new: true,
    });
    if (!user)
      return res.status(404).json({ message: "User profile not found" });

    res.json({ message: "Profile updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// exports.updateProfile = async (req, res) => {
//   try {
//     const authId = req.user.userId;
//     const updateData = req.body;

//     // Validate fields as needed (optional)

//     const user = await User.findOneAndUpdate({ authId }, updateData, {
//       new: true,
//     });
//     if (!user)
//       return res.status(404).json({ message: "User profile not found" });

//     res.json({ message: "Profile updated successfully", user });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// Upload files (profilePhoto, resume, coverLetter)
// exports.uploadFiles = async (req, res) => {
//   try {
//     const authId = req.user.userId;
//     const user = await User.findOne({ authId });
//     if (!user)
//       return res.status(404).json({ message: "User profile not found" });

//     // Update URLs for uploaded files if present
//     if (req.files) {
//       if (req.files.profilePhoto) {
//         user.profilePhotoUrl = path.join(
//           "/uploads/photos",
//           req.files.profilePhoto[0].filename
//         );
//       }
//       if (req.files.resume) {
//         user.resumeUrl = path.join(
//           "/uploads/resumes",
//           req.files.resume[0].filename
//         );
//       }
//       if (req.files.coverLetter) {
//         user.coverLetterUrl = path.join(
//           "/uploads/coverletters",
//           req.files.coverLetter[0].filename
//         );
//       }
//     }

//     await user.save();

//     res.json({ message: "Files uploaded successfully", user });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

exports.uploadFiles = async (req, res) => {
  try {
    const authId = req.user.userId;
    const user = await User.findOne({ authId });
    if (!user)
      return res.status(404).json({ message: "User profile not found" });

    // Helper to delete old file if it exists
    const deleteOldFile = (fileUrl) => {
      if (fileUrl) {
        const filePath = path.join(__dirname, "..", "..", fileUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    };

    // Update URLs for uploaded files if present
    if (req.files) {
      if (req.files.profilePhoto) {
        // Delete old profile photo
        deleteOldFile(user.profilePhotoUrl);
        user.profilePhotoUrl = path.join(
          "/uploads/photos",
          req.files.profilePhoto[0].filename
        );
      }
      if (req.files.resume) {
        // Delete old resume
        deleteOldFile(user.resumeUrl);
        user.resumeUrl = path.join(
          "/uploads/resumes",
          req.files.resume[0].filename
        );
      }
      if (req.files.coverLetter) {
        // Delete old cover letter
        deleteOldFile(user.coverLetterUrl);
        user.coverLetterUrl = path.join(
          "/uploads/coverletters",
          req.files.coverLetter[0].filename
        );
      }
    }

    await user.save();

    res.json({ message: "Files uploaded successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
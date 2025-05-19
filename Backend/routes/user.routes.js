const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { verifyJWT } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Get user profile by authId (current logged-in user)
router.get('/profile', verifyJWT, userController.getProfile);

// Update user profile fields (name, skills, certifications, etc.)
router.put('/profile', verifyJWT, userController.updateProfile);

// Upload profile photo, resume, cover letter (multipart/form-data)
router.post('/upload', verifyJWT, upload.fields([
  { name: 'profilePhoto', maxCount: 1 },
  { name: 'resume', maxCount: 1 },
  { name: 'coverLetter', maxCount: 1 }
]), userController.uploadFiles);

module.exports = router;

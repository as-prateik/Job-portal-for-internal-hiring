const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');

// Middleware to restrict access based on roles
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  }
  next();
};

// Create a new job posting (Manager only)
router.post('/', authorizeRoles('manager'), jobController.createJob);

// Edit a job posting (Manager only)
router.put('/:jobId', authorizeRoles('manager'), jobController.updateJob);

// Delete a job posting (Manager only)
router.delete('/:jobId', authorizeRoles('manager'), jobController.deleteJob);

// List jobs with optional filters (any authenticated user)
router.get('/', jobController.listJobs);

// View applicants for a job (Manager only)
router.get('/:jobId/applicants', authorizeRoles('manager'), jobController.viewApplicants);

// Apply to a job (Employee only)
router.post('/:jobId/apply', authorizeRoles('employee'), jobController.applyToJob);

// View application status and notifications (Employee only)
router.get('/applications/status', authorizeRoles('employee'), jobController.viewApplications);

module.exports = router;

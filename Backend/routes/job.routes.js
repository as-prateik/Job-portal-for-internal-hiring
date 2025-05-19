const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');
const { verifyJWT }  = require('../middleware/auth.middleware');

// Middleware to restrict access based on roles
const authorizeRoles = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Access denied: insufficient permissions' });
  }
  next();
};

// Create a new job posting (Manager only)
router.post('/', verifyJWT, authorizeRoles('manager'), jobController.createJob);

// Edit a job posting (Manager only)
router.put('/:jobId', verifyJWT, authorizeRoles('manager'), jobController.updateJob);

// Delete a job posting (Manager only)
router.delete('/:jobId', verifyJWT, authorizeRoles('manager'), jobController.deleteJob);

// List jobs with optional filters (any authenticated user)
router.get('/', verifyJWT, jobController.listJobs);

// View applicants for a job (Manager only)
router.get('/:jobId/applicants', verifyJWT, authorizeRoles('manager'), jobController.viewApplicants);

// Apply to a job (Employee only)
router.post('/:jobId/apply', verifyJWT, authorizeRoles('employee'), jobController.applyToJob);

// View application status and notifications (Employee only)
router.get('/applications/status', verifyJWT, authorizeRoles('employee'), jobController.viewApplications);

module.exports = router;

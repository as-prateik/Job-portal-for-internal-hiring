const Job = require('../models/job.model');
const User = require('../models/user.model');
const mongoose = require('mongoose');

// Create a new job (Manager only)
exports.createJob = async (req, res) => {
  try {
    console.log('Creating job with data:', req.body);
    
    const { title, description, skillsRequired, location, salary, lastDate } = req.body;

    if (!title || !description || !skillsRequired || !location || !salary || !lastDate) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const job = new Job({
      title,
      description,
      skillsRequired,
      location,
      salary,
      postedBy: req.user.userId,
      postedDate: new Date(),
      lastDate: new Date(lastDate),
      updatedAt: new Date(),
      isActive: true,
      applicants: []
    });

    await job.save();
    res.status(201).json({ message: 'Job created successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update a job (Manager only)
exports.updateJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const updateData = req.body;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only update your own job postings' });
    }

    Object.assign(job, updateData);
    job.updatedAt = new Date();

    await job.save();
    res.json({ message: 'Job updated successfully', job });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete a job (Manager only)
exports.deleteJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only delete your own job postings' });
    }

    await job.deleteOne();
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// List jobs with optional filters (any authenticated user)
exports.listJobs = async (req, res) => {
  try {
    const { skills, location, minSalary, maxSalary, isActive } = req.query;

    // Build filter query
    const filter = {};
    if (skills) filter.skillsRequired = { $all: skills.split(',') };
    if (location) filter.location = location;
    if (minSalary || maxSalary) {
      filter.salary = {};
      if (minSalary) filter.salary.$gte = Number(minSalary);
      if (maxSalary) filter.salary.$lte = Number(maxSalary);
    }
    if (isActive !== undefined) filter.isActive = isActive === 'true';

    const jobs = await Job.find(filter).sort({ postedDate: -1 });
    res.json({ jobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Apply to a job (Employee only)
exports.applyToJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const userId = req.user.userId;

    const job = await Job.findById(jobId);
    if (!job || !job.isActive) {
      return res.status(404).json({ message: 'Job not found or inactive' });
    }

    // Check if user already applied
    const alreadyApplied = job.applicants.some(applicant => applicant.userId.toString() === userId);
    if (alreadyApplied) {
      return res.status(400).json({ message: 'You have already applied to this job' });
    }

    // Add applicant to job
    job.applicants.push({
      userId:new mongoose.Types.ObjectId(userId),
      status: 'applied',
      appliedAt: new Date()
    });
    await job.save();

    // Also update user's appliedJobs
    const user = await User.findOne({ authId: userId });
    user.appliedJobs.push({
      jobId: job._id,
      status: 'applied',
      appliedAt: new Date(),
      notification: 'Application received'
    });
    await user.save();

    res.json({ message: 'Application submitted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// View applicants for a job (Manager only)
exports.viewApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate('applicants.userId', 'name email skills');
    if (!job) return res.status(404).json({ message: 'Job not found' });

    if (job.postedBy.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'You can only view applicants for your own jobs' });
    }

    res.json({ applicants: job.applicants });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// View application status & notifications for current user (Employee only)
exports.viewApplications = async (req, res) => {
  try {
    const user = await User.findOne({ authId: req.user.userId });
    if (!user) return res.status(404).json({ message: 'User profile not found' });

    res.json({ appliedJobs: user.appliedJobs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

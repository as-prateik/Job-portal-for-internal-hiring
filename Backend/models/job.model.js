const mongoose = require('mongoose');

const ApplicantSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  status: {
    type: String,
    enum: ['applied', 'selected', 'rejected'],
    default: 'applied',
  },
  appliedAt: {
    type: Date,
    default: Date.now,
  },
});

const JobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  skillsRequired: {
    type: [String],
    default: [],
  },
  location: {
    type: String,
  },
  salary: {
    type: Number,
  },
  postedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Auth', // Manager reference
    required: true,
  },
  postedDate: {
    type: Date,
    default: Date.now,
  },
  lastDate: {
    type: Date,
    required: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  applicants: {
    type: [ApplicantSchema],
    default: [],
  },
});

module.exports = mongoose.model('Job', JobSchema);

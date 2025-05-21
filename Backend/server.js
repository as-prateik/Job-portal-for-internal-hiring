require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');



const errorlogger = require('./utilities/errorLogger');
const requestlogger = require('./utilities/requestLogger');

const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const jobRoutes = require('./routes/job.routes');
const { verifyJWT } = require('./middleware/auth.middleware');

const app = express();
const PORT = process.env.PORT || 5000;


app.use(requestlogger);
const connectDB = require('./config/db');

// MongoDB connection
connectDB();

// Middleware
app.use(cors());
app.use(express.json());       // Parse JSON bodies
app.use(express.urlencoded({ extended: true }));  // Parse URL-encoded bodies

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);   // Public routes: register, login

// Protect routes below with JWT middleware
app.use('/api/users', verifyJWT, userRoutes);
app.use('/api/jobs', verifyJWT, jobRoutes);

// Default route
app.get('/', (req, res) => {
  res.send('Internal Job Portal API is running');
});

// Error logging middleware
app.use(errorlogger);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Global error handler (basic)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

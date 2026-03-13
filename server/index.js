const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
const cors = require("cors");

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://sports-buddy-five.vercel.app",
    "https://sports-buddy-git-main-latishdev-gmailcoms-projects.vercel.app"
  ],
  methods: ["GET","POST","PUT","DELETE"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/matches', require('./routes/matchRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Sports Buddy API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Sports Buddy server running on port ${PORT}`);
});

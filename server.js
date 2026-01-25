const express = require('express');
const cors = require('cors');
const { connectToDatabase, getDatabase } = require('./db');
const classRoutes = require('./routes/classRoutes');
const studentRoutes = require('./routes/studentRoutes');
const lectureRoutes = require('./routes/lectureRoutes');
const teacherRoutes = require('./routes/teacherRoutes');
const simpleLectureRoutes = require('./routes/simpleLectureRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const attendanceRoutes = require('./routes/attendanceRoutes');
const authRoutes = require('./routes/authRoutes');
const teacherPortalRoutes = require('./routes/teacherPortalRoutes');
const teacherAttendanceRoutes = require('./routes/teacherAttendanceRoutes');
const adminAttendanceRoutes = require('./routes/adminAttendanceRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');
const exportRoutes = require('./routes/exportRoutes');
const subjectRoutes = require('./routes/subjectRoutes');
const noticeRoutes = require('./routes/noticeRoutes');
const profileRoutes = require('./routes/profileRoutes');
const studentDashboardRoutes = require('./routes/studentDashboardRoutes');
const timetableRoutes = require('./routes/timetableRoutes');
const studentAttendanceRoutes = require('./routes/studentAttendanceRoutes');
const adminExamRoutes = require('./routes/adminExamRoutes');
const studentExamRoutes = require('./routes/studentExamRoutes');
const teacherExamRoutes = require('./routes/teacherExamRoutes');
const { errorHandler, notFoundHandler } = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// CORS configuration - Allow all origins
app.use(cors({
  origin: '*', // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed HTTP methods
  allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
  credentials: true // Allow credentials
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Class Management API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      classes: '/api/classes',
      documentation: 'See README.md for API documentation'
    }
  });
});

app.get('/health', async (req, res) => {
  try {
    const db = getDatabase();
    await db.admin().ping();
    res.json({ status: 'healthy', database: 'connected' });
  } catch (error) {
    res.status(500).json({ status: 'unhealthy', database: 'disconnected', error: error.message });
  }
});

// API Routes
app.use('/api/classes', classRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/lectures', lectureRoutes);
app.use('/api/teachers', teacherRoutes);
app.use('/api/simple-lectures', simpleLectureRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/attendance', attendanceRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/teacher', teacherPortalRoutes);
app.use('/api/teacher', teacherAttendanceRoutes);
app.use('/api/admin', adminAttendanceRoutes);
app.use('/api/attendance', statisticsRoutes);
app.use('/api/admin', exportRoutes);
app.use('/api/subjects', subjectRoutes);
app.use('/api/admin/notices', noticeRoutes);
app.use('/api/users', profileRoutes);
// Specific student routes must come before general student route
app.use('/api/student/exams', studentExamRoutes);
app.use('/api/student/timetable', timetableRoutes);
app.use('/api/student/attendance', studentAttendanceRoutes);
app.use('/api/student', studentDashboardRoutes);
app.use('/api/admin/exams', adminExamRoutes);
app.use('/api/teacher/exams', teacherExamRoutes);

// 404 handler - must be after all routes
app.use(notFoundHandler);

// Error handling middleware - must be last
app.use(errorHandler);

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server', error);
    process.exit(1);
  }
}

startServer();

process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  const { closeConnection } = require('./db');
  await closeConnection();
  process.exit(0);
});
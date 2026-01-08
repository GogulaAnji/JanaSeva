import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { createServer } from 'http';
import { Server } from 'socket.io';
import connectDB from './config/database.js';

// Import Routes
import authRoutes from './routes/auth.routes.js';
import userRoutes from './routes/user.routes.js';
import workerRoutes from './routes/worker.routes.js';
import doctorRoutes from './routes/doctor.routes.js';
import farmerRoutes from './routes/farmer.routes.js';
import jobRoutes from './routes/job.routes.js';
import appointmentRoutes from './routes/appointment.routes.js';
import communityRoutes from './routes/community.routes.js';
import aiRoutes from './routes/ai.routes.js';
import adminRoutes from './routes/admin.routes.js';

// Load environment variables
dotenv.config();

// Initialize Express App
const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO for real-time features
const io = new Server(httpServer, {
    cors: {
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        methods: ['GET', 'POST'],
    },
});

// Connect to Database
connectDB();

// ============================================
// MIDDLEWARE
// ============================================

// Security Headers
app.use(helmet());

// CORS Configuration
app.use(
    cors({
        origin: process.env.FRONTEND_URL || 'http://localhost:5173',
        credentials: true,
    })
);

// Body Parser
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression
app.use(compression());

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
} else {
    app.use(morgan('combined'));
}

// Rate Limiting
const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100,
    message: 'Too many requests from this IP, please try again later.',
});
app.use('/api/', limiter);

// Static Files
app.use('/uploads', express.static('uploads'));

// ============================================
// SOCKET.IO - Real-time Communication
// ============================================
io.on('connection', (socket) => {
    console.log('✅ User connected:', socket.id);

    // Join user-specific room
    socket.on('join', (userId) => {
        socket.join(userId);
        console.log(`User ${userId} joined their room`);
    });

    // Handle chat messages
    socket.on('sendMessage', (data) => {
        io.to(data.recipientId).emit('receiveMessage', data);
    });

    // Handle notifications
    socket.on('sendNotification', (data) => {
        io.to(data.userId).emit('receiveNotification', data);
    });

    socket.on('disconnect', () => {
        console.log('❌ User disconnected:', socket.id);
    });
});

// Make io accessible to routes
app.set('io', io);

// ============================================
// API ROUTES
// ============================================

// Health Check
app.get('/api/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'JanaSeva API is running',
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
    });
});

// Authentication Routes
app.use('/api/auth', authRoutes);

// User Routes
app.use('/api/users', userRoutes);

// Worker Routes
app.use('/api/workers', workerRoutes);

// Doctor Routes
app.use('/api/doctors', doctorRoutes);

// Farmer Routes
app.use('/api/farmers', farmerRoutes);

// Job Routes
app.use('/api/jobs', jobRoutes);

// Appointment Routes
app.use('/api/appointments', appointmentRoutes);

// Community Service Routes
app.use('/api/community', communityRoutes);

// AI Routes
app.use('/api/ai', aiRoutes);

// Admin Routes
app.use('/api/admin', adminRoutes);

// ============================================
// ERROR HANDLING
// ============================================

// 404 Handler
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: 'Route not found',
        path: req.originalUrl,
    });
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error('❌ Error:', err);

    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// ============================================
// START SERVER
// ============================================

const PORT = process.env.PORT || 5000;

httpServer.listen(PORT, () => {
    console.log('');
    console.log('================================================');
    console.log('🚀 JanaSeva - People Service Platform');
    console.log('================================================');
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    console.log(`📡 API: http://localhost:${PORT}/api`);
    console.log(`🔌 Socket.IO: Enabled`);
    console.log('================================================');
    console.log('');
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Promise Rejection:', err);
    httpServer.close(() => process.exit(1));
});

export default app;

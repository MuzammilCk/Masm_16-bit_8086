import dotenv from 'dotenv';
import path from 'path';

// Load environment variables BEFORE any other modules
dotenv.config({ path: path.join(__dirname, '../.env') });

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { Server as SocketIOServer } from 'socket.io';
import http from 'http';
import { connectDatabase } from './config/database';
import projectRoutes from './routes/projects';
import executeRoutes from './routes/execute';
import executeStreamRoutes from './routes/execute-stream';
import aiRoutes from './routes/ai';
import authRoutes from './routes/auth';
import shareRoutes from './routes/share';
import classRoutes from './routes/classes';
import assignmentRoutes from './routes/assignments';
import adminRoutes from './routes/admin';

// Log API key status (first 10 chars only for security)
console.log('🔑 Gemini API Key:', process.env.GEMINI_API_KEY ? `${process.env.GEMINI_API_KEY.substring(0, 10)}...` : '❌ NOT FOUND');

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
});

const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Health check endpoints (for Render and local)
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/execute', executeRoutes);
app.use('/api/execute', executeStreamRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/share', shareRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/assignments', assignmentRoutes);
app.use('/api/admin', adminRoutes);

// Socket.IO for real-time collaboration
io.on('connection', (socket) => {
  console.log('🔌 Client connected:', socket.id);

  // Join a project room for collaboration
  socket.on('join-project', (projectId: string) => {
    socket.join(`project:${projectId}`);
    console.log(`User ${socket.id} joined project ${projectId}`);
  });

  // Broadcast code changes to collaborators
  socket.on('code-change', (data: { projectId: string; code: string; userId: string }) => {
    socket.to(`project:${data.projectId}`).emit('code-update', {
      code: data.code,
      userId: data.userId,
    });
  });

  // Broadcast cursor position
  socket.on('cursor-move', (data: { projectId: string; position: any; userId: string }) => {
    socket.to(`project:${data.projectId}`).emit('cursor-update', {
      position: data.position,
      userId: data.userId,
    });
  });

  socket.on('disconnect', () => {
    console.log('🔌 Client disconnected:', socket.id);
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
  });
});

// Start server
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDatabase();
    
    // Start Express server with Socket.IO
    server.listen(PORT, () => {
      console.log(`🚀 MASM Studio Backend running on port ${PORT}`);
      console.log(`📍 Health check: http://localhost:${PORT}/health`);
      console.log(`📍 API: http://localhost:${PORT}/api`);
      console.log(`🔌 Socket.IO enabled for real-time collaboration`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('SIGINT received, shutting down gracefully');
  process.exit(0);
});

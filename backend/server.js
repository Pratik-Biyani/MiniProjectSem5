const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidV4 } = require('uuid');

// Import routes
const userRoutes = require('./routes/userRoutes');
const eventRoutes = require('./routes/eventRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
// server.js - Add this after other route imports
const subscriptionRoutes = require('./routes/subscriptionRoutes');




const blogRoutes = require('./routes/blogRoutes');
const startupRoutes = require('./routes/startupRoutes');

// Import chat routes and socket service
const chatRoutes = require('./routes/chatRoutes');
const { initializeSocket } = require('./services/socketService');

const app = express();
const server = http.createServer(app);

// Socket.io setup
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"]
  }
});

// Initialize socket service (includes chat AND WebRTC functionality)
initializeSocket(io);

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api', blogRoutes);
app.use('/api', startupRoutes);

// Chat routes
app.use('/api/chat', chatRoutes);

// WebRTC routes
app.get('/api/call/generate-room', (req, res) => {
  const roomId = uuidV4();
  res.json({
    success: true,
    data: {
      roomId,
      roomUrl: `/call/${roomId}`
    }
  });
});

app.get('/api/call/room/:roomId', (req, res) => {
  const { roomId } = req.params;
  res.json({
    success: true,
    data: {
      roomId,
      roomUrl: `/call/${roomId}`
    }
  });
});

// Get user details for call
app.get('/api/users/call/:userId', async (req, res) => {
  try {
    const User = require('./models/User');
    const user = await User.findById(req.params.userId).select('name email role');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Error fetching user for call:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user details'
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    services: {
      chat: 'active',
      webrtc: 'active',
      socket: 'active',
      database: 'connected'
    }
  });
});

// Test endpoint
app.get('/api/test', (req, res) => {
  res.json({
    success: true,
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  });
});

// Connect DB & Start server
connectDB();
const PORT = process.env.PORT || 5001;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`💬 Chat service initialized`);
  console.log(`🎥 WebRTC service initialized`);
  console.log(`🔌 Socket.IO server active`);
  console.log(`🌐 CORS enabled for: http://localhost:5173`);
});
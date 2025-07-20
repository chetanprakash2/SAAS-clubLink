import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import http from 'http';
import dotenv from 'dotenv';
import { Server as SocketIO } from 'socket.io';

import clubsRoutes from './routes/clubs.js'; 
import authRoutes from './routes/auth.js';
import subdivisionRoutes from './routes/subdivision.js';
import postsRoutes from './routes/posts.cjs';

import { setupChatSocket, setupMeetingSocket } from './socket/index.js';

dotenv.config(); // Ensure env vars are loaded early
console.log("🔁 EMAIL_USER from env:", process.env.EMAIL_USER);
console.log("🔁 EMAIL_PASS from env:", process.env.EMAIL_PASS ? "✅ Present" : "❌ MISSING");

const app = express();
const server = http.createServer(app);

const io = new SocketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// CORS middleware for Express routes
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:9002',
  credentials: true
}));

app.use(express.json());

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/subdivisions', subdivisionRoutes);
app.use('/api/posts', postsRoutes);
app.use('/api/clubs', clubsRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('🌍 API is running...');
});

// Socket setup
setupChatSocket(io);
setupMeetingSocket(io);

// ✅ Connect to MongoDB with DB name confirmation
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log("✅ Connected to MongoDB Atlas");
  console.log("📂 Using database:", mongoose.connection.name); // ← shows actual DB used

  const PORT = process.env.PORT || 5000;
  server.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error('❌ MongoDB Atlas connection error:', err.message);
});

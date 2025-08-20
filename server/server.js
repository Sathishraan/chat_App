import cors from 'cors';
import 'dotenv/config';
import express from 'express';
import http from 'http';
import { Server } from "socket.io";
import { connectDB } from './lib/db.js';
import messageRouter from './routes/messageRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
const server = http.createServer(app);

// ✅ Initialize the socket.io server
export const io = new Server(server, {
    cors: { 
        origin: true, // Accept all origins
        credentials: true // Allow credentials if needed
    }
});

// ✅ Store user online
export const userSocketMap = {}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if (userId) userSocketMap[userId] = socket.id

    // Emit the online user to all connected clients
    io.emit("getOnlineUser", Object.keys(userSocketMap));

    socket.on("disconnect", () => {
        delete userSocketMap[userId];
        io.emit("getOnlineUser", Object.keys(userSocketMap));
    })
})

// ✅ CRITICAL: Set up CORS before routes
app.use(cors({
    origin: true, // Accept all origins for universal access
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// ✅ Middleware
app.use(express.json({ limit: "4mb" }));

// ✅ Health check route (important for Render)
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: "Server is running successfully",
        status: "healthy",
        timestamp: new Date().toISOString()
    });
});

// ✅ Routes
app.use('/api/server', (req, res) => res.send("server is Live"));
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

// ✅ Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Something went wrong!' });
});

// ✅ Handle 404 routes
app.use('*', (req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

// ✅ MongoDB connection with error handling
try {
    await connectDB();
    console.log('Database connected successfully');
} catch (error) {
    console.error('Database connection failed:', error);
    process.exit(1);
}

// ✅ Port configuration for Render
const PORT = process.env.PORT || 7007;

server.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
    console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use.`);
    } else {
        console.error('Server error:', err);
    }
});
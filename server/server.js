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

//Intiallize the socket.io server



export const io = new Server(server, {
    cors: { origin: "*" }

});

//store user online

export const userSocketMap = {}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;


    if (userId) userSocketMap[userId] = socket.id

    //Emit the online user to all connected clients

    io.emit("getOnlineUser", Object.keys(userSocketMap));


    socket.on("disconnect", () => {

        delete userSocketMap[userId];
        io.emit("getOnlineUser", Object.keys(userSocketMap));

    })
})




//Middleware

app.use(express.json({ limit: "4mb" }));

app.use(cors());

app.use('/api/server', (req, res) => res.send("server is Live"));
app.use('/api/auth', userRouter);
app.use('/api/messages', messageRouter);

//MongoDB

await connectDB();

const PORT = process.env.PORT

server.listen(PORT, () => {
    console.log("Server running on port " + PORT);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`Port ${PORT} is already in use.`);
    } else {
        console.error(err);
    }
});

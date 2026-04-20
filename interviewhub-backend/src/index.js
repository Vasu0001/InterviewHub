import dotenv from "dotenv";
dotenv.config({
  path: "./.env",
});
import app from "./app.js";
import connectDB from "./db/index.js";
import { createServer } from "http";
import { Server } from "socket.io";
const port = process.env.PORT || 3000;

const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  console.log(`🔌 New User Connected: ${socket.id}`);

  socket.on("join-room", ({ roomId, peerId }) => {
    socket.join(roomId);
    console.log(`User joined room: ${roomId} with PeerID: ${peerId}`);

    socket.to(roomId).emit("user-connected", peerId);
  });

  socket.on("request-join", ({ roomId, username }) => {
    socket.to(roomId).emit("join-request", { socketId: socket.id, username });
  });

  socket.on("grant-join", ({ targetSocketId, username, roomId }) => {
    io.to(targetSocketId).emit("join-granted");

    io.to(roomId).emit("receive-chat", {
      message: `👋 ${username} has joined the room.`,
      sender: "System",
    });
  });

  socket.on("code-change", ({ roomId, code }) => {
    socket.to(roomId).emit("receive-code", code);
  });

  socket.on("send-chat", ({ roomId, message, sender }) => {
    socket.to(roomId).emit("receive-chat", { message, sender });
  });

  socket.on("change-phase", ({ roomId, phase }) => {
    console.log(`Phase changing to ${phase} in room ${roomId}`); // Server tracker
    socket.to(roomId).emit("phase-changed", phase);
  });

  socket.on("change-question", ({ roomId, question }) => {
    socket.to(roomId).emit("question-changed", question);
  });
  socket.on("change-language", ({ roomId, language }) => {
    socket.to(roomId).emit("language-changed", language);
  });
  socket.on("toggle-hardware", ({ roomId, type, isOn }) => {
    socket.to(roomId).emit("remote-hardware-toggled", { type, isOn });
  });

  socket.on("sync-state", (data) => {
    socket.to(data.roomId).emit("receive-sync", data);
  });

  socket.on("disconnecting", () => {
    socket.rooms.forEach((room) => {
      if (room !== socket.id) {
        socket.to(room).emit("user-disconnected");
      }
    });
  });
  socket.on("disconnect", () => {
    console.log(`❌ User Disconnected: ${socket.id}`);
  });

  socket.on("code-running", ({ roomId }) => {
    socket.to(roomId).emit("code-running");
  });

  socket.on("receive-output", ({ roomId, output }) => {
    socket.to(roomId).emit("receive-output", output);
  });

  socket.on("receive-test-results", ({ roomId, testResults }) => {
    socket.to(roomId).emit("receive-test-results", testResults);
  });

  socket.on("end-interview", ({ roomId }) => {
    socket.to(roomId).emit("interview-ended");
  });
});

connectDB()
  .then(() => {
    httpServer.listen(port, () => {
      console.log(`⚙️  Server (with Sockets!) is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error " + err);
    process.exit(1);
  });

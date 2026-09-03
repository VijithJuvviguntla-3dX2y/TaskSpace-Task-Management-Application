require("dotenv").config();

console.log(
  "JWT_SECRET loaded:",
  !!process.env.JWT_SECRET
);

const express = require("express");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const {
  setSocketIO,
} = require("./socket");


const app = express();

// ==========================================
// CREATE HTTP SERVER
// ==========================================

const server = http.createServer(app);

// ==========================================
// CREATE SOCKET.IO SERVER
// ==========================================

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: [
      "GET",
      "POST",
      "PUT",
      "DELETE",
    ],
  },
});

// Make Socket.IO available
// throughout the backend
setSocketIO(io);

// ==========================================
// MIDDLEWARE
// ==========================================

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());

// ==========================================
// ROUTES
// ==========================================

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/tasks",
  taskRoutes
);

// ==========================================
// TEST ROUTE
// ==========================================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "TaskFlow API is running 🚀",
  });
});

// ==========================================
// SOCKET.IO
// ==========================================

io.on("connection", (socket) => {
  console.log(
    "🔌 Client connected:",
    socket.id
  );

  // ========================================
  // JOIN USER ROOM
  // ========================================

  socket.on(
    "joinUserRoom",
    (userId) => {
      const roomName =
        `user_${userId}`;

      socket.join(roomName);

      console.log(
        `👤 User ${userId} joined room: ${roomName}`
      );
    }
  );

  // ========================================
  // DISCONNECT
  // ========================================

  socket.on("disconnect", () => {
    console.log(
      "❌ Client disconnected:",
      socket.id
    );
  });
});

// ==========================================
// START SERVER
// ==========================================

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );

  console.log(
    `Socket.IO running on port ${PORT}`
  );
});
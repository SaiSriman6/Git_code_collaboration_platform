import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import http from "http";

import { connectToDB } from "./config/db.js";
import { startSocket } from "./sockets/socketServer.js";

import testRouter from "./routes/testRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import repoRoutes from "./routes/repoRoutes.js";
import commitRoutes from "./routes/commitRoutes.js";
import pullRequestRoutes from "./routes/pullRequestRoutes.js";
import issueRoutes from "./routes/issueRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import fileRoutes from "./routes/filesRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";

dotenv.config();

const app = express();


// ================= MIDDLEWARE =================

app.use(cors({
  origin:[
    "http://localhost:5173",
    "https://git-code-collaboration-platform-nine.vercel.app"
  ], 
  credentials: true
}));

app.use(express.json());

app.use(cookieParser());


// ================= HEALTH CHECK =================

app.get("/health", (req, res) => {

  res.status(200).json({

    status: "ok",

    message: "Server running",

    time: new Date()

  });

});


// ================= API ROUTES =================

// Test
app.use(
  "/api/test",
  testRouter
);

// Auth
app.use(
  "/api/auth",
  authRoutes
);

// Repositories
app.use(
  "/api/repos",
  repoRoutes
);

// Commits
app.use(
  "/api/commits",
  commitRoutes
);

// Pull Requests
app.use(
  "/api/pull-requests",
  pullRequestRoutes
);

// Issues
app.use(
  "/api/issues",
  issueRoutes
);

// Comments
app.use(
  "/api/comments",
  commentRoutes
);

// Files
app.use(
  "/api/files",
  fileRoutes
);

// Notifications
app.use(
  "/api/notifications",
  notificationRoutes
);


// ================= DATABASE =================

connectToDB();


// ================= HTTP SERVER =================

const server =
  http.createServer(app);


// ================= SOCKET SERVER =================

const io =
  startSocket(server);


// STORE io INSTANCE INSIDE EXPRESS APP
app.set("io", io);


// ================= START SERVER =================

const PORT =
  process.env.PORT || 5000;

server.listen(PORT, () => {

  console.log(
    `Server running on port ${PORT}`
  );

});


// ================= GLOBAL ERROR HANDLER =================

app.use((err, req, res, next) => {

  console.error(
    "Server error:",
    err
  );

  res.status(
    err.status || 500
  ).json({

    success: false,

    message:
      err.message ||
      "Internal server error"

  });

});


// ================= GRACEFUL SHUTDOWN =================

process.on("SIGINT", () => {

  console.log(
    "Shutting down server..."
  );

  server.close(() => {

    console.log(
      "Server closed"
    );

    process.exit(0);

  });

});
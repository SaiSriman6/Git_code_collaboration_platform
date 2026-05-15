import { Server } from "socket.io";

export const startSocket = (server) => {

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      credentials: true
    }
  });

  io.on("connection", (socket) => {

    console.log("User connected:", socket.id);

    // Join personal user room
    socket.on(
  "joinUserRoom",
  (userId) => {

    console.log(
      "JOIN ROOM EVENT RECEIVED:",
      userId
    );

    socket.join(
      userId.toString()
    );

    console.log(
      "User joined room:",
      userId.toString()
    );

  }
);

    // Join repository room
    socket.on("joinRepoRoom", (repoId) => {

      socket.join(repoId);

      console.log(`Joined repo room: ${repoId}`);

    });

    // Leave repository room
    socket.on("leaveRepoRoom", (repoId) => {

      socket.leave(repoId);

      console.log(`Left repo room: ${repoId}`);

    });

    socket.on("disconnect", () => {

      console.log("User disconnected:", socket.id);

    });

  });

  return io;

};
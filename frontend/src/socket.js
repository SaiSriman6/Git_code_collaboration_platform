import { io } from "socket.io-client";

const socket = io(
  "http://localhost:2929",
  {
    withCredentials: true
  }
);

socket.on("connect", () => {

  console.log(
    "Socket connected:",
    socket.id
  );

});

export default socket;
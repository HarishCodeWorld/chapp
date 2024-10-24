import { io } from "socket.io-client";
import { baseURL } from "../axios";

let socket;

export const initiateSocketConnection = (token) => {
  if (!socket) {
    socket = io(baseURL, {
      // socket = io("http://localhost:3030", {
      auth: {
        token: `Bearer ${token}`,
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });
  }
};

export const getSocket = () => {
  if (!socket) {
    throw new Error(
      "Socket not connected. Please call initiateSocketConnection first."
    );
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};

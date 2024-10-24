import React, { createContext, useContext, useEffect, useState } from "react";
import {
  initiateSocketConnection,
  getSocket,
  disconnectSocket,
} from "../socket";

const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      initiateSocketConnection(token);
      const socketInstance = getSocket();
      setSocket(socketInstance);

      return () => {
        disconnectSocket();
      };
    }
  }, []);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export const useSocket = () => {
  return useContext(SocketContext);
};

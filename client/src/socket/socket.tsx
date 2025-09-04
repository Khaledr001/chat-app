import { io, Socket } from "socket.io-client";
import { serverUrl } from "../constant/env";
import { createContext, useContext, useMemo } from "react";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  activeUsers: string[];
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
  activeUsers: [],
});

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }: any) => {
  const socket = useMemo(() => io(serverUrl, { withCredentials: true }), []);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };

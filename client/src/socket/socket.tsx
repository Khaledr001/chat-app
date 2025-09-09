import io, { Socket } from "socket.io-client";
import { serverUrl } from "../constant/env";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";

type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);

export const getSocket = () => useContext(SocketContext);

export const SocketProvider = ({ children }: { children: ReactNode }) => {
  const socket = useMemo(() => io(serverUrl, { withCredentials: true }), []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      console.log("Socket connected with id:", socket.id);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected");
    });

    // cleanup
    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

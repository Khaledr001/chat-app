import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

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

export const useSocket = () => useContext(SocketContext);

const showToast = (message: string, type: "success" | "error") => {
  const toast = document.createElement("div");
  toast.className = `fixed top-4 right-4 p-4 rounded-md text-white ${
    type === "success" ? "bg-green-500" : "bg-red-500"
  } transition-opacity duration-500`;
  toast.textContent = message;
  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = "0";
    setTimeout(() => document.body.removeChild(toast), 500);
  }, 3000);
};

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  useEffect(() => {
    // Get the current user from your auth system
    const currentUser = {
      id: 1, // Replace with actual user ID from your auth system
      name: "Current User", // Replace with actual user name
    };

    const newSocket = io("http://localhost:3100");

    newSocket.on("connect", () => {
      setIsConnected(true);
      // Join with user info when connected
      newSocket.emit("join", {
        userId: currentUser.id,
        username: currentUser.name,
      });
      showToast("Connected to chat server", "success");
    });

    newSocket.on("disconnect", () => {
      setIsConnected(false);
      showToast("Disconnected from chat server", "error");
    });

    newSocket.on("activeUsers", (users: number[]) => {
      setActiveUsers(users.map(String));
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected, activeUsers }}>
      {children}
    </SocketContext.Provider>
  );
};

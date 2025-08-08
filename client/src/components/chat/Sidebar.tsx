/* eslint-disable @typescript-eslint/no-unused-vars */
import { useSocket } from "../../contexts/SocketContext";
import { useState } from "react";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface User {
  userId: string;
  username: string;
  isOnline: boolean;
  lastSeen?: Date;
}

export const Sidebar = () => {
  const { activeUsers } = useSocket();
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredUsers = users.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen p-4 space-y-4 bg-gray-900">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 bg-gray-800 text-gray-200 rounded-md border-none focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="flex-1 space-y-2 overflow-y-auto">
        {filteredUsers.map((user) => (
          <div
            key={user.userId}
            className="flex items-center p-3 bg-gray-800 rounded-md cursor-pointer hover:bg-gray-700 transition-colors">
            <div className="relative w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
              {user.username[0].toUpperCase()}
              {user.isOnline && (
                <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-gray-800"></span>
              )}
            </div>
            <div className="ml-3 flex-1">
              <p className="font-semibold text-white">{user.username}</p>
              <p className="text-sm text-gray-400">
                {user.isOnline ? "Online" : "Offline"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

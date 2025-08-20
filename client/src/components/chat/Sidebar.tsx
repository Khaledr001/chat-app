import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
import { useChat } from "../../contexts/ChatContext";
import { useSocket } from "../../contexts/SocketContext";
// import { format } from "date-fns";

type TabType = "individual" | "rooms";

export const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TabType>("individual");
  const { socket } = useSocket();
  const { setSelectedUser } = useChat();
  const { data: users, isLoading, error } = useUsers();

  const filteredUsers =
    users?.filter((user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  // const getLastSeen = (user: { isOnline?: boolean; lastSeen?: Date }) => {
  //   if (user.isOnline) return "Active now";
  //   if (user.lastSeen)
  //     return `Last seen ${format(new Date(user.lastSeen), "h:mm a")}`;
  //   return "Offline";
  // };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        <button
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
            activeTab === "individual"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("individual")}>
          Individual
        </button>
        <button
          className={`flex-1 py-4 px-6 text-sm font-medium transition-colors ${
            activeTab === "rooms"
              ? "text-blue-400 border-b-2 border-blue-400"
              : "text-gray-400 hover:text-gray-300"
          }`}
          onClick={() => setActiveTab("rooms")}>
          Rooms
        </button>
      </div>

      {/* Search Bar */}
      <div className="p-4 border-b border-gray-800">
        <div className="relative">
          <input
            type="text"
            placeholder={`Search ${
              activeTab === "individual" ? "users" : "rooms"
            }...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-gray-800 text-gray-200 placeholder-gray-500 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="py-4 px-2">
          {activeTab === "individual" ? (
            // Individual Messages Section
            isLoading ? (
              <div className="flex items-center justify-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
                <p className="text-gray-400 mb-2">Unable to load users</p>
                <button className="text-blue-500 hover:text-blue-400 text-sm">
                  Try again
                </button>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
                <p className="text-gray-400 mb-1">No users found</p>
                <p className="text-gray-500 text-sm">
                  Try searching with a different term
                </p>
              </div>
            ) : (
              <div className="flex flex-col !p-2 gap-2">
                {filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    onClick={() => {
                      setSelectedUser({ id: user.id, name: user.name });
                      if (socket) {
                        socket.emit("join", {
                          userId: user.id,
                          username: user.name,
                        });
                      }
                    }}
                    className="flex items-center px-4 py-3 mb-2 rounded-xl cursor-pointer hover:bg-gray-800/50 transition-all duration-200 group">
                    <div className="relative flex-shrink-0">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 p-1 shadow-lg">
                        <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center text-white text-lg font-medium">
                          {user.name[0].toUpperCase()}
                        </div>
                      </div>
                      {user.isOnline && (
                        <div className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-[2.5px] border-gray-900 shadow-lg"></div>
                      )}
                    </div>
                    <div className="ml-4 flex-1 min-w-0 py-0.5">
                      <div className="flex items-baseline justify-between">
                        <h3 className="font-semibold text-[15px] text-white truncate group-hover:text-blue-400 transition-colors">
                          {user.name}
                        </h3>
                        <span className="text-xs text-gray-400 flex-shrink-0 group-hover:text-gray-300 ml-4">
                          2m
                        </span>
                      </div>
                      <div className="flex items-center justify-between mt-0.5">
                        <p className="text-sm text-gray-400 truncate">
                          {user.isOnline ? (
                            <span className="text-green-500 font-medium">
                              Active now
                            </span>
                          ) : (
                            "Last seen recently"
                          )}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            // Rooms Section
            <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
              <div className="flex flex-col !p-2 gap-2">
                <div className="flex items-center justify-center mb-4">
                  <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                    Create New Room
                  </button>
                </div>
                <div className="text-gray-400 text-center">
                  <p>No rooms available</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Create a new room to start chatting
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

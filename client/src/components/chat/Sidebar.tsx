import { useState } from "react";
import { useUsers } from "../../hooks/useUsers";
// import { format } from "date-fns";

export const Sidebar = () => {
  const [searchQuery, setSearchQuery] = useState("");
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
    <div className="flex flex-col h-screen bg-gray-900 ">


      {/* Chat List */}
      <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        <div className="py-4 px-2">
          {isLoading ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-500 border-t-transparent"></div>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
              <p className="text-gray-400 mb-2">Unable to load chats</p>
              <button className="text-blue-500 hover:text-blue-400 text-sm">
                Try again
              </button>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32 px-4 text-center">
              <p className="text-gray-400 mb-1">No chats found</p>
              <p className="text-gray-500 text-sm">
                Try searching with a different term
              </p>
            </div>
          ) : (
            <div className="flex flex-col !p-2 gap-2">
              {filteredUsers.map((user) => (
                <div
                  key={user.id}
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
          )}
        </div>
      </div>
    </div>
  );
};

import {
  LucideArrowLeftCircle,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { IUser } from "../../shear/types/userType";
import { useChatLayoutContext } from "../../contexts/ChatLayoutContext";

interface Member {
  id: string;
  name: string;
  avatar: string;
  lastSeen: string;
  isOnline: boolean;
  hasCheck?: boolean;
  isPinned?: boolean;
  status?: string;
}

const users: Member[] = [
  {
    id: "1",
    name: "Harry Maguire",
    avatar: "👤",
    lastSeen: "09:12 AM",
    isOnline: false,
    hasCheck: true,
    status: "You need to improve now",
  },
  {
    id: "2",
    name: "United Family 👹",
    avatar: "😈",
    lastSeen: "06:25 AM",
    isOnline: false,
    status: "Rashford is typing...",
  },
  {
    id: "3",
    name: "Ramsus Højlund",
    avatar: "👤",
    lastSeen: "03:11 AM",
    isOnline: false,
    isPinned: true,
    status: "Bro, I need to talk today",
  },
  {
    id: "4",
    name: "Andre Onana",
    avatar: "👤",
    lastSeen: "11:34 AM",
    isOnline: false,
    status: "I need more time bos 😊",
  },
  {
    id: "5",
    name: "Regulion",
    avatar: "👤",
    lastSeen: "09:12 AM",
    isOnline: false,
    hasCheck: true,
    status: "Great performance lad 🔥",
  },
  {
    id: "6",
    name: "Bruno Fernandes",
    avatar: "👤",
    lastSeen: "10:21 AM",
    isOnline: false,
    hasCheck: true,
    status: "Pay the game Bruno !",
  },
  {
    id: "7",
    name: "Masorri Mount",
    avatar: "👤",
    lastSeen: "10:11 AM",
    isOnline: false,
    hasCheck: true,
    status: "How about your injury?",
  },
  {
    id: "8",
    name: "Lisandro Martinez",
    avatar: "👤",
    lastSeen: "09:12 AM",
    isOnline: false,
    isPinned: true,
    status: "Keep a good performanc...",
  },
];

export const LeftSidebar = () => {
  const { showChats, setShowChats } = useChatLayoutContext();

  const [activeTab, setActiveTab] = useState<"all" | "personal" | "groups">(
    "all"
  );
  const [selectedChat, setSelectedChat] = useState<string>("united-family");
  const [searchClick, setSearchClick] = useState<boolean>(false);

  const searchRef = useRef<HTMLLabelElement>(null);

  const [user, setUser] = useState<IUser | null>(null);

  const handleSearch = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setSearchClick(true);
  };

  useEffect(() => {
    // get user from localsrorage
    const user = localStorage.getItem("user");
    if (user) {
      setUser(JSON.parse(user));
    }

    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setSearchClick(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="!p-1 w-full md:w-70 lg:w-96 xl:w-100 bg-base-100 border-r border-base-300 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center border-b border-base-300 h-[55px]">
        <button
          onClick={() => {
            setShowChats(!showChats);
          }}
          className="btn btn-sm btn-circle md:hidden">
          <LucideArrowLeftCircle className="h-6 w-6" />
        </button>
        <h2 className="text-xl w-[90%] text-center font-bold">Chats</h2>
      </div>

      {/* Avatar */}
      <div className="p-4 border-b border-base-300">
        <div className="flex ">
          <div className="avatar !mx-2 !my-3">
            <div className="ring-primary ring-offset-base-100 w-12 rounded-full ring-1 ring-offset-1">
              <img src={`http://localhost:3100/${user?.avatar?.url}`} />
            </div>
          </div>
          {/* Show user information */}
          {user && (  
            <div className="!mt-2 !mx-1.5">
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-base-content/50">{user.userName}</p>
            </div>
          )}
        </div>

        {/* Search */}
        <label
          ref={searchRef}
          onClick={handleSearch}
          className="input rounded-full w-full !my-2 !px-3 focus-within:outline-none">
          <svg
            className="h-[1em] opacity-50"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <g
              strokeLinejoin="round"
              strokeLinecap="round"
              strokeWidth="2.5"
              fill="none"
              stroke="currentColor">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.3-4.3"></path>
            </g>
          </svg>
          <input type="search" required placeholder="Search by user id" />
        </label>
      </div>

      {/* Tabs */}
      {searchClick === true ? null : (
        <>
          <div className="flex gap-4 justify-between !mx-2 !mt-4 !mb-2 !px-5 tabs tabs-box ">
            <a
              className={`!px-2 !my-2 !h-6 tab ${
                activeTab === "all" ? "tab-active text-primary" : ""
              }`}
              onClick={() => setActiveTab("all")}>
              All
            </a>
            <a
              className={`!px-2 !my-2 !h-6 tab ${
                activeTab === "personal" ? "tab-active text-primary" : ""
              }`}
              onClick={() => setActiveTab("personal")}>
              Personal
            </a>
            <a
              className={`!px-2 !my-2 !h-6 tab ${
                activeTab === "groups" ? "tab-active text-primary" : ""
              }`}
              onClick={() => setActiveTab("groups")}>
              Groups
            </a>
          </div>

          {/* Chat List */}
          <div className="flex-1 overflow-y-auto">
            <div className="!px-2">
              {users.map((user) => {
                const isSelected = selectedChat === user.id;
                return (
                  <div
                    key={user.id}
                    onClick={() => setSelectedChat(user.id)}
                    className={`flex !my-1.5 cursor-pointer rounded-lg transition-colors duration-150
                  ${
                    isSelected
                      ? "bg-success/30 shadow-sm"
                      : "hover:bg-warning/10"
                  }
                `}>
                    <div className="avatar">
                      <div className="w-11 rounded-full">
                        <img src="https://img.daisyui.com/images/profile/demo/idiotsandwich@192.webp" />
                      </div>
                    </div>
                    <div className="flex-1 !px-1 ml-3 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{user.name}</p>
                        <span className="text-xs text-base-content/50">
                          {user.lastSeen}
                        </span>
                      </div>
                      <p className="text-sm text-base-content/60 truncate">
                        {user.status}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

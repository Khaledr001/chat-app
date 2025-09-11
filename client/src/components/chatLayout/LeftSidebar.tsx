import { LucideArrowLeftCircle } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useErrors } from "../../hooks/custom";
import {
  useGetAllChatsQuery,
  useGetAllGroupChatsQuery,
  useGetAllPrivateChatsQuery,
} from "../../redux/api/api.rtk";
import { setChats } from "../../redux/reducers/chatLayout.reducer";
import {
  resetNewMessageAlert,
  setSelectedChatDetails,
  setSelectedChatId,
} from "../../redux/reducers/chat.reducer";
import { getOrSaveToLocalStorage } from "../../util/helper";
import { serverUrl } from "../../constant/env";

export interface Chat {
  _id: string;
  name: string;
  avatars: string[];
  members: string[];
  groupChat: boolean;
}

export const LeftSidebar = () => {
  const dispatch = useDispatch();
  const showChats = useSelector((state: any) => state.chatLayout.showChats);
  const user = useSelector((state: any) => state.auth.user);
  const { newMessageAlert } = useSelector((state: any) => state.chat);

  const [activeTab, setActiveTab] = useState<"all" | "personal" | "groups">(
    "all"
  );
  const [selectedChat, setSelectedChat] = useState<string>("");
  const [searchValue, setSearchValue] = useState<string>("");

  const [chatList, setChatList] = useState<Chat[]>([]);

  const handleSearch = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
  };

  const {
    data: allChats,
    isError: isAllChatsError,
    error: allChatsError,
  } = useGetAllChatsQuery(user._id);

  const {
    data: privateChats,
    isError: isPrivateChatError,
    error: privateChatError,
  } = useGetAllPrivateChatsQuery(user._id, {
    skip: activeTab === "personal",
  });

  const {
    data: groupChats,
    isError: isGroupChatError,
    error: groupChatError,
  } = useGetAllGroupChatsQuery(user._id, {
    skip: activeTab === "groups",
  });

  useErrors([
    { isError: isAllChatsError, error: allChatsError },
    { isError: isPrivateChatError, error: privateChatError },
    { isError: isGroupChatError, error: groupChatError },
  ]);

  const { id } = useParams<{ id: string }>(); // top-level hook

  useEffect(() => {
    console.log("chatId", id);
    setSelectedChat(id ?? "");
  }, [id]); // depend on `id`

  useEffect(() => {
    if (!user?._id) return;

    if (allChats) {
      console.log("all data", allChats?.chats);
      setChatList(allChats?.chats || []);
    }
  }, [allChats]);

  const navigate = useNavigate();

  // Handle select a chat
  const handleSelectChat = (chat: any) => {
    const chatId = chat._id;

    getOrSaveToLocalStorage({ key: "chatDetails", value: chat });

    console.log("chat details", chat);
    setSelectedChat(chatId);

    dispatch(setSelectedChatId(chatId));
    dispatch(resetNewMessageAlert(chatId));
    dispatch(setSelectedChatDetails(chat));

    navigate(`/chat/${chatId}`);
  };

  const handleAllChat = () => {
    setActiveTab("all");
    if (allChats) {
      setChatList(allChats?.chats);
    }
  };

  const handlePersonalChat = () => {
    setActiveTab("personal");
    if (privateChats) {
      console.log(privateChats);
      setChatList(privateChats?.private);
    }
  };
  const handleGroupChat = () => {
    setActiveTab("groups");
    if (groupChats) {
      setChatList(groupChats?.groups);
    }
  };

  return (
    <div className="!p-1 w-full md:w-70 lg:w-96 xl:w-100 bg-base-100 border-r-2 border-base-300 flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center border-b border-base-300 h-[55px]">
        <button
          onClick={() => {
            dispatch(setChats(!showChats));
          }}
          className="btn btn-sm btn-circle md:hidden">
          <LucideArrowLeftCircle className="h-6 w-6" />
        </button>
        <h2 className="text-xl w-[90%] text-center font-bold">Chats</h2>
      </div>

      {/* Avatar & Logout */}
      <div className="p-4 border-b border-base-300">
        {/* Search */}
        <label
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
          <input
            type="search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            required
            placeholder="Search by user id"
          />
        </label>
      </div>

      {/* Tabs */}
      <>
        <div className="flex gap-4 justify-between !mx-2 !mt-4 !mb-2 !px-5 tabs tabs-box ">
          <a
            className={`!px-2 !my-2 !h-6 tab ${
              activeTab === "all" ? "tab-active text-primary" : ""
            }`}
            onClick={handleAllChat}>
            All
          </a>
          <a
            className={`!px-2 !my-2 !h-6 tab ${
              activeTab === "personal" ? "tab-active text-primary" : ""
            }`}
            onClick={handlePersonalChat}>
            Personal
          </a>
          <a
            className={`!px-2 !my-2 !h-6 tab ${
              activeTab === "groups" ? "tab-active text-primary" : ""
            }`}
            onClick={handleGroupChat}>
            Groups
          </a>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          <div className="!px-2">
            {chatList.length > 0 ? (
              chatList?.map((chat: Chat) => {
                const isSelected = selectedChat === chat._id;
                const index = newMessageAlert.findIndex(
                  (item: any) => item.chatId === chat._id.toString()
                );
                let newMessageCount = 0;
                if (index !== -1)
                  newMessageCount = newMessageAlert[index].count;
                return (
                  <div
                    key={chat._id}
                    onClick={() => handleSelectChat(chat)}
                    className={`flex !my-1.5 cursor-pointer rounded-lg transition-colors duration-150
                  ${
                    isSelected
                      ? "bg-success/30 shadow-sm"
                      : "hover:bg-warning/10"
                  }
                `}>
                    {/* Avatars */}
                    {chat.groupChat ? (
                      <div className="avatar-group !-space-x-9">
                        {chat.avatars.slice(0, 3).map((avatar, index) => (
                          <div className="avatar" key={index}>
                            <div className="w-11 rounded-full ring ring-base-100 ring-offset-1">
                              <img
                                src={`${serverUrl}/${avatar}`}
                                alt={`Avatar ${index + 1}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="avatar">
                        <div className="w-11 rounded-full ring ring-base-100 ring-offset-1">
                          <img
                            src={`${serverUrl}/${chat.avatars[0]}`}
                            alt={chat.name}
                          />
                        </div>
                      </div>
                    )}

                    <div className="flex-1 !px-1 ml-3 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{chat.name}</p>
                        {newMessageCount !== 0 && (
                          <span className="text-md badge badge-error !rounded-full w-5 h-5 font-semibold">
                            {newMessageCount}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-base-content/60 truncate">
                        {}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div>
                <p className="text-center text-sm text-base-content/50 mt-4">
                  No chats available
                </p>
              </div>
            )}
          </div>
        </div>
      </>
    </div>
  );
};

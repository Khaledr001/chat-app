import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { Chat } from "../components/chatLayout/LeftSidebar";
import { useErrors } from "../hooks/custom";
import { useGetAllGroupChatsQuery } from "../redux/api/api.rtk";
import { getOrSaveToLocalStorage } from "../util/helper";
import GroupSideBar from "../components/groups/sidebar";
import { ArrowLeftCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MemberCard from "../components/chat/MemberCard";
import { getChatDetails } from "../api/chat.api";

const Group = () => {
  const user =
    useSelector((state: any) => state.auth.user) ??
    getOrSaveToLocalStorage({ key: "user", get: true });

  const [chatList, setChatList] = useState<Array<Chat> | []>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [chatDetails, setChatDetails] = useState<any | null>(null);

  const navigate = useNavigate();

  const { data, isError, error } = useGetAllGroupChatsQuery(user._id, {
    skip: !user._id,
  });

  useErrors([{ isError, error }]);

  useEffect(() => {
    if (data) setChatList(data?.groups);
  }, [data]);

  useEffect(() => {
    const fetchChat = async () => {
      const chatId = selectedChat?._id;
      if (chatId) {
        const data = await getChatDetails(chatId);
        setChatDetails(data?.data);
      }
    };
    fetchChat();
  }, [selectedChat]);

  return (
    <div className="flex min-h-screen flex-1 flex-col md:flex-row gap-6 !p-3 md:!p-4">
      {/* Side Bar */}
      <GroupSideBar
        selectedChat={selectedChat}
        setSelectedChat={setSelectedChat}
        chatList={chatList}
      />

      {/* Deails  */}
      <div className="flex-1 card bg-base-100 shadow-lg !p-6">
        <div className="flex justify-between items-center !mb-6">
          <h2 className="text-xl font-bold">Group Details</h2>
          <div className="tooltip tooltip-bottom">
            <div className="tooltip-content ">
              <div className="animate-bounce text-secondary -rotate-10 font-black">
                Go Back
              </div>
            </div>
            <button
              onClick={() => {
                navigate(-1);
              }}
              className="btn btn-ghost hover:btn-secondary btn-circle">
              <ArrowLeftCircle className="w-4 sm:w-5 md:w-6" />
            </button>
          </div>
        </div>

        {chatDetails && (
          <div>
            {/* Group Info */}
            <div className="!mb-5">
              <p className="font-semibold">
                Group Name:{" "}
                <span className="font-normal">{chatDetails?.name}</span>
              </p>
            </div>

            {/* Members List */}
            {chatDetails?.members?.length > 0 && (
              <div>
                <div className="font-semibold text-lg !mb-2">Members</div>
                <div className="!space-y-1">
                  {chatDetails?.members?.map((member: any) => {
                    console.log(
                      member._id,
                      chatDetails?.creator,
                      chatDetails?.creator === member?._id
                    );
                    const isCreator = chatDetails?.creator === member?._id;
                    const isMe = member?._id === user?._id;
                    const canRemove = user?._id === chatDetails?.creator;

                    return (
                      <div
                        key={member._id}
                        className="flex justify-between items-center hover:bg-base-200 rounded-lg !pr-3">
                        <MemberCard
                          member={member}
                          isCreator={isCreator}
                          isMe={isMe}
                          isGroupChat={chatDetails?.groupChat}
                        />
                        {canRemove && !isMe && (
                          <button className="btn btn-sm btn-error !px-2">
                            Remove
                          </button>
                        )}
                        {isMe && (
                          <button className="btn btn-sm btn-error !px-2 !ml-2">
                            Leave
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Add Member */}
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                placeholder="Enter member email"
                className="input input-bordered flex-1"
              />
              <button className="btn btn-success">Add</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Group;

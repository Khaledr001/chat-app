import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { Chat } from "../components/chatLayout/LeftSidebar";
import { useErrors } from "../hooks/custom";
import {
  useAddNewMemberToGroupMutation,
  useDeleteGroupMutation,
  useGetAllGroupChatsQuery,
  useLazyGetFriendsQuery,
  useLeaveGroupMutation,
  useRemoveMemberFromGroupMutation,
} from "../redux/api/api.rtk";
import { getOrSaveToLocalStorage } from "../util/helper";
import GroupSideBar from "../components/groups/sidebar";
import { ArrowLeftCircle, UserSearch } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MemberCard from "../components/chat/MemberCard";
import { getChatDetails } from "../api/chat.api";
import toast from "react-hot-toast";
import LeaveOrRemoveModal from "../components/modal/leave.remove.modal";

const Group = () => {
  const user =
    useSelector((state: any) => state.auth.user) ??
    getOrSaveToLocalStorage({ key: "user", get: true });

  const [chatList, setChatList] = useState<Array<Chat> | []>([]);
  const [selectedChat, setSelectedChat] = useState<any | null>(null);
  const [chatDetails, setChatDetails] = useState<any | null>(null);
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [users, setUsers] = useState<any | null>(null);
  const [refatchChatDetails, setRefatchChatDetails] = useState<boolean>(false);
  const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState<boolean>(false);
  const [modalOpen, setModalOpen] = useState<null | {
    leave?: boolean;
    isDelete?: boolean;
    handler: () => void;
  }>(null);

  const navigate = useNavigate();

  // console.log("selected chat", selectedChat?.members);

  const { data, isError, error } = useGetAllGroupChatsQuery(user._id, {
    skip: !user._id,
  });

  const [
    fetchNotFriends,
    { isLoading: isLoadingFriends, isError: friendIsError, error: friendError },
  ] = useLazyGetFriendsQuery();

  const [
    addNewMembers,
    {
      isLoading: addMemberLoading,
      isError: isAddMemberError,
      error: addMemberError,
    },
  ] = useAddNewMemberToGroupMutation();

  const [
    removeMember,
    {
      isLoading: removeMemberLoading,
      isError: isRemoveMemberError,
      error: removeMemberError,
    },
  ] = useRemoveMemberFromGroupMutation();

  const [
    leaveGroup,
    {
      isLoading: leaveGroupLoading,
      isError: isLeaveGroupError,
      error: leaveGroupError,
    },
  ] = useLeaveGroupMutation();

  const [
    deleteGroup,
    {
      isLoading: deleteGroupLoading,
      isError: isDeleteGroupError,
      error: deleteGroupError,
    },
  ] = useDeleteGroupMutation();

  useErrors([
    { isError, error },
    { isError: friendIsError, error: friendError },
    { isError: isAddMemberError, error: addMemberError },
    { isError: isRemoveMemberError, error: removeMemberError },
    { isError: isLeaveGroupError, error: leaveGroupError },
    { isError: isDeleteGroupError, error: deleteGroupError },
  ]);

  useEffect(() => {
    if (data) setChatList(data?.groups);
  }, [data]);

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (searchValue?.trim() === "") setUsers(null);
      else if (searchValue)
        fetchNotFriends(searchValue?.trim())
          .then(({ data }: any) => {
            setUsers(data);
          })
          .catch((error: any) => {
            console.error("Error fetching not friends:", error);
          });
    }, 1000);

    return () => clearTimeout(timeOutId);
  }, [searchValue]);

  useEffect(() => {
    const fetchChat = async () => {
      const chatId = selectedChat?._id;
      if (chatId) {
        const data = await getChatDetails(chatId);
        setRefatchChatDetails(false);
        setChatDetails(data?.data);
        setIsCurrentUserAdmin(user?._id === selectedChat?.creator);
      }
    };
    fetchChat();
  }, [selectedChat, refatchChatDetails]);

  const handleAddMembersToGroup = async (memberId: string) => {
    const payload = {
      chatId: selectedChat._id,
      members: [memberId],
    };

    const toastId = toast.loading("Adding member to the group...");
    try {
      const res = await addNewMembers(payload);
      if (!res?.data || !res) throw error;

      setRefatchChatDetails(true);
      toast.success("Member added succesfully!", { id: toastId });
    } catch (error) {
      toast.error("Member added failed!", { id: toastId });
    }
  };

  const handleRemoveMemberFromGroup = async (memberId: string) => {
    const payload = {
      chatId: selectedChat._id,
      member: memberId,
    };

    const toastId = toast.loading("Removing member to the group...");
    try {
      const res = await removeMember(payload);
      if (!res?.data || !res) throw error;

      setRefatchChatDetails(true);
      toast.success("Member removed succesfully!", { id: toastId });
    } catch (error) {
      toast.error("Member remove failed!", { id: toastId });
    }
  };

  const handleLeaveGroup = async () => {
    const payload = {
      chatId: selectedChat._id,
    };

    const toastId = toast.loading("Leaving the group...");
    try {
      const res = await leaveGroup(payload);
      if (!res?.data || !res) throw error;

      setRefatchChatDetails(true);
      toast.success("Leave group succesfully!", { id: toastId });
    } catch (error) {
      toast.error("Leaving from group failed!", { id: toastId });
    }
  };

  const handleDeleteGroup = async () => {
    const toastId = toast.loading("Deleting the group...");
    try {
      const res = await deleteGroup({ chatId: selectedChat?._id });
      if (!res?.data || !res) throw error;
      setRefatchChatDetails(true);
      toast.success("Leave group succesfully!", { id: toastId });
    } catch (error) {
      toast.error("Leaving from group failed!", { id: toastId });
    }
  };

  let cnt = 0;

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
              <button
                onClick={() =>
                  setModalOpen({
                    leave: false,
                    isDelete: true,
                    handler: () => handleDeleteGroup(),
                  })
                }
                className="btn btn-outline btn-error !px-2 !mt-2">
                Delete Group
              </button>
            </div>
            {/* Members List */}
            {chatDetails?.members?.length > 0 && (
              <div>
                <div className="font-semibold text-lg !mb-2">Members</div>
                <div className="!space-y-1">
                  {chatDetails?.members?.map((member: any) => {
                    const isCreator = chatDetails?.creator === member?._id;
                    const isMe = member?._id === user?._id;

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
                        {isCurrentUserAdmin && !isMe && (
                          <button
                            onClick={() =>
                              setModalOpen({
                                leave: false,
                                isDelete: false,
                                handler: () =>
                                  handleRemoveMemberFromGroup(member._id),
                              })
                            }
                            className="btn btn-sm btn-error !px-2">
                            Remove
                          </button>
                        )}
                        {isMe && (
                          <button
                            onClick={() => {
                              setModalOpen({
                                leave: true,
                                isDelete: false,
                                handler: () => handleLeaveGroup(),
                              });
                              setModalOpen(null);
                            }}
                            className="btn btn-sm btn-error !px-2 !ml-2">
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
            {isCurrentUserAdmin && (
              <div className="!mt-4  flex flex-col gap-1">
                <p>Add New Members</p>
                <div className="flex flex-col w-[60%] items-center">
                  <label className="input !mb-1 w-full focus-within:outline-none !px-2">
                    <UserSearch className="w-5 md:w-6" />
                    <input
                      type="search"
                      value={searchValue ?? ""}
                      onChange={(e) => setSearchValue(e.target.value)}
                      className=""
                      placeholder="Search"
                    />
                  </label>
                </div>
                <div className="grid md:grid-cols-2 gap-2">
                  {isLoadingFriends ? (
                    <span className="loading loading-bars loading-lg"></span>
                  ) : (
                    users?.length > 0 &&
                    users.map((user: any) => {
                      const isAlreadyMember = selectedChat?.members?.some(
                        (m: any) => m === user._id
                      );

                      if (isAlreadyMember) return null;
                      cnt++;
                      return (
                        <div
                          key={user._id}
                          className="flex items-center hover:bg-base-200 rounded-lg w-full !pr-4">
                          <MemberCard
                            member={user}
                            isGroupChat={false}
                            isMe={false}
                            isCreator={false}
                          />

                          <button
                            onClick={() => handleAddMembersToGroup(user._id)}
                            className="btn btn-sm btn-outline btn-info !px-2">
                            + Add
                          </button>
                        </div>
                      );
                    })
                  )}
                  {users?.length > 0 && cnt == 0 && (
                    <div className="text-center text-lg text-error w-full">
                      You dont have any friends those not in this group, which
                      include "{searchValue}" in his name
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Always render modal, but open only when needed */}
      {modalOpen && (
        <LeaveOrRemoveModal
          leave={modalOpen.leave}
          isDelete={modalOpen.isDelete}
          handler={() => {
            modalOpen.handler();
          }}
        />
      )}
    </div>
  );
};

export default Group;

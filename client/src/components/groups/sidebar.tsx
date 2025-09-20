import {
  UserSearch,
  X
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { serverUrl } from "../../constant/env";
import { useErrors } from "../../hooks/custom";
import {
  useCreateGroupMutation,
  useLazyGetFriendsQuery,
} from "../../redux/api/api.rtk";
import MemberCard from "../chat/MemberCard";
import type { Chat } from "../chatLayout/LeftSidebar";

const GroupSideBar = ({
  chatList,
  selectedChat,
  setSelectedChat,
}: {
  chatList: any;
  selectedChat: any;
  setSelectedChat: any;
}) => {
  const [searchValue, setSearchValue] = useState<string | null>(null);
  const [users, setUsers] = useState<any | null>(null);
  const [groupName, setGroupName] = useState("");
  const [newMembers, setNewMembers] = useState<any[]>([]);

  const handleSelectChat = (chat: Chat) => {
    setSelectedChat(chat);
  };

  const handleAddMembers = (memberId: any) => {
    setNewMembers((prev) => [...prev, memberId]);
  };

  const handleCancel = (memberId: string) => {
    setNewMembers((prev) => prev.filter((m) => m !== memberId));
  };

  const [
    fetchNotFriends,
    {
      isLoading: isNotFriendsLoading,
      isError: friendIsError,
      error: friendError,
    },
  ] = useLazyGetFriendsQuery();

  useEffect(() => {
    const timeOutId = setTimeout(() => {
      if (searchValue)
        fetchNotFriends(searchValue)
          .then(({ data }: any) => {
            console.log(searchValue);
            console.log("Users:", data);
            setUsers(data);
          })
          .catch((error: any) => {
            console.error("Error fetching not friends:", error);
          });
    }, 1000);

    return () => clearTimeout(timeOutId);
  }, [searchValue]);

  // Creat Group Chat

  const [createGroup, { isLoading, isError: groupIsError, error: groupError }] =
    useCreateGroupMutation();

  useErrors([
    { isError: friendIsError, error: friendError },
    { isError: groupIsError, error: groupError },
  ]);

  const handleCreateGroup = async () => {
    if (newMembers?.length < 2 || groupName === "") {
      toast.error("Please Select Atleast 2 Members!");
      return;
    }
    const payload = {
      name: groupName,
      members: newMembers,
    };

    const toastId = toast.loading("Creating group...");
    try {
      await createGroup(payload).unwrap(); // unwrap gives you clean success/error
      setNewMembers([]); // reset

      toast.success("Group created succesfully!", { id: toastId });
    } catch (err) {
      toast.error("Failed to create group!", { id: toastId });
    }
  };

  return (
    <div className="w-full md:w-2/5 card bg-base-100 shadow-lg !p-4 overflow-y-auto">
      <button
        onClick={() => {
          (
            document.getElementById("create_group") as HTMLDialogElement
          )?.showModal();
        }}
        className="btn btn-primary !mb-4 w-full">
        + Create Group
      </button>

      <h2 className="text-xl font-bold !mb-3">My Groups</h2>
      {chatList?.length > 0 ? (
        chatList?.map((chat: Chat) => {
          const isSelected = selectedChat?._id === chat._id;
          return (
            <div
              key={chat._id}
              onClick={() => handleSelectChat(chat)}
              className={`flex !p-1 !my-1  rounded-lg btn btn-outline btn-info h-fit transition-colors duration-150 items-center
                  ${isSelected && "bg-success/30 shadow-sm"}
                `}>
              {/* Avatars */}
              {chat.groupChat && (
                <div className="avatar-group !-space-x-9">
                  {chat.avatars.slice(0, 3).map((avatar, index) => (
                    <div className="avatar" key={index}>
                      <div className="w-8 sm:w-9 md:w-10 rounded-full ring ring-base-100 ring-offset-1">
                        <img
                          src={`${serverUrl}/${avatar}`}
                          alt={`Avatar ${index + 1}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex-1 !px-2 ml-3 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{chat.name}</p>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div>
          <p className="text-center text-sm text-base-content/50 mt-4">
            No Groups available
          </p>
        </div>
      )}

      <dialog id="create_group" className="modal modal-middle">
        <div className="modal-box !p-6">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-outline btn-error absolute right-3 top-3">
              <X className="w-5" />
            </button>
          </form>
          <h3 className="font-bold text-lg">Create Group</h3>

          {/* Submit Button */}
          <button
            disabled={isLoading}
            onClick={handleCreateGroup}
            className="btn btn-primary w-full !mt-4">
            {isLoading ? "Creating..." : "Create Group"}
          </button>

          <form className="flex flex-col gap-4 !mt-2">
            {/* Group Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text">Group Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter group name"
                onChange={(e) => setGroupName(e.target.value)}
                className="input input-bordered w-full !px-3 focus:outline-none"
                required
              />
            </div>

            <div className="flex flex-col items-center">
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
          </form>

          {users?.length > 0 &&
            users.map((user: any) => {
              const isAlreadyAdded = newMembers.some(
                (memberId) => memberId === user._id
              );

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
                  {isAlreadyAdded ? (
                    <button
                      onClick={() => handleCancel(user._id)}
                      className="btn btn-sm btn-outline btn-error !px-2">
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={() => handleAddMembers(user._id)}
                      className="btn btn-sm btn-outline btn-info !px-2">
                      + Add
                    </button>
                  )}
                </div>
              );
            })}
        </div>
      </dialog>
    </div>
  );
};

export default GroupSideBar;

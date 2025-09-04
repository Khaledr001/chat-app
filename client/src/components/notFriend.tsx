import { useEffect, useState } from "react";
import { serverUrl } from "../constant/env";
import { useSendRequestMutation } from "../redux/api/api.rtk";
import { useAsyncMutation } from "../hooks/custom";

const NotFriendCard = (user: any) => {
  const [localUserId, setLocalUserId] = useState("");

  //   const [createAPrivateChat, { data, isLoading, isError }] =
  //   useCreateAPrivateChatMutation();

  const [createAPrivateChat, isLoading] = useAsyncMutation(
    useSendRequestMutation
  );

  const handleAddFriend = async () => {
    try {
      const receiverId = user.user._id;
      const res = await createAPrivateChat(
        "Sending friend request...",
        receiverId
      );
      //   if (isError) throw new Error("Failed to add friend!");
    } catch (err: any) {
      console.error("Failed to create chat:", err);
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setLocalUserId(user._id);
  }, []);

  return (
    <div className="flex justify-between items-center shadow-xl rounded-xl !p-1">
      <div className="flex gap-5 items-center">
        <div className="avatar">
          <div className="ring-primary ring-offset-base-100 w-10 rounded-full ring-1 ring-offset-1">
            <img src={`${serverUrl}/${user.user.avatar}`} />
          </div>
        </div>

        <div className="flex flex-col ">
          <div className="">{user.user.name}</div>
          <div className="">{user.user.userName}</div>
        </div>
      </div>

      <div>
        {user?.user?.requestStatus ? (
          <button className="badge badge-outline badge-warning !px-3 !h-8">
            {"pending"}
          </button>
        ) : (
          <button
            onClick={handleAddFriend}
            className="btn btn-outline btn-secondary !px-3">
            {"+ ADD"}
          </button>
        )}
      </div>
    </div>
  );
};

export default NotFriendCard;

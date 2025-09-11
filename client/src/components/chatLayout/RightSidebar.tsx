import { useEffect, useState } from "react";
import type { IUser } from "../../shear/types/userType";
import { ArrowRightCircle, User, Users } from "lucide-react";
import MemberCard from "../chat/MemberCard";
import { useDispatch, useSelector } from "react-redux";
import { setDetails } from "../../redux/reducers/chatLayout.reducer";
import { useParams } from "react-router-dom";
import { getChatDetails } from "../../api/chat.api";
import { getOrSaveToLocalStorage } from "../../util/helper";

const RightSidebar = () => {
  const { id } = useParams();
  let chatId = id;

  const { showDetails } = useSelector((state: any) => state.chatLayout);
  const [chatDetails, setChatDetails] = useState<any | null>(null);

  const [user, setUser] = useState<IUser | null>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    const fetchChat = async () => {
      if (chatId) {
        const data = await getChatDetails(chatId);
        setChatDetails(data?.data);
      }
    };
    fetchChat();
  }, [chatId]);

  useEffect(() => {
    const usr = getOrSaveToLocalStorage({ key: "user", get: true });
    if (usr) setUser(usr);
  }, []);

  return (
    <div className="!p-1 w-auto md:w-64 lg:w-96 xl:w-100 bg-base-100 border-l-2 border-base-300 h-full">
      {/* Header */}
      <div className="flex items-center justify-end border-b border-base-300">
        <h3 className="text-xl w-[90%] font-semibold text-center !pt-3 h-[55px]">
          Chat Details
        </h3>
        <button
          onClick={() => {
            dispatch(setDetails(!showDetails));
          }}
          className="btn btn-sm btn-circle md:hidden">
          <ArrowRightCircle className="h-6 w-6" />
        </button>
      </div>

      {chatDetails && (
        <div className="!p-4 !space-y-6">
          {/* Group Information */}
          <div className="px-5 space-y-2">
            <h2 className="text-2xl font-bold">{chatDetails?.name}</h2>
            <div className="flex items-center gap-2 text-base-content/80 text-lg">
              <Users className="w-5 h-5" />
              <span>{chatDetails?.members?.length} members</span>
            </div>
            <div className="text-md">
              Created {new Date(chatDetails?.createdAt).toLocaleDateString()}
            </div>
          </div>

          {/* Members List */}
          {chatDetails?.members?.length > 0 && (
            <div>
              <div className="font-semibold text-lg !mb-2">Members</div>
              <div className="!space-y-2">
                {chatDetails?.members?.map((member: any) => (
                  <MemberCard
                    key={member?._id}
                    member={member}
                    isCreator={chatDetails?.creator === member?._id}
                    isMe={member?._id === user?._id}
                    isGroupChat={member?.isGroupChat === true}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RightSidebar;

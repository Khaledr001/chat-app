import { User } from "lucide-react";
import type { IUser } from "../../shear/types/userType";
import { serverUrl } from "../../constant/env";

interface MemberCardProps {
  member: IUser;
  isCreator?: boolean;
  isMe?: boolean;
  isGroupChat: boolean;
}

const MemberCard = ({
  member,
  isCreator,
  isMe,
  isGroupChat,
}: MemberCardProps) => {

  
  return (
    <div className="flex w-full items-center gap-3 !px-5 !py-1 hover:bg-base-200 rounded-lg">
      {member.avatar?.url ? (
        <img
          src={`${serverUrl}/${member.avatar.url}`}
          alt={member.name}
          className="w-12 h-12 rounded-full object-cover"
        />
      ) : (
        <div className="w-10 h-10 rounded-full bg-base-300 flex items-center justify-center">
          <User className="w-6 h-6" />
        </div>
      )}
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-lg">{member.name}</h3>
          {isCreator && isGroupChat && (
            <span className="text-sm bg-primary/10 text-primary !px-2 !py-0.5 rounded-full">
              Admin
            </span>
          )}
          {isMe && (
            <span className="text-sm bg-primary/10 text-primary !px-2 !py-0.5 rounded-full">
              You
            </span>
          )}
        </div>
        <p className="text-base text-base-content/80">@{member.userName}</p>
      </div>
    </div>
  );
};

export default MemberCard;

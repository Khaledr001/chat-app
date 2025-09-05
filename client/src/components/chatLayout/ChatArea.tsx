import {
  Info,
  MessageCircleMore,
  Mic,
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setChats, setDetails } from "../../redux/reducers/chatLayout.reducer";
import MessageComponent from "../chat/message";

interface ChatWindowProps {
  socket: any;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({ socket }) => {
  const [message, setMessage] = useState<string>("");

  const { showChats, showDetails } = useSelector(
    (state: any) => state.chatLayout
  );

  const dispatch = useDispatch();

  const handleInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(setDetails(!showDetails));
  };

  return (
    <div className="flex-1 flex flex-col bg-base-100 !p-1 h-full">
      {/* Chat Header */}
      <div className="!p-1 border-b border-base-300 flex items-center justify-between h-[55px]">
        <button
          onClick={() => dispatch(setChats(!showChats))}
          className="btn btn-ghost btn-circle btn-sm">
          <MessageCircleMore className="h-5 w-5" />
        </button>

        <div className="flex items-center gap-2 ">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/idiotsandwich@192.webp" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold">United Family 👹</h3>
            <p className="text-xs text-base-content/50">
              Rashford is typing...
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-ghost btn-circle btn-sm"
            onClick={handleInfo}>
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="text-center mb-6">
          <span className="badge badge-neutral">Today</span>
        </div>

        {/* Messages */}
        <MessageComponent messages={message} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-base-300">
        <div className="flex items-center gap-2">
          <button className="btn btn-ghost btn-circle btn-sm">
            <Paperclip className="h-5 w-5" />
          </button>
          <input
            type="text"
            placeholder="Type a message..."
            className="input input-bordered rounded-full !px-4 input-info focus:outline-none focus:ring-0 focus:border-info/60 flex-1"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button className="btn btn-ghost btn-circle btn-sm">
            <Smile className="h-5 w-5" />
          </button>
          <button className="btn btn-ghost btn-circle btn-sm">
            <Mic className="h-5 w-5" />
          </button>
          <button className="btn btn-primary btn-circle btn-sm">
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

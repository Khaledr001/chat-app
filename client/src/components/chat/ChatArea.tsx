import {
  Info,
  MessageCircleMore,
  Mic,
  Paperclip,
  Send,
  Smile,
} from "lucide-react";
import { useState } from "react";
import { useChatLayoutContext } from "../../contexts/ChatLayoutContext";

export const ChatWindow = () => {
  const [message, setMessage] = useState<string>("");

  const { showDetails, setShowDetails, showChats, setShowChats } =
    useChatLayoutContext();

  const handleInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    setShowDetails(!showDetails);
  };

  return (
    <div className="flex-1 flex flex-col bg-base-100 !p-1 h-full">
      {/* Chat Header */}
      <div className="!p-1 border-b border-base-300 flex items-center justify-between h-[55px]">
        <button
          onClick={() => setShowChats(!showChats)}
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
        <div className="space-y-4">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-base-300 rounded-full flex items-center justify-center text-sm">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">Harry Maguire</span>
                <span className="text-xs text-base-content/50">08:34 AM</span>
              </div>
              <div className="bg-base-200 rounded-lg p-3 max-w-md">
                <p className="text-sm">
                  Hey lads, tough game yesterday. Let's talk about what went
                  wrong and how we can improve 😊
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-8 h-8 bg-base-300 rounded-full flex items-center justify-center text-sm">
              👤
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm">Bruno Fernandes</span>
                <span className="text-xs text-base-content/50">08:34 AM</span>
              </div>
              <div className="bg-base-200 rounded-lg p-3 max-w-md">
                <p className="text-sm">
                  Agreed, Harry 👍. We had some good moments, but we need to be
                  more clinical in front of the goal 😊
                </p>
              </div>
            </div>
          </div>

          {/* System Message */}
          <div className="flex justify-center my-6">
            <div className="bg-info/20 text-info-content px-4 py-3 rounded-lg max-w-lg text-center">
              <p className="text-sm">
                You need to control the midfield and exploit their defensive
                weaknesses. Focus on quick passes, maintain structure,
                creativity. Marcus and Jadon, stretch their defense wide. Use
                your pace and take on their full backs.
              </p>
            </div>
          </div>
        </div>
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

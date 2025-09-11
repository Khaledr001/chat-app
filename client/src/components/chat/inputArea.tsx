import { Send } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { MESSAGE_EVENTS } from "../../constant/events";
import { getSocket } from "../../socket/socket";
import FileMenu from "./fileMenu";

const ChatInput = ({
  message,
  setMessage,
  handleSendMessage,
  members,
  chatId,
  IamTyping,
  setIamTyping,
}: {
  message: any;
  setMessage: any;
  handleSendMessage: any;
  members: Array<string>;
  chatId: string;
  IamTyping: boolean;
  setIamTyping: any;
}) => {
  const socket = getSocket();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const typingTimeout = useRef<number | null>(null);

  const handleMessageChange = (e: any) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket?.emit(MESSAGE_EVENTS.startTypeing, {
        chatId,
        members,
      });
      setIamTyping(true);
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket?.emit(MESSAGE_EVENTS.stopTypeing, {
        chatId,
        members,
      });

      setIamTyping(false);
    }, 2000);
  };

  // Adjust height as user types
  useEffect(() => {
    const ta = textareaRef.current;
    if (!ta) return;

    ta.style.height = "auto"; // reset height
    ta.style.height = Math.min(ta.scrollHeight, 60) + "px"; // max 150px
  }, [message]);

  return (
    <form
      onSubmit={(e) => handleSendMessage(e)}
      className="flex items-center gap-2 p-4 border-t border-base-300">
      {/* <button type="button" className="btn btn-ghost btn-circle btn-sm">
        <Paperclip className="h-5 w-5" />
      </button> */}

      <FileMenu />

      <textarea
        ref={textareaRef}
        placeholder="Type a message..."
        className="input input-bordered rounded-2xl !px-4 !py-1  input-info focus:outline-none focus:ring-0 focus:border-info/60 flex-1 resize-none overflow-auto max-h-[60px] min-h-9 leading-[1.5] "
        value={message}
        onChange={(e) => handleMessageChange(e)}
        rows={1}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage(e);
          }
        }}
      />
      {/* <button type="button" className="btn btn-ghost btn-circle btn-sm">
        <Smile className="h-5 w-5" />
      </button>
      <button type="button" className="btn btn-ghost btn-circle btn-sm">
        <Mic className="h-5 w-5" />
      </button> */}
      <button type="submit" className="btn btn-primary btn-circle btn-sm">
        <Send className="h-5 w-5" />
      </button>
    </form>
  );
};

export default ChatInput;

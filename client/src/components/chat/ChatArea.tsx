import { format } from "date-fns";
import { useSocket } from "../../contexts/SocketContext";
import { useChat } from "../../contexts/ChatContext";
import {
  PaperAirplaneIcon,
  EllipsisHorizontalIcon,
  PhoneIcon,
  VideoCameraIcon,
  FaceSmileIcon,
  PhotoIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useRef, useState } from "react";

interface Message {
  id?: string;
  content: string;
  from: string;
  to: string;
  timestamp: Date;
  read?: boolean;
}

export const ChatArea = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);
  const { socket } = useSocket();
  const { selectedUser } = useChat();

  useEffect(() => {
    if (socket && selectedUser) {
      // Load conversation history
      socket.emit(
        "getConversation",
        { otherUserId: selectedUser.id },
        (response: any) => {
          if (response.status === "ok") {
            setMessages(response.messages);
          }
        }
      );

      // Listen for new messages
      socket.on("privateMessage", (message: Message) => {
        if (
          message.from === selectedUser.id ||
          message.to === selectedUser.id
        ) {
          setMessages((prev) => [...prev, message]);
          // Mark message as read if we're the receiver
          if (message.to === selectedUser.id) {
            socket.emit("messageRead", {
              messageId: message.id,
              userId: message.from,
            });
          }
        }
      });

      // Listen for typing status
      socket.on("userTyping", ({ userId, isTyping: typing }) => {
        if (userId === selectedUser.id) {
          setIsTyping(typing);
        }
      });

      // Listen for read receipts
      socket.on("messageRead", ({ messageId }) => {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, isRead: true } : msg
          )
        );
      });
    }

    return () => {
      if (socket) {
        socket.off("privateMessage");
        socket.off("userTyping");
        socket.off("messageRead");
      }
    };
  }, [socket, selectedUser]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket || !selectedUser) return;

    socket.emit(
      "privateMessage",
      {
        to: selectedUser.id,
        content: newMessage,
      },
      (response: any) => {
        if (response.status === "ok") {
          // Message was saved successfully
          setNewMessage("");
        } else {
          // Handle error
          console.error("Failed to send message:", response.message);
        }
      }
    );
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewMessage(e.target.value);

    if (!socket || !selectedUser) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing status
    socket.emit("typing", { to: selectedUser.id, isTyping: true });

    // Set timeout to stop typing status
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", { to: selectedUser.id, isTyping: false });
    }, 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900">
      {/* Chat Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-700 bg-gray-800/90 backdrop-blur supports-backdrop-blur:bg-gray-800/90 shadow-lg">
        <div className="flex items-center">
          <div className="relative">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 p-0.5">
              <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center text-white text-lg font-medium">
                {selectedUser ? selectedUser.name[0].toUpperCase() : "?"}
              </div>
            </div>
            {selectedUser && (
              <div className="absolute bottom-0.5 right-0.5 h-3.5 w-3.5 rounded-full bg-green-500 border-[3px] border-gray-800 shadow-lg"></div>
            )}
          </div>
          <div className="ml-4">
            <p className="font-bold text-white text-lg">
              {selectedUser ? selectedUser.name : "Select a user"}
            </p>
            {selectedUser && (
              <p className="text-sm text-gray-400">
                {isTyping ? (
                  <span className="text-blue-400">Typing...</span>
                ) : (
                  <span className="text-green-500 font-medium">Active now</span>
                )}
              </p>
            )}
          </div>
        </div>
        <div className="flex space-x-2">
          <button className="p-2.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/70 transition-all duration-200">
            <PhoneIcon className="h-5 w-5" />
          </button>
          <button className="p-2.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/70 transition-all duration-200">
            <VideoCameraIcon className="h-5 w-5" />
          </button>
          <button className="p-2.5 text-gray-400 hover:text-white rounded-full hover:bg-gray-700/70 transition-all duration-200">
            <EllipsisHorizontalIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 px-6 py-5 space-y-4 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent">
        {messages.map((message, index) => (
          <div
            key={message.id}
            className={`flex items-end space-x-2.5 ${
              message.from === socket?.id ? "justify-end" : "justify-start"
            }`}>
            {message.from !== "currentUserId" && (
              <div className="flex-shrink-0 w-9 h-9 rounded-full bg-gradient-to-r from-pink-500 via-purple-500 to-violet-500 p-0.5">
                <div className="w-full h-full rounded-full overflow-hidden bg-gray-800 flex items-center justify-center text-white font-medium">
                  J
                </div>
              </div>
            )}
            <div
              className={`group relative max-w-[70%] px-5 py-3 rounded-2xl shadow-lg ${
                message.from === "currentUserId"
                  ? "bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white rounded-br-sm"
                  : "bg-gray-700/90 text-gray-100 rounded-bl-sm hover:bg-gray-700/100 transition-colors"
              }`}>
              <p className="break-words text-[15px] leading-relaxed">
                {message.content}
              </p>
              <span className="absolute -bottom-5 text-[11px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                {format(new Date(message.timestamp), "h:mm a")}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="px-6 py-4 bg-gray-800/90 backdrop-blur supports-backdrop-blur:bg-gray-800/90 border-t border-gray-700 shadow-lg">
        <div className="flex items-center space-x-3">
          <button className="p-2.5 text-gray-400 hover:text-gray-300 transition-all duration-200 rounded-full hover:bg-gray-700/70">
            <PhotoIcon className="h-6 w-6" />
          </button>
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder={
                selectedUser
                  ? "Type a message..."
                  : "Select a user to start chatting"
              }
              value={newMessage}
              onChange={handleTyping}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              disabled={!selectedUser}
              className="w-full px-5 py-3 bg-gray-700/70 text-white rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-gray-700/90 pr-12 transition-all duration-200 placeholder:text-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <button className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-gray-300 transition-all duration-200 hover:bg-gray-600/30 rounded-full">
              <FaceSmileIcon className="h-6 w-6" />
            </button>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!newMessage.trim()}
            className="p-2.5 text-blue-500 hover:text-blue-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700/50 rounded-full">
            <PaperAirplaneIcon className="h-6 w-6 rotate-90" />
          </button>
        </div>
      </div>
    </div>
  );
};

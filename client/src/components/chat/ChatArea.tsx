import { useState, useRef, useEffect } from "react";
import { format } from "date-fns";
import { useSocket } from "../../contexts/SocketContext";
import { PaperAirplaneIcon } from "@heroicons/react/24/solid";

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { socket } = useSocket();

  useEffect(() => {
    if (socket) {
      socket.on("privateMessage", (message: Message) => {
        setMessages((prev) => [...prev, message]);
      });
    }
  }, [socket]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = () => {
    if (!newMessage.trim() || !socket) return;

    const message = {
      content: newMessage,
      from: "currentUserId", // Replace with actual user ID
      to: "recipientId", // Replace with actual recipient ID
      timestamp: new Date(),
    };

    socket.emit("privateMessage", message);
    setNewMessage("");
  };

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="flex items-center p-4 border-b border-gray-700 bg-gray-800">
        <div className="w-10 h-10 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium">
          JD
        </div>
        <div className="ml-3">
          <p className="font-bold text-white">John Doe</p>
          <p className="text-sm text-gray-400">Online</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.from === "currentUserId" ? "justify-end" : "justify-start"
            }`}>
            {message.from !== "currentUserId" && (
              <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center text-white font-medium mr-2">
                J
              </div>
            )}
            <div
              className={`max-w-[70%] p-3 rounded-lg ${
                message.from === "currentUserId"
                  ? "bg-blue-500 text-white"
                  : "bg-gray-700 text-gray-100"
              }`}>
              <p>{message.content}</p>
              <p className="text-xs text-gray-300 text-right">
                {format(new Date(message.timestamp), "HH:mm")}
              </p>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className="p-4 bg-gray-800 border-t border-gray-700 flex space-x-2">
        <input
          type="text"
          placeholder="Type a message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-1 bg-gray-700 text-white rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={handleSendMessage}
          disabled={!newMessage.trim()}
          className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed">
          <PaperAirplaneIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

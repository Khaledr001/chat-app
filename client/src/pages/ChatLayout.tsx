import { LeftSidebar } from "../components/chat/LeftSidebar";
import { useState } from "react";
import RightSidebar from "../components/chat/RightSidebar";
import { ChatWindow } from "../components/chat/ChatArea";

export const ChatLayout: React.FC = () => {
  const [showDetails, setShowDetails] = useState<boolean>(true);

  return (
    <div className="flex h-screen bg-base-200">
      {/* Left Sidebar - Chat List */}

      <LeftSidebar />

      {/* Middle - Chat Window */}
      <ChatWindow />

      {/* Right Sidebar - Details */}
      {showDetails && <RightSidebar />}
    </div>
  );
};

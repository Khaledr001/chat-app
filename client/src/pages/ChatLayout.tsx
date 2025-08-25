import { Sidebar } from "../components/chat/Sidebar";
import { ChatArea } from "../components/chat/ChatArea";

export const ChatLayout = () => {
  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-[320px_1fr]">
      <div className="bg-gray-800/95 border-r border-gray-700/80 shadow-xl">
        <Sidebar />
      </div>
      <div className="bg-gray-900/95">
        <ChatArea />
      </div>
    </div>
  );
};

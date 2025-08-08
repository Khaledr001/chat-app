import { Sidebar } from "./Sidebar";
import { ChatArea } from "./ChatArea";

export const ChatLayout = () => {
  return (
    <div className="grid h-screen grid-cols-1 md:grid-cols-[300px_1fr]">
      <div className="bg-gray-800 border-r border-gray-700">
        <Sidebar />
      </div>
      <div>
        <ChatArea />
      </div>
    </div>
  );
};

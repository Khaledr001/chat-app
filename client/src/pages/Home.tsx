import { MessageCircle } from "lucide-react";
import AppLayout from "./Layout/AppLayout";

const Home = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full text-center p-6">
      {/* Icon */}
      <div className="bg-primary/10 p-6 rounded-full mb-4">
        <MessageCircle className="h-12 w-12 text-primary" />
      </div>

      {/* Text */}
      <h2 className="text-2xl font-semibold text-base-content mb-2">
        Welcome to Chat
      </h2>
      <p className="text-base-content/60 max-w-md">
        Select a chat from the sidebar to start messaging. Your conversations
        will appear here.
      </p>
    </div>
  );
};

export default AppLayout()(Home);

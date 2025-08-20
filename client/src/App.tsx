import { Routes, Route } from "react-router-dom";
import { SocketProvider } from "./contexts/SocketContext";
import { ChatProvider } from "./contexts/ChatContext";
import { ChatLayout } from "./components/chat/ChatLayout";

function App() {
  return (
    <SocketProvider>
      <ChatProvider>
        <Routes>
          <Route path="/" element={<ChatLayout />} />
        </Routes>
      </ChatProvider>
    </SocketProvider>
  );
}

export default App;

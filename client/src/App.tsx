import { Routes, Route } from "react-router-dom";
import { SocketProvider } from "./contexts/SocketContext";
import { ChatLayout } from "./components/chat/ChatLayout";

function App() {
  return (
    <SocketProvider>
      <Routes>
        <Route path="/" element={<ChatLayout />} />
      </Routes>
    </SocketProvider>
  );
}

export default App;

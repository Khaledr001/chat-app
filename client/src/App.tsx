import { SocketProvider } from "./contexts/SocketContext";
import { ChatProvider } from "./contexts/ChatContext";
import { AuthProvider } from "./contexts/AuthContext";
import AppRoutes from "./routes/AppRoute";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <AppRoutes />
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

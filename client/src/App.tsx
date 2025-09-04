import { ChatProvider } from "./contexts/ChatContext";
import AppRoutes from "./routes/AppRoute";

function App() {
  return (
    <ChatProvider>
      <AppRoutes />
    </ChatProvider>
  );
}

export default App;

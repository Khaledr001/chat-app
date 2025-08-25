import { Routes, Route } from "react-router-dom";
import { SocketProvider } from "./contexts/SocketContext";
import { ChatProvider } from "./contexts/ChatContext";
import { AuthProvider } from "./contexts/AuthContext";
import { ChatLayout } from "./pages/ChatLayout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";
import { PrivateRoute } from "./routes/PrivateRoute";

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <ChatProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <ChatLayout />
                </PrivateRoute>
              }
            />
          </Routes>
        </ChatProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;

import { createContext, useContext, useState } from "react";

interface ChatContextType {
  selectedUser: {
    id: string;
    name: string;
  } | null;
  setSelectedUser: (user: { id: string; name: string } | null) => void;
}

const ChatContext = createContext<ChatContextType>({
  selectedUser: null,
  setSelectedUser: () => {},
});

export const useChat = () => useContext(ChatContext);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

  return (
    <ChatContext.Provider value={{ selectedUser, setSelectedUser }}>
      {children}
    </ChatContext.Provider>
  );
};

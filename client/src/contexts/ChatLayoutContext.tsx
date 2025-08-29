import { createContext, useContext, useEffect, useState } from "react";
import type { IUser } from "../shear/types/userType";

interface IChatLayoutContext {
  showDetails: boolean;
  setShowDetails: (show: boolean) => void;

  showChats: boolean;
  setShowChats: (show: boolean) => void;

  selectedChat: IUser | null;
  setSelectedChat: (selectedChat: IUser | null) => void;
}

export const ChatLayoutContext = createContext<IChatLayoutContext | null>(null);

export const useChatLayoutContext = () => {
  const context = useContext(ChatLayoutContext);
  if (!context) {
    throw new Error(
      "useChatLayoutContext must be used within a ChatLayoutProvider"
    );
  }
  return context;
};

export const ChatLayoutProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [showDetails, setShowDetails] = useState(true);
  const [selectedChat, setSelectedChat] = useState<IUser | null>(null);
  const [showChats, setShowChats] = useState<boolean>(true);

  return (
    <ChatLayoutContext.Provider
      value={{
        showDetails,
        selectedChat,
        showChats,
        setShowChats,
        setSelectedChat,
        setShowDetails,
      }}>
      {children}
    </ChatLayoutContext.Provider>
  );
};

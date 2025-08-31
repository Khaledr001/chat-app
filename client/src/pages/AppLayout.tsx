import React from "react";
import Title from "../shear/Title";
import ChatLayout from "./ChatLayout";
import { ChatLayoutProvider } from "../contexts/ChatLayoutContext";

const AppLayout = () => {
  return (
    <>
      <Title
        title="Chat App"
        description="This is the Chat App with AI feature"
      />
      <ChatLayoutProvider>
        <ChatLayout />
      </ChatLayoutProvider>
    </>
  );
};

export default AppLayout;

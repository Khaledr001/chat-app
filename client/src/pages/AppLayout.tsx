import NavBar from "../components/navbar";
import Title from "../shear/Title";
import ChatLayout from "./ChatLayout";

const AppLayout = () => {
  return (
    <>
      <Title
        title="Chat App"
        description="This is the Chat App with AI feature"
      />
      <div className="h-screen flex flex-col">
        <NavBar />
        <ChatLayout />
      </div>
    </>
  );
};

export default AppLayout;

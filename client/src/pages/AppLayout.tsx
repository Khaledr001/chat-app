import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { LeftSidebar } from "../components/chatLayout/LeftSidebar";
import NavBar from "../components/navbar";
import Title from "../shear/Title";
import { getSocket } from "../socket/socket";

const AppLayout = () => (WrapedComponent: any) => {
  return (props: any) => {
    const socket = getSocket();

    console.log(socket);

    const { showChats } = useSelector((state: any) => state.chatLayout);
    const [isMobile, setIsMobile] = useState(false);

    // Check screen size
    useEffect(() => {
      const checkScreenSize = () => {
        setIsMobile(window.innerWidth < 768); // md breakpoint
      };

      checkScreenSize();

      window.addEventListener("resize", checkScreenSize);
      return () => window.removeEventListener("resize", checkScreenSize);
    }, [isMobile]);

    return (
      <>
        <Title
          title="Chat App"
          description="This is the Chat App with AI feature"
        />
        <div className="h-screen flex flex-col">
          <NavBar />

          <div className="flex flex-grow">
            {/* Left Sidebar - Chat List */}
            <AnimatePresence>
              {showChats && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={
                    isMobile
                      ? { opacity: 1, width: "100%" }
                      : { opacity: 1, width: "auto" }
                  }
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="overflow-hidden flex-shrink-0 w-full ">
                  <LeftSidebar />
                </motion.div>
              )}
            </AnimatePresence>

            <WrapedComponent {...props} />
          </div>
        </div>
      </>
    );
  };
};

export default AppLayout;

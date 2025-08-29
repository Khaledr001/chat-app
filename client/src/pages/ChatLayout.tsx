import { LeftSidebar } from "../components/chat/LeftSidebar";
import RightSidebar from "../components/chat/RightSidebar";
import { ChatWindow } from "../components/chat/ChatArea";
import { useChatLayoutContext } from "../contexts/ChatLayoutContext";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const ChatLayout: React.FC = () => {
  const { showDetails, setShowDetails, showChats, setShowChats } = useChatLayoutContext();

  const [isMobile, setIsMobile] = useState(false);

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();
    
    if (isMobile) {
      setShowChats(false);
      setShowDetails(false);
    }
    else {
      setShowChats(true);
      setShowDetails(true);
    }

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isMobile]);


  return (
    <div className="flex grow h-screen relative">
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

      {/* Middle - Chat Window */}
      {isMobile && (showDetails || showChats) ? null : (
        <div className="flex-grow min-w-0">
          <ChatWindow />
        </div>
      )}

      {/* Right Sidebar - Details */}
      <AnimatePresence>
        {showDetails && (
          <motion.div
            initial={
              isMobile ? { opacity: 0, x: "100%" } : { opacity: 0, width: 0 }
            }
            animate={
              isMobile ? { opacity: 1, x: 0 } : { width: "auto", opacity: 1 }
            }
            exit={
              isMobile ? { opacity: 0, x: "100%" } : { opacity: 0, width: 0 }
            }
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden flex-shrink-0 w-full">
            <RightSidebar />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ChatLayout;

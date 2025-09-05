import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatWindow } from "../components/chatLayout/ChatArea";
import RightSidebar from "../components/chatLayout/RightSidebar";
import { setChats, setDetails } from "../redux/reducers/chatLayout.reducer";
import AppLayout from "./AppLayout";

interface ChatLayoutProps {
  socket: any;
}

const Chat: React.FC<ChatLayoutProps> = ({ socket }) => {
  // Chat Layout Settings
  const [isMobile, setIsMobile] = useState(false);
  const { showDetails, showChats } = useSelector(
    (state: any) => state.chatLayout
  );
  const dispatch = useDispatch();

  // Check screen size
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768); // md breakpoint
    };

    checkScreenSize();

    if (isMobile) {
      dispatch(setDetails(false));
      dispatch(setChats(false));
    } else {
      dispatch(setDetails(true));
      dispatch(setChats(true));
    }

    window.addEventListener("resize", checkScreenSize);
    return () => window.removeEventListener("resize", checkScreenSize);
  }, [isMobile]);

  return (
    <div className="flex grow">
      {/* Middle - Chat Window */}
      {isMobile && (showDetails || showChats) ? null : (
        <div className="flex-grow min-w-0">
          <ChatWindow socket={socket} />
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

export default AppLayout()(Chat);

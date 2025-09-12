import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChatWindow } from "../components/chatLayout/ChatArea";
import RightSidebar from "../components/chatLayout/RightSidebar";
import { setChats, setDetails } from "../redux/reducers/chatLayout.reducer";
import AppLayout from "./Layout/AppLayout";
import { useParams } from "react-router-dom";

const Chat: React.FC = () => {
  // Chat Layout Settings
  const { showDetails, showChats } = useSelector(
    (state: any) => state.chatLayout
  );
  const { isMobile } = useSelector((state: any) => state.misc);

  const dispatch = useDispatch();

  const { id: chatId } = useParams();

  // Check screen size
  useEffect(() => {
    if (isMobile) {
      dispatch(setDetails(false));
      dispatch(setChats(false));
    } else {
      dispatch(setDetails(true));
      dispatch(setChats(true));
    }
  }, [isMobile]);

  return (
    <div className="flex grow">
      {/* Middle - Chat Window */}
      {isMobile && (showDetails || showChats) ? null : (
        <div className="flex-grow min-w-0">
          <ChatWindow chatId={chatId} />
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

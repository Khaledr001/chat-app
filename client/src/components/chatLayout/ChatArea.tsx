import { Info, MessageCircleMore } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { MESSAGE_EVENTS } from "../../constant/events";
import { useErrors, useSocketEvents } from "../../hooks/custom";
import { useInfiniteScrollMessagesRTK } from "../../hooks/infiniteSchrolToTop";
import {
  useGetAllMessageQuery,
  useGetChatDetailsQuery,
} from "../../redux/api/api.rtk";
import { setChats, setDetails } from "../../redux/reducers/chatLayout.reducer";
import type { IMessage } from "../../shear/types/others.types";
import { getSocket } from "../../socket/socket";
import { sortMessagesByDate } from "../../util/helper";
import ChatInput from "../chat/inputArea";
import MessageComponent from "../chat/message";
import ChatLoader from "../loader/chatLoader";
import { serverUrl } from "../../constant/env";

export const ChatWindow = ({ chatId }: { chatId?: string }) => {
  if (!chatId) {
    const { id } = useParams();
    chatId = id;
  }
  const socket = getSocket();

  const [userTyping, setUserTyping] = useState(false);
  const [IamTyping, setIamTyping] = useState(false);

  // const containerRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messageList, setMessageList] = useState<IMessage[] | []>([]);
  const [message, setMessage] = useState<string>("");
  const [page, setPage] = useState<number>(1);

  const { selectedChatDetails } = useSelector((state: any) => state.chat);
  const { showChats, showDetails } = useSelector(
    (state: any) => state.chatLayout
  );

  const dispatch = useDispatch();

  const chatDetails = useGetChatDetailsQuery({ chatId }, { skip: !chatId });

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    // { isError: oldMessagesChank.isError, error: oldMessagesChank.error },
  ];

  // hooks for call message
  const oldMessagesChank = useGetAllMessageQuery(
    { chatId, page },
    { skip: !chatId, refetchOnMountOrArgChange: true }
  );

  // Use the infinite scroll hook
  const { messages: oldMessages, containerRef } = useInfiniteScrollMessagesRTK({
    chatId,
    page,
    setPage,
    messagesQuery: oldMessagesChank,
  });

  useErrors(errors);
  const handleSendMessage = (e: any) => {
    e.preventDefault();

    if (!message.trim() || !socket) return;

    // Emitting the message to the server
    socket.emit(MESSAGE_EVENTS.newMessage, {
      chat: chatId,
      members: chatDetails?.data?.data?.members,
      content: message,
    });
    setMessage("");
  };

  const newMessageListner = useCallback(
    (data: any) => {
      // Only add message if it belongs to the current chat
      if (data.realTimeMessage?.chat === chatId) {
        setMessageList((prev) => [...prev, data.realTimeMessage]);
      }
    },
    [chatId]
  );
  const startTypeingListner = useCallback(
    (data: any) => {
      if (data) {
        if (data.chatId !== chatId) return;

        setUserTyping(true);
      }
    },
    [chatId]
  );

  const stopTypeingListner = useCallback(
    (data: any) => {
      if (data) {
        if (data.chatId !== chatId) return;

        setUserTyping(false);
      }
    },
    [chatId]
  );

  const eventHandler = {
    [MESSAGE_EVENTS.received]: newMessageListner,
    [MESSAGE_EVENTS.startTypeing]: startTypeingListner,
    [MESSAGE_EVENTS.stopTypeing]: stopTypeingListner,
  };
  useSocketEvents(socket, eventHandler);

  const handleInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(setDetails(!showDetails));
  };

  let allMessages = [...oldMessages, ...messageList];
  allMessages = sortMessagesByDate(allMessages);
  
  // Scroll to bottom on chat change or initial load
  useEffect(() => {
    if (messagesEndRef.current)
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList, oldMessagesChank.data]);


  // Reset state when chatId changes
  useEffect(() => {
    setMessageList([]);
    setMessage("");
  }, [chatId]);

  if (chatDetails.isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <ChatLoader />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-base-100 !p-1 h-full">
      {/* Chat Header */}
      <div className="!p-1 border-b border-base-300 flex items-center justify-between h-[55px]">
        <button
          onClick={() => dispatch(setChats(!showChats))}
          className="btn btn-ghost btn-circle btn-sm">
          <MessageCircleMore className="h-5 w-5" />
        </button>

        {selectedChatDetails && (
          <div className="flex items-center gap-2 ">
            {selectedChatDetails?.groupChat ? (
              <div className="avatar-group !-space-x-9">
                {selectedChatDetails?.avatars.length > 0 &&
                  selectedChatDetails?.avatars
                    .slice(0, 3)
                    .map((avatar: string, index: number) => (
                      <div className="avatar" key={index}>
                        <div className="w-11 rounded-full ring ring-base-100 ring-offset-1">
                          <img
                            src={`${serverUrl}/${avatar}`}
                            alt={`Avatar ${index + 1}`}
                          />
                        </div>
                      </div>
                    ))}
              </div>
            ) : (
              <div className="avatar">
                <div className="w-11 rounded-full ring ring-base-100 ring-offset-1">
                  <img
                    src={`${serverUrl}/${selectedChatDetails?.avatars[0]}`}
                    alt={selectedChatDetails?.name}
                  />
                </div>
              </div>
            )}
            <div>
              <h3 className="font-semibold">{selectedChatDetails?.name}</h3>
              {userTyping && !IamTyping && (
                <div className="flex text-xs text-base-content/50 justify-center items-center w-full">
                  {"typing "}
                  <span className="loading loading-dots loading-xs !mx-1"></span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            className="btn btn-ghost btn-circle btn-sm"
            onClick={handleInfo}>
            <Info className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Messages Area */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto p-4 max-h-[calc(94vh-115px)]">
        <div className="text-center mb-6">
          <span className="badge badge-neutral">Today</span>
        </div>

        {/* Messages */}
        {allMessages?.length > 0 &&
          allMessages?.map((msg: any, index) => (
            <MessageComponent
              key={`${msg._id || index}-${chatId}`}
              message={msg}
            />
          ))}

        {/* Invisible div for auto-scrolling to bottom */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-base-300">
        {chatId && (
          <ChatInput
            message={message}
            setMessage={setMessage}
            handleSendMessage={handleSendMessage}
            members={chatDetails?.data?.data?.members}
            chatId={chatId}
            IamTyping={IamTyping}
            setIamTyping={setIamTyping}
          />
        )}
      </div>
    </div>
  );
};

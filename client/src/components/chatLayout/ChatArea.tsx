import { Info, MessageCircleMore } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { ATTACHMENT_EVENTS, MESSAGE_EVENTS } from "../../constant/events";
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

export const ChatWindow = ({ chatId }: { chatId?: string }) => {
  if (!chatId) {
    const { id } = useParams();
    chatId = id;
  }
  const socket = getSocket();

  // const containerRef = useRef(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const [messageList, setMessageList] = useState<IMessage[] | []>([]);
  const [message, setMessage] = useState<string>("");
  const [page, setPage] = useState<number>(1);

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

  // const [oldMessagesChank, setOldMessagesChank] = useState<any>({
  //   messages: [],
  //   totalPages: 0,
  // });
  // // Fetch with Axios whenever chatId or page changes
  // useEffect(() => {
  //   if (!chatId) return;

  //   getAllMessageByChatId(chatId, page)
  //     .then((res) => {
  //       setOldMessagesChank((prev) => ({
  //         totalPages: res?.data?.totalPages,
  //         // 👇 Merge previous and new messages
  //         messages:
  //           page === 1
  //             ? res?.data?.messages
  //             : [...prev.messages, ...res?.data?.messages],
  //       }));
  //     })
  //     .catch((err) => {
  //       console.error("Axios fetch error", err);
  //     });
  // }, [chatId, page]);

  // const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
  //   containerRef,
  //   oldMessagesChank?.totalPages,
  //   page,
  //   setPage,
  //   oldMessagesChank?.messages
  // );

  // Use the custom infinite scroll hook
  // const {
  //   messages: oldMessages,
  //   isLoading: messagesLoading,
  //   error: messagesError,
  //   hasMore,
  //   containerRef,
  //   page,
  //   resetMessages,
  // } = useInfiniteScrollMessages({
  //   chatId,
  //   fetchMessages: getAllMessageByChatId,
  // });

  // Use the infinite scroll hook
  const {
    messages: oldMessages,
    containerRef,
    isLoading,
    error,
    hasMore,
  } = useInfiniteScrollMessagesRTK({
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

  const newMessageHandler = useCallback(
    (data: any) => {
      // Only add message if it belongs to the current chat
      if (data.realTimeMessage?.chat === chatId) {
        setMessageList((prev) => [...prev, data.realTimeMessage]);
      }
    },
    [chatId]
  );
  // const newAttachmentHandler = useCallback((data: any) => {
  //   if (data) {
  //     setMessage((prev) => [...prev, data.message]);
  //   }
  // });

  const eventHandler = {
    [MESSAGE_EVENTS.received]: newMessageHandler,
    // [ATTACHMENT_EVENTS.newAttachment]: newAttachmentHandler,
  };
  useSocketEvents(socket, eventHandler);

  const handleInfo = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(setDetails(!showDetails));
  };
  // Reset state when chatId changes
  useEffect(() => {
    // Clear real-time messages when switching chats
    setMessageList([]);
    // Reset page to 1 for new chat
    // setPage(1);
    // Clear input message
    setMessage("");

    // setOldMessages([]);
  }, [chatId]);
  let allMessages = [...oldMessages, ...messageList];
  allMessages = sortMessagesByDate(allMessages);
  console.log("allmessage length", allMessages.length);

  // Scroll to bottom when new messages are added (not on infinite scroll)
  const [shouldScrollToBottom, setShouldScrollToBottom] = useState(true);
  const [isUserScrolling, setIsUserScrolling] = useState(false);

  // Track if user is scrolling
  const handleScroll = useCallback(() => {
    if (!containerRef.current) return;

    const container = containerRef.current as HTMLDivElement;
    const isAtBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight <
      100;

    setShouldScrollToBottom(isAtBottom);
    setIsUserScrolling(true);

    // Reset scrolling flag after a delay
    setTimeout(() => setIsUserScrolling(false), 150);
  }, []);

  // Auto-scroll to bottom for new messages
  useEffect(() => {
    // Scroll to bottom when:
    // 1. New message is sent/received and user is at bottom
    // 2. Chat changes
    // 3. Initial load
    if (shouldScrollToBottom && !isUserScrolling && messageList.length > 0) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  }, [messageList.length, shouldScrollToBottom, isUserScrolling]);

  // Scroll to bottom on chat change or initial load
  useEffect(() => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    }, 100);
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

        <div className="flex items-center gap-2 ">
          <div className="avatar">
            <div className="w-10 rounded-full">
              <img src="https://img.daisyui.com/images/profile/demo/idiotsandwich@192.webp" />
            </div>
          </div>
          <div>
            <h3 className="font-semibold">United Family 👹</h3>
            <p className="text-xs text-base-content/50">
              Rashford is typing...
            </p>
          </div>
        </div>
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
        onScroll={handleScroll}
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
        <ChatInput
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

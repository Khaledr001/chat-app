import { useCallback, useEffect, useRef, useState } from "react";
import type { IMessage } from "../shear/types/others.types";

interface UseInfiniteScrollMessagesProps {
  chatId: string | undefined;
  fetchMessages: (
    chatId: string,
    page: number
  ) => Promise<{
    data: {
      messages: IMessage[];
      totalPages: number;
    };
  }>;
}

interface UseInfiniteScrollMessagesReturn {
  messages: IMessage[];
  isLoading: boolean;
  error: string | null;
  hasMore: boolean;
  containerRef: React.RefObject<HTMLDivElement>;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  resetMessages: () => void;
}

export const useInfiniteScrollMessages = ({
  chatId,
  fetchMessages,
}: UseInfiniteScrollMessagesProps): UseInfiniteScrollMessagesReturn => {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [page, setPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const containerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);
  const isInitialLoadRef = useRef<boolean>(true);

  // Reset everything when chatId changes
  useEffect(() => {
    setMessages([]);
    setPage(1);
    setTotalPages(0);
    setError(null);
    setHasMore(true);
    isInitialLoadRef.current = true;
  }, [chatId]);

  // Fetch messages when chatId or page changes
  useEffect(() => {
    if (!chatId) return;

    const loadMessages = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const response = await fetchMessages(chatId, page);
        const { messages: newMessages, totalPages: total } = response.data;

        setTotalPages(total);
        setHasMore(page < total);

        setMessages((prevMessages) => {
          // For page 1 (initial load or chat change), replace all messages
          if (page === 1) {
            return newMessages;
          }
          // For subsequent pages, prepend new messages (older messages go to top)
          // Avoid duplicates by checking message IDs
          const existingIds = new Set(prevMessages.map((m) => m._id));
          const uniqueNewMessages = newMessages.filter(
            (m: IMessage) => !existingIds.has(m._id)
          );
          return [...uniqueNewMessages, ...prevMessages];
        });

        // After loading older messages, maintain scroll position
        if (page > 1 && containerRef.current) {
          // Use requestAnimationFrame to ensure DOM has updated
          requestAnimationFrame(() => {
            if (containerRef.current) {
              const newScrollHeight = containerRef.current.scrollHeight;
              const scrollDiff =
                newScrollHeight - previousScrollHeightRef.current;
              containerRef.current.scrollTop = scrollDiff;
            }
          });
        }
      } catch (err) {
        console.error("Failed to fetch messages:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load messages"
        );
        setHasMore(false);
      } finally {
        setIsLoading(false);
        isInitialLoadRef.current = false;
      }
    };

    loadMessages();
  }, [chatId, page, fetchMessages]);

  // Handle infinite scroll
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      // Don't trigger during initial load or if already loading
      if (isLoading || !hasMore || isInitialLoadRef.current) return;

      // Check if scrolled to top (with 50px threshold for better UX)
      const isNearTop = container.scrollTop < 50;

      if (isNearTop && hasMore && !isLoading) {
        // Save current scroll height before loading new messages
        previousScrollHeightRef.current = container.scrollHeight;
        setPage((prevPage) => prevPage + 1);
      }
    };

    // Debounce scroll handler
    let timeoutId: NodeJS.Timeout;
    const debouncedHandleScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 150);
    };

    container.addEventListener("scroll", debouncedHandleScroll);

    return () => {
      container.removeEventListener("scroll", debouncedHandleScroll);
      clearTimeout(timeoutId);
    };
  }, [isLoading, hasMore, page]);

  // Manual reset function if needed
  const resetMessages = useCallback(() => {
    setMessages([]);
    setPage(1);
    setTotalPages(0);
    setError(null);
    setHasMore(true);
    isInitialLoadRef.current = true;
  }, []);

  return {
    messages,
    isLoading,
    error,
    hasMore,
    containerRef,
    page,
    setPage,
    resetMessages,
  };
};

// Alternative version with RTK Query support
export const useInfiniteScrollMessagesRTK = ({
  chatId,
  page,
  setPage,
  messagesQuery,
}: {
  chatId: string | undefined;
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  messagesQuery: any; // RTK Query result
}) => {
  const [allMessages, setAllMessages] = useState<IMessage[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const previousScrollHeightRef = useRef<number>(0);

  // Reset when chatId changes
  useEffect(() => {
    setAllMessages([]);
    setPage(1);
  }, [chatId, setPage]);

  // Update messages when query data changes
  useEffect(() => {
    if (messagesQuery?.data?.data?.messages) {
      const newMessages = messagesQuery.data.data.messages;

      setAllMessages((prev) => {
        if (page === 1) {
          return newMessages;
        }
        // Prepend older messages, avoiding duplicates
        const existingIds = new Set(prev.map((m) => m._id));
        const uniqueNewMessages = newMessages.filter(
          (m: IMessage) => !existingIds.has(m._id)
        );
        return [...uniqueNewMessages, ...prev];
      });

      // Maintain scroll position for pagination
      if (page > 1 && containerRef.current) {
        requestAnimationFrame(() => {
          if (containerRef.current) {
            const newScrollHeight = containerRef.current.scrollHeight;
            const scrollDiff =
              newScrollHeight - previousScrollHeightRef.current;
            containerRef.current.scrollTop = scrollDiff;
          }
        });
      }
    }
  }, [messagesQuery?.data, page]);

  // Handle scroll for pagination
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const totalPages = messagesQuery?.data?.data?.totalPages || 0;
    const hasMore = page < totalPages;

    const handleScroll = () => {
      if (messagesQuery?.isLoading || !hasMore) return;

      const isNearTop = container.scrollTop < 50;
      if (isNearTop) {
        previousScrollHeightRef.current = container.scrollHeight;
        setPage((prev) => prev + 1);
      }
    };

    let timeoutId: NodeJS.Timeout;
    const debouncedScroll = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(handleScroll, 150);
    };

    container.addEventListener("scroll", debouncedScroll);
    return () => {
      container.removeEventListener("scroll", debouncedScroll);
      clearTimeout(timeoutId);
    };
  }, [
    messagesQuery?.isLoading,
    page,
    messagesQuery?.data?.data?.totalPages,
    setPage,
  ]);

  return {
    messages: allMessages,
    containerRef,
    isLoading: messagesQuery?.isLoading,
    error: messagesQuery?.error,
    hasMore: page < (messagesQuery?.data?.data?.totalPages || 0),
  };
};

import { useCallback, useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { fetchChatMessages } from "../features/message-slice";
import { clearReply } from "../features/reply-slice";

const useMessages = (chatId: number) => {
  const dispatch = useAppDispatch();
  const {
    groupedMessages,
    messages: rawMessages,
    isLoading,
    hasMoreMessages,
  } = useAppSelector((state) => state.messageReducer);

  const initialFetchDone = useRef(false);
  const currentChatId = useRef(chatId);

  // Fixed: Added missing dependencies
  const loadMoreMessages = useCallback(() => {
    if (hasMoreMessages && !isLoading) {
      const currentPage = Math.ceil(rawMessages.length / 40) + 1;
      dispatch(fetchChatMessages({ chatId, page: currentPage }));
    }
  }, [chatId, hasMoreMessages, isLoading]);

  useEffect(() => {
    if (currentChatId.current !== chatId) {
      dispatch(clearReply());
      initialFetchDone.current = false;
      currentChatId.current = chatId;
    }

    if (chatId) {
      if (!initialFetchDone.current) {
        dispatch(fetchChatMessages({ chatId, page: 1 }));
        initialFetchDone.current = true;
      }
      return () => {
        dispatch(clearReply());
      };
    }
  }, [chatId]);

  return {
    chatItems: groupedMessages,
    isLoading,
    hasMoreMessages,
    loadMoreMessages,
  };
};

export default useMessages;

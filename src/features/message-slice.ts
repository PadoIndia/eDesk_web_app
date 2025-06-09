import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import chatService from "../services/api-services/chat-service";
import { MessageReducer } from "../types/features";
import { MessageResp, SubTaskResp } from "../types/chat";
import { getDateLabel } from "../utils/helper";

export type MessageGroupItem =
  | MessageResp
  | { type: "separator"; id: string; date: string };

interface ChatCache {
  messages: MessageResp[];
  groupedMessages: MessageGroupItem[];
  hasMoreMessages: boolean;
  currentPage: number;
}

type MessageSlice = MessageReducer & {
  cache: Record<number, ChatCache>;
  groupedMessages: MessageGroupItem[];
  currentChatId: number | null;
  isTransitioning: boolean; // ✅ ADD: Track when transitioning between chats
};

const initialState: MessageSlice = {
  messages: [],
  groupedMessages: [],
  subTasks: [],
  isLoading: false,
  hasMoreMessages: true,
  page: 1,
  cache: {},
  currentChatId: null,
  isTransitioning: false, // ✅ ADD: Initialize transitioning state
};

// More efficient grouping function that only performs the sort once
const groupMessages = (
  messages: MessageResp[],
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _subTasks?: SubTaskResp[]
): MessageGroupItem[] => {
  if (messages.length === 0) return [];

  // Sort only once for efficiency
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.sentAt).getTime() - new Date(b.sentAt).getTime()
  );

  const items: MessageGroupItem[] = [];

  let lastDate: string | null = null;
  sortedMessages.forEach((message, index) => {
    const messageDate = new Date(message.sentAt);
    const dateLabel = getDateLabel(messageDate);

    if (dateLabel !== lastDate) {
      items.push({
        type: "separator",
        id: `separator-${index}`,
        date: dateLabel,
      });
      lastDate = dateLabel;
    }

    items.push(message);
  });

  // Items are already sorted chronologically, reverse once for inverted list
  return items.reverse();
};

// ✅ UPDATED: Helper function to update global state with current chat data
const updateGlobalStateWithCurrentChat = (state: MessageSlice) => {
  if (state.currentChatId && state.cache[state.currentChatId]) {
    const currentCache = state.cache[state.currentChatId];
    state.messages = currentCache.messages;
    state.groupedMessages = currentCache.groupedMessages;
    state.hasMoreMessages = currentCache.hasMoreMessages;
    state.page = currentCache.currentPage;
    state.isTransitioning = false; // ✅ Clear transitioning state when data is loaded
  } else {
    // No current chat or cache doesn't exist
    state.messages = [];
    state.groupedMessages = [];
    state.hasMoreMessages = true;
    state.page = 1;
    state.isTransitioning = false;
  }
};

// ✅ ADD: Helper function to clear global state immediately
const clearGlobalState = (state: MessageSlice) => {
  state.messages = [];
  state.groupedMessages = [];
  state.hasMoreMessages = true;
  state.page = 1;
  state.isTransitioning = true; // ✅ Set transitioning state
};

export const fetchChatMessages = createAsyncThunk(
  "chat/messages",
  async (
    { chatId, page = 1 }: { chatId: number; page?: number },
    { rejectWithValue, getState }
  ) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const state = (getState() as any).messageReducer as MessageSlice;
    const cache = state.cache[chatId];

    // Simplified caching logic
    if (cache) {
      // For page 1, return cached data if it exists
      if (page === 1) {
        console.log("Using cached data for chat:", chatId);
        return {
          chatId,
          messages: cache.messages,
          page: 1,
          hasMoreMessages: cache.hasMoreMessages,
        };
      }

      // For subsequent pages, check if we already have enough messages
      const messagesNeeded = page * 40;
      if (cache.messages.length >= messagesNeeded) {
        console.log("Using cached pagination data for chat:", chatId);
        return {
          chatId,
          messages: cache.messages,
          page,
          hasMoreMessages: cache.hasMoreMessages,
        };
      }
    }

    try {
      console.log(
        "Fetching messages from API for chat:",
        chatId,
        "page:",
        page
      );
      const response = await chatService.getChatMessages(chatId, page);

      if (response.status === "success") {
        return {
          chatId,
          messages: response.data,
          page,
          hasMoreMessages: response.data.length === 40,
        };
      }

      return rejectWithValue(response.message);
    } catch {
      return rejectWithValue("Failed to fetch messages");
    }
  }
);

const messageSlice = createSlice({
  name: "message",
  initialState,
  reducers: {
    // ✅ UPDATED: Clear global state immediately when setting current chat
    setCurrentChat(state, action: PayloadAction<number>) {
      const newChatId = action.payload;

      // If switching to a different chat, clear global state immediately
      if (state.currentChatId !== newChatId) {
        clearGlobalState(state);
      }

      state.currentChatId = newChatId;
      updateGlobalStateWithCurrentChat(state);
    },

    // ✅ ADD: Action to clear current chat when navigating away
    clearCurrentChat(state) {
      clearGlobalState(state);
      state.currentChatId = null;
    },

    // ✅ ADD: Action to prepare for chat transition
    prepareForChatTransition(state) {
      clearGlobalState(state);
    },

    setSubtasks(state, action: PayloadAction<SubTaskResp[]>) {
      state.subTasks = action.payload;

      // ✅ FIX: Regenerate grouped messages for current chat when subtasks change
      if (state.currentChatId && state.cache[state.currentChatId]) {
        state.cache[state.currentChatId].groupedMessages = groupMessages(
          state.cache[state.currentChatId].messages,
          state.subTasks
        );
        updateGlobalStateWithCurrentChat(state);
      }
    },

    toggleSubTask(state, action: PayloadAction<number>) {
      const subTaskIndex = state.subTasks.findIndex(
        (subTask) => subTask.id === action.payload
      );
      if (subTaskIndex > -1) {
        state.subTasks[subTaskIndex].value =
          !state.subTasks[subTaskIndex].value;
      }
    },

    addMessage(state, action: PayloadAction<MessageResp>) {
      const newMessage = action.payload;
      const messageChatId = newMessage.chatId;

      if (!messageChatId) return;

      // Initialize cache for new chat if needed
      if (!state.cache[messageChatId]) {
        state.cache[messageChatId] = {
          messages: [],
          groupedMessages: [],
          hasMoreMessages: true,
          currentPage: 1,
        };
      }

      const chatCache = state.cache[messageChatId];
      // Prevent duplicate messages by checking ID
      if (!chatCache.messages.some((msg) => msg.id === newMessage.id)) {
        chatCache.messages.push(newMessage);
        // Regenerate grouped messages for this specific chat
        chatCache.groupedMessages = groupMessages(
          chatCache.messages,
          state.subTasks
        );
      }

      // ✅ FIX: Only update global state if this message belongs to the current chat
      if (state.currentChatId === messageChatId) {
        updateGlobalStateWithCurrentChat(state);
      }
    },

    resetPage(state) {
      state.page = 1;
      updateGlobalStateWithCurrentChat(state);
    },

    clearCache(state, action: PayloadAction<number | undefined>) {
      if (action.payload !== undefined) {
        delete state.cache[action.payload];
        // ✅ FIX: If we cleared the current chat's cache, update global state
        if (state.currentChatId === action.payload) {
          updateGlobalStateWithCurrentChat(state);
        }
      } else {
        state.cache = {};
        state.currentChatId = null;
        updateGlobalStateWithCurrentChat(state);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChatMessages.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchChatMessages.fulfilled, (state, action) => {
        const { chatId, messages, page, hasMoreMessages } = action.payload;

        // ✅ UPDATED: Only set current chat if it's not already set or if it's different
        if (state.currentChatId !== chatId) {
          state.currentChatId = chatId;
        }

        // Initialize chat cache if needed
        if (!state.cache[chatId]) {
          state.cache[chatId] = {
            messages: [],
            groupedMessages: [],
            hasMoreMessages: true,
            currentPage: 1,
          };
        }

        // Handle first page - replace all data
        if (page === 1) {
          // Skip update if data is identical to avoid unnecessary state changes
          if (
            state.cache[chatId].messages.length > 0 &&
            messages.length === state.cache[chatId].messages.length &&
            messages[0].id === state.cache[chatId].messages[0].id
          ) {
            updateGlobalStateWithCurrentChat(state);
            state.isLoading = false;
            return;
          }
          console.log("Subtasks current available", state.subTasks);

          // Otherwise, update cache with new messages
          state.cache[chatId] = {
            messages: messages,
            groupedMessages: groupMessages(messages, state.subTasks),
            hasMoreMessages: !!hasMoreMessages,
            currentPage: page,
          };
        } else {
          // For subsequent pages, merge with existing data and deduplicate
          const existingMessageIds = new Set(
            state.cache[chatId].messages.map((m) => m.id)
          );
          const newMessages = messages.filter(
            (m) => !existingMessageIds.has(m.id)
          );

          // Only update if there are new messages to add
          if (newMessages.length > 0) {
            const mergedMessages = [
              ...state.cache[chatId].messages,
              ...newMessages,
            ];

            state.cache[chatId] = {
              messages: mergedMessages,
              groupedMessages: groupMessages(mergedMessages, state.subTasks),
              hasMoreMessages: !!hasMoreMessages,
              currentPage: page,
            };
          }
        }

        // ✅ FIX: Use helper function to update global state
        updateGlobalStateWithCurrentChat(state);
        state.isLoading = false;
      })
      .addCase(fetchChatMessages.rejected, (state) => {
        state.isLoading = false;
        state.hasMoreMessages = false;
        state.isTransitioning = false; // ✅ Clear transitioning state on error
      });
  },
});

export const {
  setCurrentChat,
  clearCurrentChat, // ✅ ADD: Export new action
  prepareForChatTransition, // ✅ ADD: Export new action
  setSubtasks,
  addMessage,
  toggleSubTask,
  resetPage,
  clearCache,
} = messageSlice.actions;

export default messageSlice.reducer;

import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import chatService from "../services/api-services/chat-service";
import { ChatReducer } from "../types/features";
import { ChatResp } from "../types/chat";
import { ChatUpdated } from "../types/socket";
import { setSubtasks } from "./message-slice";

const initialState: ChatReducer = {
  taskChats: null,
  otherChats: null,
  chatDetails: null,
  isLoading: true,
  error: null,
};

export const getAllChats = createAsyncThunk(
  "chat/getAll",
  async (type: "STANDARD" | "TASK" | "GROUP", { rejectWithValue }) => {
    const response = await chatService.getAllChats(type);
    if (response.status == "success") {
      return {
        type,
        data: response.data,
      };
    }
    return rejectWithValue(response.message);
  }
);

export const getChatDetails = createAsyncThunk(
  "chat/details",
  async (id: number, { rejectWithValue, dispatch }) => {
    const response = await chatService.getChatDetails(id);
    if (response.status == "success") {
      dispatch(setSubtasks(response.data.subTask));
      return response.data;
    }
    return rejectWithValue(response.message);
  }
);

const chatSlice = createSlice({
  name: "chat",
  reducers: {
    updateLatestMessage: (
      state,
      action: PayloadAction<ChatUpdated & { isSelf: boolean }>
    ) => {
      const { chatId, latestMessage, isSelf, chatType } = action.payload;
      const dataArray =
        chatType === "TASK" ? state.taskChats : state.otherChats;
      const index = dataArray?.findIndex((chat) => chat.id === chatId);

      if (index !== undefined && index >= 0 && dataArray) {
        dataArray[index].latestMessage = {
          messageText: latestMessage.messageText || latestMessage.type,
          sentAt: latestMessage.sentAt,
        };
        console.log(!isSelf && chatId !== state.chatDetails?.id);
        if (!isSelf && chatId !== state.chatDetails?.id)
          dataArray[index].unreadCount += 1;
        const updatedChat = dataArray.splice(index, 1)[0];
        dataArray.unshift(updatedChat);
      }
    },
    removeChatParticipant: (state, action: PayloadAction<number>) => {
      const participantId = action.payload;
      if (state.chatDetails?.participants) {
        state.chatDetails.participants = state.chatDetails?.participants.filter(
          (i) => i.id !== participantId
        );
      }
    },
    updateMessageSeen: (
      state,
      action: PayloadAction<{
        chatId: number;
        type: "TASK" | "STANDARD" | "GROUP";
      }>
    ) => {
      const { chatId, type } = action.payload;
      const dataArray = type === "TASK" ? state.taskChats : state.otherChats;
      const index = dataArray?.findIndex((chat) => chat.id === chatId);

      if (index !== undefined && index >= 0 && dataArray) {
        dataArray[index].unreadCount = 0;
      }
    },
    updateChatStatus: (state, action: PayloadAction<ChatResp["status"]>) => {
      if (state.chatDetails?.status) state.chatDetails.status = action.payload;
    },
    resetDetails: (state) => {
      state.chatDetails = null;
    },
  },
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getAllChats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllChats.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.type === "TASK") {
          state.taskChats = action.payload.data;
        } else {
          state.otherChats = action.payload.data;
        }
      })
      .addCase(getAllChats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });

    builder
      .addCase(getChatDetails.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getChatDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chatDetails = action.payload;
      })
      .addCase(getChatDetails.rejected, (state, action) => {
        state.error = action.payload;
        state.isLoading = false;
      });
  },
});

export const {
  updateLatestMessage,
  updateChatStatus,
  updateMessageSeen,
  resetDetails,
  removeChatParticipant,
} = chatSlice.actions;

export default chatSlice.reducer;

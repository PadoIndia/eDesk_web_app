import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { MessageResp } from "../types/chat";

interface ReplyState {
  message: MessageResp | null;
}

const initialState: ReplyState = {
  message: null,
};

const replySlice = createSlice({
  name: "reply",
  initialState,
  reducers: {
    setReply(state, action: PayloadAction<MessageResp | null>) {
      state.message = action.payload;
    },
    clearReply(state) {
      state.message = null;
    },
  },
});

export const { setReply, clearReply } = replySlice.actions;
export default replySlice.reducer;

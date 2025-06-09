import { Socket } from "socket.io-client";
import { MessagePayload } from "./queue";
import { MessageResp, SubTaskResp } from "./chat";

export type ChatUpdated = {
  chatId: number;
  chatType: "GROUP" | "STANDARD" | "TASK";
  latestMessage: {
    messageText: string;
    sentAt: Date;
    createdById: number;
    type: string;
  };
  msg: MessageResp;
};

export type JoinChatPayload = {
  chatId: number;
};

export interface ServerToClientEvents {
  userStatusUpdated: (payload: {
    userId: number;
    status: "ONLINE" | "OFFLINE";
  }) => void;
  joinedChat: (payload: { message: string }) => void;
  error: (payload: { message: string }) => void;
  chatUpdated: (payload: ChatUpdated) => void;
  newMessage: (payload: MessageResp) => void;
  leftChat: (payload: { message: string }) => void;
  subTaskCompleted: (payload: SubTaskResp) => void;
}

export interface ClientToServerEvents {
  joinChat: (payload: JoinChatPayload) => void;
  sendMessage: (payload: MessagePayload) => void;
  leaveChat: (payload: JoinChatPayload) => void;
  subTaskToggle: (payload: {
    id: number;
    value: boolean;
    chatId: number;
  }) => void;
}

export type TypedSocket = Socket<ServerToClientEvents, ClientToServerEvents>;

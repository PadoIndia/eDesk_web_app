import {
  ChatItem,
  ChatPayload,
  MessageResp,
  SingleChatResp,
  SubTaskResp,
} from "./chat";
import { User, UserDataDetails } from "./user.types";

export type AuthReducer = {
  loggedIn: boolean;
  isCheckingToken: boolean;
  data: null | {
    name?: string;
    mobile?: string | null;
    profileUrl?: string;
    userId: number;
  };
  isLoading: boolean;
  error: unknown;
};

export interface ChatReducer {
  taskChats: ChatItem[] | null;
  otherChats: ChatItem[] | null;
  chatDetails: SingleChatResp | null;
  isLoading: boolean;
  error: unknown;
}

export type UserReducer = {
  isLoading: boolean;
  data: User[] | null;
  errors: unknown;
  current: UserDataDetails | null;
};

export type TaskReducer = {
  payload:
    | (Omit<ChatPayload, "deadline"> & {
        deadline?: string;
        id?: number;
      })
    | null;
  action: "NEW" | "EDIT";
};

export type UploadStatus =
  | "none"
  | "success"
  | "error"
  | "processing"
  | "uploading"
  | "canceled";

export type MediaReducer = {
  files: File[];
  data: {
    text: string;
    parent?: {
      text: string;
      by: string;
    };
  } | null;
  status: UploadStatus;
  progress: number;
  type: "image" | "pdf" | "text" | "none" | "video";
};

export type MessageReducer = {
  messages: MessageResp[];
  isLoading: boolean;
  hasMoreMessages: boolean;
  page: number;
  subTasks: SubTaskResp[];
};

export type ViewMediaReducer = {
  pdfData: null | { url: string; name: string };
  image: string | null;
};

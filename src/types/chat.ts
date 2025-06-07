export type MediaType = "IMAGE" | "VIDEO" | "DOCUMENT" | "NONE" | "PDF";

export type ChatType = "STANDARD" | "GROUP" | "TASK";

export type ChatStatus =
  | "ACTIVE"
  | "ARCHIVED"
  | "DELETED"
  | "OPEN"
  | "IN_PROGRESS"
  | "SUBMITTED"
  | "CLOSED";

export type JoinStatus = "APPROVED" | "PENDING" | "REJECTED";

export type ChatItem = {
  id: number;
  unreadCount: number;
  type: ChatType;
  latestMessage: {
    messageText: string | null;
    media?: {
      type: MediaType;
      name: string;
    };
    sentAt: Date;
  } | null;
  title: string;
  thumbnailImageUrl: string | null;
  joinStatus: JoinStatus;
  createdAt: Date;
  status: ChatStatus;
  participants: {
    user: {
      id: number;
      name: string | null;
      profileUrl: string | null;
    };
  }[];
};

export type ChatResp = {
  _count: {
    messages: number;
  };
  description: string | null;
  latestMessage: {
    messageText: string | null;
    media?: {
      type: MediaType;
      name: string;
    };
    sentAt: Date;
  } | null;
  id: number;
  title: string;
  thumbnailImageUrl: string | null;
  createdById: number;
  createdAt: Date;
  type: ChatType;
  status: ChatStatus;
  requiresSubmit: boolean;
  latestMessageId: bigint | null;
  taskMessageId: bigint | null;
  participants: {
    user: {
      id: number;
      name: string | null;
      profileUrl: string | null;
    };
  }[];
  subTask: SubTaskResp[];
  joinStatus: JoinStatus;
  deadline: null | Date;
};

export type ChatPayload = {
  title: string;
  thumbnailImgId?: number;
  participants: number[];
  admins: number[];
  description?: string;
  presetId?: number;
  subTasks?: string[];
  type: ChatType;
  deadline?: Date;
  requiresSubmit?: boolean;
  taskMessageId?: BigInt;
  status?: ChatStatus;
};

export type SubTaskResp = {
  id: number;
  comment?: string;
  key: string;
  value: boolean;
};

export type SingleChatResp = {
  id: number;
  title: string;
  createdById: number;
  type: ChatType;
  status: ChatStatus;
  requiresSubmit: boolean;
  deadline: null | Date;
  description: string | null;
  subTask: SubTaskResp[];
  thumbnailImageUrl: string | null;
  participants: ChatParticipant[];
  taskMessageId: BigInt | null;
};

export type MessageResp = {
  id: bigint;
  chatId: number;
  messageText: string | null;
  sentAt: Date;
  parentMessage:
    | (Omit<MessageResp, "status" | "parentMessageId" | "media"> & {
        media: {
          type: MediaType;
          thumbnailUrl: string;
        };
      })
    | null;
  userId: number | null;
  status: {
    id: bigint;
    userId: number;
    status: "SENT" | "DELIVERED" | "READ";
  }[];
  user: { name: string };
  messageForTask: {
    id: number;
    title: string;
    thumbnailImg: { url: string | null } | null;
  };
  media: {
    type: MediaType;
    thumbnailUrl: string;
    id: number;
    url: string;
    name: string;
  };
};

export type MediaResp = {
  id: number;
  name: string;
  url: string;
  thumbnailUrl: string;
  type: MediaType;
  mimeType: string;
};

export type ChatParticipant = {
  id: number;
  isAdmin: boolean;
  joinStatus: JoinStatus;
  user: {
    name: string;
    username: string;
    profileUrl: string | null;
    id: number;
    lastSeen: Date | null;
    status: "OFFLINE" | "ONLINE" | null;
  };
};

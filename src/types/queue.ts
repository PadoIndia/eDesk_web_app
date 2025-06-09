import { ChatType } from "./chat";
import { JoinChatPayload, TypedSocket } from "./socket";

export enum QueueItemType {
  MESSAGE = "MESSAGE",
  JOIN = "JOIN",
  LEAVE = "LEAVE",
}
export type MessagePayload = {
  chatType: ChatType;
  parentMessageId?: bigint | undefined;
  chatId: number;
  userId: number | undefined;
  messageText: string;
  mediaId: number | null;
};
export type MessageQueueItem = {
  type: QueueItemType.MESSAGE;
  data: MessagePayload;
};
export type StatusQueueItem = {
  type: QueueItemType.JOIN | QueueItemType.LEAVE;
  data: JoinChatPayload;
};
export type QueueItem = MessageQueueItem | StatusQueueItem;

export interface IChatMessageQueue {
  /**Room ID for the Queue */
  roomID: `${number}-${number}` | null;
  /**Messages in the Queue */
  queueMessages: QueueItem[];
  /**Socket Manager for the Queue */
  socketManager: TypedSocket | null;
  /**Add new message/Event to the Chat message Queue */
  enqueueMessage: (item: QueueItem) => void;
  /**Processes queue messages one by one */
  processQueue: () => Promise<void>;
  /**Get all the messages in the queue */
  getMessages: () => Promise<QueueItem[]>;
  /**Clear all the messages in the queue */
  clearQueue: () => Promise<void>;
  /**Retry all the failed messages in the queue */
  retryFailedMessages: () => Promise<void>;
}

export interface IQueueManager {
  socket: TypedSocket | null;
  queues: Map<`${number}-${number}`, IChatMessageQueue>;
  addQueue: (roomID: `${number}-${number}`) => void;
  getQueue: (roomID: `${number}-${number}`) => IChatMessageQueue | undefined;
  removeQueue: (roomID: `${number}-${number}`) => void;
}

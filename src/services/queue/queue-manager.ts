import { io } from "socket.io-client";
import {
  IQueueManager,
  IChatMessageQueue,
  QueueItemType,
} from "../../types/queue";
import { TypedSocket } from "../../types/socket";
import ChatMessageQueue from "./message-queue";
import { socketUrl } from "../../store/config";
import { decryptAndParseTokenFromStorage } from "../../utils/helper";

class QueueManager implements IQueueManager {
  queues: Map<`${number}-${number}`, IChatMessageQueue> = new Map();
  socket: TypedSocket | null = null;

  constructor(token: string) {
    // Setup socket with better reconnection settings
    this.socket = io(socketUrl, {
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 1000,

      reconnectionDelayMax: 5000,
      timeout: 10000,
      auth: {
        token,
      },
    });
    this.setupNetworkListeners();
  }

  private setupNetworkListeners() {
    // Set up network monitoring
    window.addEventListener("online", () => {
      if (this.socket && !this.socket.connected) {
        this.socket.connect();
        this.processAllQueues();
      }
    });

    window.addEventListener("offline", () => {
      if (this.socket && this.socket.connected) {
        this.socket.disconnect();
      }
    });
  }

  addQueue(roomID: `${number}-${number}`) {
    if (this.socket && !this.queues.has(roomID)) {
      this.queues.set(roomID, new ChatMessageQueue(this.socket, roomID));
    }
  }

  getQueue(roomID: `${number}-${number}`) {
    return this.queues.get(roomID);
  }

  removeQueue(roomID: `${number}-${number}`) {
    const queue = this.queues.get(roomID);

    if (queue) {
      const roomParts = roomID.split("-");
      const chatId = parseInt(roomParts[0]);

      queue.enqueueMessage({
        type: QueueItemType.LEAVE,
        data: { chatId },
      });
    }
  }

  async processAllQueues() {
    const promises: Promise<void>[] = [];

    for (const queue of this.queues.values()) {
      if (queue.queueMessages.length > 0) {
        promises.push(queue.processQueue());
      }
    }

    await Promise.all(promises);
  }
}

let queueManager: QueueManager | null = null;

export const getQueueManager = async () => {
  if (!queueManager) {
    const userInfo = decryptAndParseTokenFromStorage();
    if (!userInfo || !userInfo.token)
      throw new Error("Token is missing — user not logged in");
    queueManager = new QueueManager(userInfo.token);
  }
  return queueManager;
};

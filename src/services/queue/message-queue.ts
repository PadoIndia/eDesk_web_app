import {IChatMessageQueue, QueueItem, QueueItemType} from '../../types/queue';
import {TypedSocket} from '../../types/socket';

class ChatMessageQueue implements IChatMessageQueue {
  socketManager: TypedSocket | null = null;
  roomID: `${number}-${number}` | null = null;
  queueMessages: QueueItem[] = [];
  isProcessing: boolean = false;

  constructor(socketManager: TypedSocket, roomID: `${number}-${number}`) {
    this.roomID = roomID;
    this.socketManager = socketManager;

    this.socketManager.on('connect', this.handleConnect.bind(this));
    this.socketManager.on('disconnect', this.handleDisconnect.bind(this));
  }

  private handleConnect() {
    if (this.queueMessages.length > 0) {
      this.processQueue();
    }
  }

  private handleDisconnect() {
    this.isProcessing = false;
  }

  private optimizeQueue() {
    console.log(JSON.stringify(this.queueMessages, null, 2));
    // Detect and remove JOIN-LEAVE pairs if they are consecutive
    for (let i = 0; i < this.queueMessages.length - 1; i++) {
      if (
        this.queueMessages[i].type === QueueItemType.JOIN &&
        this.queueMessages[i + 1].type === QueueItemType.LEAVE
      ) {
        // Remove both events as they cancel each other out
        this.queueMessages.splice(i, 2);
        i--; // Adjust index after removal
      }

      // Also detect and remove LEAVE-JOIN pairs for the same room
      if (
        this.queueMessages[i].type === QueueItemType.LEAVE &&
        this.queueMessages[i + 1].type === QueueItemType.JOIN
      ) {
        // Remove both events
        this.queueMessages.splice(i, 2);
        i--; // Adjust index after removal
      }
    }
  }

  async processQueue() {
    // If already processing or no socket, exit
    if (
      this.isProcessing ||
      !this.socketManager ||
      !this.socketManager.connected
    ) {
      return;
    }
    // Start processing
    this.isProcessing = true;

    // First optimize the queue
    this.optimizeQueue();

    // Sort by priority (LEAVE > JOIN > MESSAGE)
    const priorityMap = {
      [QueueItemType.LEAVE]: 3,
      [QueueItemType.JOIN]: 2,
      [QueueItemType.MESSAGE]: 1,
    };

    this.queueMessages.sort(
      (a, b) => priorityMap[b.type] - priorityMap[a.type],
    );

    // Process each message one by one
    while (this.queueMessages.length > 0) {
      const currentMessage = this.queueMessages[0];

      // Special case for LEAVE: process it only if it's the last message
      if (
        currentMessage.type === QueueItemType.LEAVE &&
        this.queueMessages.length > 1
      ) {
        // Move LEAVE to the end of the queue
        this.queueMessages.push(this.queueMessages.shift()!);
        continue;
      }

      try {
        switch (currentMessage.type) {
          case QueueItemType.MESSAGE: {
            await new Promise<void>(resolve => {
              this.socketManager?.emit('sendMessage', currentMessage.data);

              // Set a timeout in case we don't get acknowledgment
              setTimeout(() => {
                resolve(); // Resolve anyway to prevent blocking the queue
              }, 10);
            });
            break;
          }
          case QueueItemType.JOIN: {
            await new Promise<void>(resolve => {
              this.socketManager?.emit('joinChat', currentMessage.data);

              setTimeout(() => {
                resolve();
              }, 0);
            });
            break;
          }
          case QueueItemType.LEAVE: {
            await new Promise<void>(resolve => {
              this.socketManager?.emit('leaveChat', currentMessage.data);
              setTimeout(() => {
                resolve();
              }, 10);
            });
            break;
          }
        }

        // Remove processed message
        this.queueMessages.shift();
      } catch (error) {
        console.error('Error processing message:', error);

        const failedMessage = this.queueMessages.shift();
        if (failedMessage) {
          this.queueMessages.push(failedMessage);
        }
      }
    }

    // End processing state
    this.isProcessing = false;
  }

  enqueueMessage(item: QueueItem) {
    this.queueMessages.push(item);

    // Try to process the queue if we have a connection
    if (this.socketManager && this.socketManager.connected) {
      this.processQueue();
    }
  }

  async getMessages() {
    return this.queueMessages;
  }

  async clearQueue() {
    // Clear the messages in the queue
    this.queueMessages = [];
  }

  async retryFailedMessages() {
    // Simply trigger queue processing again
    this.processQueue();
  }
}

export default ChatMessageQueue;

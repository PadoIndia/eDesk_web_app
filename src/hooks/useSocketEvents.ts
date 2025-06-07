import { useEffect, useCallback } from "react";
import { addMessage, toggleSubTask } from "../features/message-slice";
import { useAppDispatch, useAppSelector } from "../store/store";
import { MessageResp, SubTaskResp } from "../types/chat";
import chatService from "../services/api-services/chat-service";
import { setMediaData } from "../features/media-slice";
import { TypedSocket } from "../types/socket";
import { QueueItemType } from "../types/queue";
import { getQueueManager } from "../services/queue/queue-manager";
import { toast } from "react-toastify";

const useSocketHandler = (
  socket: TypedSocket | null,
  chatId: number,
  userId?: number
) => {
  const dispatch = useAppDispatch();
  const participants = useAppSelector(
    (s) => s.chatReducer.chatDetails?.participants
  );

  const handleTaskMessage = useCallback(
    (message: MessageResp) => {
      const chatTitle = message.messageText?.replace("#", "");
      chatService
        .createNewChat({
          admins: [],
          participants:
            participants
              ?.filter((i) => i.user.id !== userId)
              .map((i) => i.user.id) || [],
          title: chatTitle || "",
          type: "TASK",
          requiresSubmit: true,
          taskMessageId: message.id,
        })
        .then((res) => {
          if (res.status === "success") {
            toast.success("Task Created Successfully");
          }
        })
        .catch((err) => {
          console.error("Failed to create task chat:", err);
        });
    },
    [participants, userId]
  );

  const globalNewMessageHandler = useCallback(
    (message: MessageResp) => {
      console.log("Global New Message Received:", message);

      dispatch(addMessage(message));
      dispatch(setMediaData({ chatId, type: "none", data: null, files: [] }));
      if (message.messageText?.startsWith("#")) {
        handleTaskMessage(message);
      }
    },
    [handleTaskMessage, chatId]
  );

  useEffect(() => {
    if (chatId && userId && socket) {
      console.log(`Setting up socket for chat: ${chatId}`);

      socket.off("newMessage", globalNewMessageHandler);
      socket.off("newMessage");
      socket.off("subTaskCompleted");

      const chatSpecificMessageHandler = (message: MessageResp) => {
        console.log(`Chat-Specific Message for Chat ${chatId}:`, message);

        if (message.chatId === chatId) {
          dispatch(addMessage(message));

          if (message.messageText?.startsWith("#")) {
            handleTaskMessage(message);
          }
        }
      };

      const subTaskHandler = (subtask: SubTaskResp) => {
        console.log("Subtask Completed:", subtask);
        dispatch(toggleSubTask(subtask.id));
      };

      socket.on("newMessage", globalNewMessageHandler);
      socket.on("newMessage", chatSpecificMessageHandler);
      socket.on("subTaskCompleted", subTaskHandler);

      return () => {
        socket.off("newMessage", globalNewMessageHandler);
        socket.off("newMessage");
        socket.off("subTaskCompleted");
      };
    }
  }, [socket, chatId, userId]);

  console.log("re-rendered");
  useEffect(() => {
    if (chatId && userId) {
      const roomID = `${chatId}-${userId}` as `${number}-${number}`;

      let mounted = true;

      (async () => {
        try {
          const manager = await getQueueManager();
          if (!mounted) return;

          manager.addQueue(roomID);

          manager.getQueue(roomID)?.enqueueMessage({
            type: QueueItemType.JOIN,
            data: { chatId },
          });
        } catch (err) {
          console.error("Failed to setup queue for chat:", err);
        }
      })();

      return () => {
        mounted = false;
        (async () => {
          try {
            const manager = await getQueueManager();
            manager.removeQueue(roomID);
          } catch (err) {
            console.error("Failed to remove queue:", err);
          }
        })();
      };
    }
  }, [chatId, userId]);

  return null;
};

export default useSocketHandler;

import { useCallback, useEffect } from "react";
import { initState, setMediaData } from "../../../features/media-slice";
import useMessages from "../../../hooks/useMessages";
import useSocket from "../../../hooks/useSocket";
import useSocketHandler from "../../../hooks/useSocketEvents";
import { getQueueManager } from "../../../services/queue/queue-manager";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { QueueItemType } from "../../../types/queue";
import ChatHeader from "./chat-header";
import ChatInput from "./chat-input";
import ChatMessages from "./chat-messages";
import { setReply } from "../../../features/reply-slice";
import { clearCurrentChat, resetPage } from "../../../features/message-slice";
import { SubTaskResp } from "../../../types/chat";

const ChatScreen = ({ id }: { id: number }) => {
  const socket = useSocket();
  const userId = useAppSelector((state) => state.auth.userData?.user.id);
  useSocketHandler(socket, id, userId);
  const replyMessage = useAppSelector((state) => state.replyReducer.message);
  const { chatItems, loadMoreMessages, isLoading } = useMessages(id);
  const dispatch = useAppDispatch();
  const status = useAppSelector((s) => s.chatReducer.chatDetails?.status);

  const isSendingDisAllowed = status === "SUBMITTED" || status === "CLOSED";

  useEffect(() => {
    if (id) {
      dispatch(initState(id));
      return () => {
        dispatch(resetPage());
        dispatch(clearCurrentChat());
      };
    }
  }, [id]);

  const sendMessage = useCallback(
    (messageText: string, mediaId: number | null) => {
      if (!(messageText.trim() || mediaId)) return;
      dispatch(
        setMediaData({ data: { text: messageText }, type: "text", chatId: id })
      );
      dispatch(setReply(null));

      const newMessage = {
        chatId: id,
        userId,
        messageText,
        mediaId,
        ...(replyMessage && { parentMessageId: replyMessage.id }),
        chatType: "TASK" as const,
      };

      dispatch(
        setMediaData({
          type: "text",
          chatId: id,
          data: {
            text: messageText,
            ...(replyMessage && {
              parent: {
                text: replyMessage?.messageText || "",
                by:
                  userId == replyMessage.userId
                    ? "You"
                    : replyMessage?.user.name,
              },
            }),
          },
        })
      );

      const roomID = `${id}-${userId}` as `${number}-${number}`;

      (async () => {
        try {
          const manager = await getQueueManager();
          const queue = manager.getQueue(roomID);
          if (queue) {
            queue.enqueueMessage({
              type: QueueItemType.MESSAGE,
              data: newMessage,
            });
          } else {
            socket?.emit("sendMessage", newMessage);
          }
        } catch (error) {
          console.error("Failed to send message via queueManager:", error);
          socket?.emit("sendMessage", newMessage);
        }
      })();
    },
    [id, userId, replyMessage, socket, dispatch]
  );

  const toggleSubtask = useCallback(
    (task: SubTaskResp) => {
      socket?.emit("subTaskToggle", {
        chatId: id,
        id: task.id,
        value: !task.value,
      });
    },
    [id, socket, userId]
  );

  if (!userId) return null;
  return (
    <>
      <ChatHeader />
      <ChatMessages
        chatId={id}
        chatItems={chatItems}
        userId={userId}
        isLoading={isLoading}
        loadMoreMessages={loadMoreMessages}
        toggleSubTask={toggleSubtask}
      />
      {isSendingDisAllowed ? (
        <div
          style={{
            backgroundColor: "#FFE4C4",
          }}
          className="d-flex align-items-center justify-content-center p-4"
        >
          <span style={{ color: "#8B4513" }} className="text-center">
            {status === "SUBMITTED"
              ? `This chat is submitted. You can no longer
          send messages.`
              : `This chat is closed. You can no longer send
          messages.`}
          </span>
        </div>
      ) : (
        <ChatInput
          chatId={id}
          onMessageSend={sendMessage}
          replyMessage={replyMessage}
        />
      )}
    </>
  );
};

export default ChatScreen;

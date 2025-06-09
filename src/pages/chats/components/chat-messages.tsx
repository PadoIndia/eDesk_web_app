import { MessageGroupItem } from "../../../features/message-slice";
import { useRef, useEffect, useState } from "react";
import MediaModal from "./media-modal";
import { MediaType, SubTaskResp } from "../../../types/chat";
import MessageItem from "./message-item";
import MediaPlaceholder from "./message-placeholder";
import { useAppSelector } from "../../../store/store";
import { MdPushPin } from "react-icons/md";

function isSeparator(
  item: MessageGroupItem
): item is { type: "separator"; id: string; date: string } {
  return (item as { type: string }).type === "separator";
}

type Props = {
  chatItems: MessageGroupItem[];
  userId: number;
  isLoading: boolean;
  loadMoreMessages: () => void;
  chatId: number;
  toggleSubTask: (e: SubTaskResp) => void;
};

const ChatMessages = ({
  userId,
  chatId,
  chatItems,
  isLoading,
  loadMoreMessages,
  toggleSubTask,
}: Props) => {
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const subtasks = useAppSelector((s) => s.messageReducer?.subTasks) || [];
  const [selectedMedia, setSelectedMedia] = useState<{
    type: MediaType;
    url: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (messagesContainerRef.current && chatItems.length > 0) {
      messagesContainerRef.current.scrollTop =
        messagesContainerRef.current.scrollHeight;
    }
  }, [chatItems]);

  const handleScroll = () => {
    const container = messagesContainerRef.current!;
    if (container) {
      const isAtBottom =
        container.scrollHeight +
          Math.round(container.scrollTop) -
          container.clientHeight <=
        5;
      if (isAtBottom) loadMoreMessages();
    }
  };

  const handleMediaClick = (media: {
    type: MediaType;
    url: string;
    name: string;
  }) => {
    setSelectedMedia(media);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const scrollToSubTasks = () => {
    if (messagesContainerRef)
      messagesContainerRef.current?.scrollTo({
        top: -messagesContainerRef.current.scrollHeight,
        behavior: "smooth",
      });
  };

  return (
    <>
      <MediaModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        media={selectedMedia}
      />
      <div
        onClick={scrollToSubTasks}
        style={{
          height: 30,
          right: 30,
          width: 30,
          top: 80,
          zIndex: 2,
          cursor: "pointer",
        }}
        className="rounded-circle  position-absolute shadow-lg cusror-pointer bg-primary d-flex justify-content-center align-items-center"
      >
        <MdPushPin color="white" size={18} />
      </div>
      <div
        className="chat-messages p-3 overflow-auto bg-light position-relative d-flex flex-column-reverse"
        style={{ height: "calc(100vh - 130px)" }}
        onScroll={handleScroll}
        ref={messagesContainerRef}
      >
        {isLoading && (
          <div className="position-absolute bottom-0 start-0 end-0 d-flex justify-content-center p-2">
            <div
              className="spinner-border spinner-border-sm text-primary"
              role="status"
            >
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}
        <MediaPlaceholder chatId={chatId} />

        {chatItems.map((message) => {
          if (isSeparator(message)) {
            return (
              <div
                key={String(message.id)}
                className="d-flex justify-content-center mb-3"
              >
                <div className="bg-light rounded p-2 small text-muted">
                  {message.date}
                </div>
              </div>
            );
          }

          return (
            <MessageItem
              userId={userId}
              handleMediaClick={handleMediaClick}
              message={message}
            />
          );
        })}
        <div
          id="subtask-container"
          className="w-50 bg-white d-flex flex-column  justify-content-center rounded shadow  p-3"
        >
          <h5>SubTasks</h5>
          <div className="ps-2">
            {subtasks.map((subtask) => (
              <div className="d-flex gap-2">
                <input
                  className=""
                  onChange={(e) =>
                    toggleSubTask({
                      ...subtask,
                      value: !e.target.checked,
                    })
                  }
                  type="checkbox"
                  checked={!!subtask.value}
                  name=""
                  id=""
                />
                <label htmlFor="">{subtask.key}</label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ChatMessages;

import { IoCheckmarkDone, IoPlay } from "react-icons/io5";
import { MediaType, MessageResp } from "../../../types/chat";
import Avatar from "../../../components/avatar";
import { format } from "date-fns";
import { FaRegFilePdf } from "react-icons/fa";
import { LuCircleChevronDown } from "react-icons/lu";
import { useAppDispatch } from "../../../store/store";
import { setReply } from "../../../features/reply-slice";

type Props = {
  message: MessageResp;
  userId: number;
  handleMediaClick: (media: {
    type: MediaType;
    url: string;
    name: string;
  }) => void;
};

const MessageItem = ({ message, userId, handleMediaClick }: Props) => {
  const isOwnMessage = message.userId === userId;
  const messageTime = format(new Date(message.sentAt), "HH:mm");
  const hasMedia = message.media && message.media.type !== "NONE";
  const dispatch = useAppDispatch();
  const allRead = message.status.every((i) => i.status === "READ");
  const allDelivered = message.status.every(
    (i) => i.status === "DELIVERED" || i.status === "READ"
  );

  return (
    <div
      key={String(message.id)}
      className={`message-item d-flex mb-2  ${
        isOwnMessage ? "justify-content-end" : "justify-content-start"
      }`}
    >
      {!isOwnMessage && (
        <div className="me-2 d-flex flex-column align-items-center">
          <Avatar imageUrl={""} title={message.user?.name} size={30} />
        </div>
      )}
      {isOwnMessage && (
        <div
          onClick={() => dispatch(setReply(message))}
          className="position-relative action-menu-icon d-flex h-100 align-items-center me-2"
        >
          <LuCircleChevronDown color="gray" size={16} />
        </div>
      )}
      <div
        className={`position-relative message-bubble ${
          isOwnMessage ? "bg-whatsapp-own" : "bg-whatsapp-other"
        }`}
        style={{
          padding: "6px 12px 6px 8px",
          maxWidth: "75%",
          borderRadius: "10px",
          boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
          wordBreak: "break-word",
        }}
      >
        {!isOwnMessage && (
          <div className="fw-semibold small text-primary">
            {message.user?.name}
          </div>
        )}

        {/* Media content based on type */}
        {hasMedia && (
          <div className="message-media ">
            {message.media.type === "IMAGE" && (
              <div
                className="cursor-pointer"
                onClick={() =>
                  handleMediaClick({
                    type: message.media.type,
                    url: message.media.url,
                    name: message.media.name,
                  })
                }
              >
                <img
                  src={message.media.thumbnailUrl}
                  alt={message.media.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px" }}
                />
              </div>
            )}

            {message.media.type === "VIDEO" && (
              <div
                className="cursor-pointer position-relative"
                onClick={() =>
                  handleMediaClick({
                    type: message.media.type,
                    url: message.media.url,
                    name: message.media.name,
                  })
                }
              >
                <img
                  src={message.media.thumbnailUrl}
                  alt={message.media.name}
                  className="img-fluid rounded"
                  style={{ maxHeight: "200px" }}
                />
                <div className="position-absolute top-50 start-50 translate-middle">
                  <div
                    className="bg-dark bg-opacity-50 rounded-circle d-flex justify-content-center align-items-center"
                    style={{ width: "40px", height: "40px" }}
                  >
                    <IoPlay color="white" size={20} />
                  </div>
                </div>
              </div>
            )}

            {(message.media.type === "PDF" ||
              message.media.type === "DOCUMENT") && (
              <div
                className="d-flex align-items-center p-2 px-3 bg-light rounded cursor-pointer"
                onClick={() =>
                  handleMediaClick({
                    type: message.media.type,
                    url: message.media.url,
                    name: message.media.name,
                  })
                }
              >
                <FaRegFilePdf size={24} className="me-2 text-primary" />
                <div className="text-truncate">
                  {decodeURIComponent(message.media.name)}
                </div>
              </div>
            )}
          </div>
        )}

        <div className="text-body d-flex">
          {message.messageText}

          {/* Timestamp and delivery status */}
          <div
            className="d-flex ps-3 mt-auto ms-auto justify-content-end align-items-end gap-1"
            style={{ fontSize: "0.65rem", minWidth: "2.5rem" }}
          >
            <span className="text-muted text-sm">{messageTime}</span>
            {isOwnMessage && (
              <span>
                {allRead ? (
                  <IoCheckmarkDone color="#4fc3f7" size={13} />
                ) : allDelivered ? (
                  <IoCheckmarkDone color="#9e9e9e" size={13} />
                ) : (
                  <IoCheckmarkDone color="#9e9e9e" size={13} />
                )}
              </span>
            )}
          </div>
        </div>
      </div>
      {!isOwnMessage && (
        <div
          onClick={() => dispatch(setReply(message))}
          className="action-menu-icon d-flex h-100 align-items-center ms-2"
        >
          <LuCircleChevronDown color="gray" size={16} />
        </div>
      )}
    </div>
  );
};

export default MessageItem;

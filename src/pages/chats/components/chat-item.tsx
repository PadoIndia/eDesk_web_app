import Avatar from "../../../components/avatar";
import { ChatItem as ChatItemType } from "../../../types/chat";
import { format } from "date-fns";
import { Colors } from "../../../utils/constants";

interface Props {
  chat: ChatItemType;
  onClick: () => void;
}

const ChatItem = ({ chat, onClick }: Props) => {
  return (
    <div onClick={onClick} className="chat-item d-flex align-items-center p-3">
      <div className="avatar me-3">
        <Avatar imageUrl={chat.thumbnailImageUrl} title={chat.title} />
      </div>
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-center">
          <span
            className="mb-0 text-truncate"
            style={{
              maxWidth: "60ch",
              color: Colors.text.title,
            }}
          >
            {chat.title}
          </span>
          <small style={{ color: "#8696a0" }}>
            {" "}
            {chat.latestMessage &&
              format(new Date(chat.latestMessage.sentAt), "HH:mm")}
          </small>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <p
            className="small mb-0 text-truncate"
            style={{
              maxWidth: "80%",
              color: Colors.text.description,
            }}
          >
            {chat.latestMessage?.messageText || ""}
            {chat.latestMessage?.media && (
              <span className="ms-1">[{chat.latestMessage.media.type}]</span>
            )}
          </p>
          {chat.unreadCount > 0 && (
            <span
              className="badge rounded-pill"
              style={{
                backgroundColor: Colors.lightPrimary,
                color: Colors.primary,
              }}
            >
              {chat.unreadCount}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatItem;

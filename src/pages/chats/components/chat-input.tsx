import { FaTimes } from "react-icons/fa";
import { FaImage, FaFilePdf, FaFile } from "react-icons/fa";
import { Colors } from "../../../utils/constants";
import { MediaType, MessageResp } from "../../../types/chat";
import { useAppDispatch } from "../../../store/store";
import { setReply } from "../../../features/reply-slice";
import { MdAdd } from "react-icons/md";
import { ChangeEvent, useRef } from "react";
import { generateSHA256 } from "../../../utils/helper";
import uploadService from "../../../services/api-services/upload-service";
import { setMediaData } from "../../../features/media-slice";
import { MediaReducer } from "../../../types/features";

type Props = {
  chatId: number;
  replyMessage: MessageResp | null;
  onMessageSend: (messageText: string, mediaId: number | null) => void;
};

const ChatInput = ({ replyMessage, chatId, onMessageSend }: Props) => {
  const dispatch = useAppDispatch();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const onCancelReply = () => {
    dispatch(setReply(null));
  };

  const renderMediaIcon = (type: MediaType) => {
    switch (type) {
      case "IMAGE":
      case "VIDEO":
        return <FaImage size={16} style={{ color: "#8696a0" }} />;
      case "PDF":
        return <FaFilePdf size={16} style={{ color: "#8696a0" }} />;
      case "DOCUMENT":
        return <FaFile size={16} style={{ color: "#8696a0" }} />;
      default:
        return null;
    }
  };

  const onFileSelect = () => {
    fileInputRef.current?.click();
  };

  const onMediaUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const type = file.type.split("/")[0].toUpperCase();
      dispatch(
        setMediaData({
          chatId,
          type: type.toLowerCase() as MediaReducer["type"],
          files: [file],
        })
      );
      const hash = await generateSHA256(file);
      if (hash) {
        uploadService
          .checkHash({ hash, type, mimeType: file.type })
          .then((res) => {
            if (res.status === "success" && res.data) {
              onMessageSend("", res.data.id);
            } else {
              uploadService.uploadFile([{ image: file, hash }]).then((res) => {
                if (res.status === "success") {
                  onMessageSend("", res.data[0].id);
                }
              });
            }
          });
      }
    }
    // Reset file input value to allow selecting the same file again
    if (e.target) {
      e.target.value = "";
    }
  };

  return (
    <div className="chat-input position-absolute bottom-0 start-0 end-0 p-2 px-3">
      {replyMessage && (
        <div
          className="reply-preview position-absolute start-0 end-0 p-2 px-3"
          style={{
            bottom: "100%",
            backgroundColor: "#fff",
            animation: "slideIn 0.3s ease-out",
          }}
        >
          <div
            style={{
              backgroundColor: "#f9f9f9",
              padding: "0.5rem",
              borderLeft: `4px solid ${Colors.primary}`,
            }}
            className="d-flex rounded justify-content-between align-items-start"
          >
            <div>
              <div style={{ color: Colors.primary, fontSize: "0.875rem" }}>
                {replyMessage.userId ? replyMessage.user.name : "You"}
              </div>
              <div className="d-flex align-items-center gap-2">
                {replyMessage.media && renderMediaIcon(replyMessage.media.type)}
                <span style={{ color: "#8696a0", fontSize: "0.875rem" }}>
                  {replyMessage.messageText ||
                    replyMessage.media?.name ||
                    "Media"}
                </span>
              </div>
            </div>
            <FaTimes
              className="cursor-pointer"
              style={{ color: "#8696a0" }}
              size={16}
              onClick={onCancelReply}
            />
          </div>
        </div>
      )}
      <div className="d-flex align-items-center gap-3">
        <div className="position-relative flex-grow-1">
          <MdAdd
            className="position-absolute cursor-pointer"
            style={{
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: Colors.text.title,
            }}
            size={20}
            onClick={onFileSelect}
          />
          <input
            type="text"
            className="form-control py-3 px-2"
            placeholder="Type a message"
            style={{
              borderRadius: "0.75rem",
              border: "none",
              paddingLeft: "45px",
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onMessageSend(e.currentTarget.value, null);
                e.currentTarget.value = "";
              }
            }}
          />
          <input
            type="file"
            ref={fileInputRef}
            style={{ display: "none" }}
            accept="image/*,video/*,application/pdf,.doc,.docx,.txt,.rtf"
            onChange={onMediaUpload}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatInput;

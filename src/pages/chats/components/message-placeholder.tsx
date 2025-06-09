import { IoTime, IoPlay } from "react-icons/io5";
import { FaRegFilePdf } from "react-icons/fa";
import { useAppSelector } from "../../../store/store";
import { format } from "date-fns";

type Props = {
  chatId: number;
};

const MessagePlaceholder = ({ chatId }: Props) => {
  const data = useAppSelector((s) => s.mediaReducer[chatId]?.data);
  const files = useAppSelector((s) => s.mediaReducer[chatId]?.files);
  const type = useAppSelector((s) => s.mediaReducer[chatId]?.type);

  const currentTime = format(new Date(), "HH:mm");
  const blurredImageUrl =
    "https://img.freepik.com/free-vector/white-blurred-background_1034-249.jpg";

  if (!data && (!files || files.length === 0)) {
    return null;
  }

  const placeholderCount = type === "text" ? 1 : files?.length || 1;

  const placeholderMessages = Array.from(
    { length: placeholderCount },
    (_, index) => (
      <div key={index} className="message-item d-flex mb-2 justify-content-end">
        <div
          className="position-relative message-bubble bg-whatsapp-own"
          style={{
            padding: "6px 12px 6px 8px",
            maxWidth: "75%",
            borderRadius: "10px",
            boxShadow: "0 1px 1px rgba(0, 0, 0, 0.1)",
            wordBreak: "break-word",
            opacity: 0.7,
          }}
        >
          {type !== "text" && (
            <div
              className="spinner-border position-absolute top-50 start-50"
              style={{ translate: "-50% -50%" }}
              role="status"
            />
          )}
          {type === "image" && (
            <div className="message-media">
              <div className="cursor-pointer">
                <img
                  src={blurredImageUrl}
                  alt="Sending image..."
                  className="img-fluid rounded"
                  style={{
                    maxHeight: "230px",
                  }}
                />
              </div>
            </div>
          )}

          {type === "video" && (
            <div className="message-media">
              <div className="cursor-pointer position-relative">
                <img
                  src={blurredImageUrl}
                  alt="Sending video..."
                  className="img-fluid rounded"
                  style={{
                    maxHeight: "200px",
                    filter: "blur(2px)",
                  }}
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
            </div>
          )}

          {type === "pdf" && (
            <div className="message-media">
              <div className="d-flex align-items-center p-2 px-3 bg-light rounded cursor-pointer">
                <FaRegFilePdf size={24} className="me-2 text-primary" />
                <div className="text-truncate">
                  {files[index]?.name || "Document"}
                </div>
              </div>
            </div>
          )}

          {type === "text" && (
            <div className="text-body d-flex">
              {data?.text || "Sending message..."}

              <div
                className="d-flex ps-3 mt-auto ms-auto justify-content-end align-items-end gap-1"
                style={{ fontSize: "0.65rem", minWidth: "2.5rem" }}
              >
                <span className="text-muted text-sm">{currentTime}</span>
                <span>
                  <IoTime color="#9e9e9e" size={13} />
                </span>
              </div>
            </div>
          )}

          {type !== "text" && (
            <div
              className="d-flex ps-3 mt-auto ms-auto justify-content-end align-items-end gap-1"
              style={{ fontSize: "0.65rem", minWidth: "2.6rem" }}
            >
              <span className="text-muted text-sm">{currentTime}</span>
              <span>
                <IoTime color="#9e9e9e" size={13} />
              </span>
            </div>
          )}
        </div>
      </div>
    )
  );

  return <>{placeholderMessages}</>;
};

export default MessagePlaceholder;

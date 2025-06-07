import { FaEllipsisVertical } from "react-icons/fa6";
import Avatar from "../../../components/avatar";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { toast } from "react-toastify";
import { getAllChats, updateChatStatus } from "../../../features/chat-slice";
import chatService from "../../../services/api-services/chat-service";
import { MdClose } from "react-icons/md";
import { CiSaveUp2, CiUndo, CiUnlock } from "react-icons/ci";
import { useState } from "react";
import Modal from "../../../components/ui/modals";
import ChatInfo from "./chat-info";

const ChatHeader = () => {
  const chat = useAppSelector((s) => s.chatReducer.chatDetails);
  const userId = useAppSelector((s) => s.auth.userData?.user.id);
  const dispatch = useAppDispatch();
  const createdById = useAppSelector(
    (state) => state.chatReducer.chatDetails?.createdById
  );
  const user = chat?.participants.find((p) => p.user.id == userId);
  const isAdmin = user?.isAdmin;
  const requiresSubmit = chat?.requiresSubmit;
  const status = chat?.status;
  const [showInfo, setShowInfo] = useState(false);

  const handleMarkDone = (status: "SUBMITTED" | "OPEN") => {
    if (isAdmin) {
      chatService.updateChat(chat!.id, { status }).then((res) => {
        if (res.status == "success") {
          dispatch(updateChatStatus(status));
          dispatch(getAllChats("TASK"));
        } else toast.error(res.message);
      });
    }
  };

  const handleMarkClosed = () => {
    if (!chat?.id) return;
    if ((isAdmin && requiresSubmit) || createdById == userId) {
      chatService.updateChat(chat.id, { status: "CLOSED" }).then((res) => {
        if (res.status == "success") {
          dispatch(updateChatStatus("CLOSED"));
          dispatch(getAllChats("TASK"));
        } else toast.error(res.message);
      });
    }
  };

  const handleReopen = () => {
    if (!chat?.id) return;
    if (createdById == userId && status == "CLOSED") {
      chatService.updateChat(chat.id, { status: "OPEN" }).then((res) => {
        if (res.status == "success") {
          dispatch(updateChatStatus("OPEN"));
          dispatch(getAllChats("TASK"));
        } else toast.error(res.message);
      });
    }
  };

  const menuOptions = () => {
    const options = [];
    if (status == "SUBMITTED") {
      options.push({
        label: "Undo Submit",
        icon: <CiUndo size={18} />,

        onClick: () => handleMarkDone("OPEN"),
      });
      if (createdById == userId) {
        options.push({
          label: "Close",
          icon: <MdClose size={18} />,

          onClick: handleMarkClosed,
        });
      }
    } else if (status == "OPEN" || status == "ACTIVE") {
      if (isAdmin && requiresSubmit) {
        options.push({
          label: "Submit",
          icon: <CiSaveUp2 size={18} />,
          onClick: () => handleMarkDone("SUBMITTED"),
        });
      }
      if (createdById == userId || (isAdmin && !requiresSubmit)) {
        options.push({
          label: "Close",
          icon: <MdClose size={18} />,
          onClick: handleMarkClosed,
        });
      }
    } else if (status == "CLOSED") {
      if (createdById == userId) {
        options.push({
          label: "Reopen",
          icon: <CiUnlock size={18} />,
          onClick: handleReopen,
        });
      }
    }
    return options;
  };

  const allOptions = menuOptions();

  if (!chat) return null;
  return (
    <div className="chat-header d-flex align-items-center justify-content-between p-3 ">
      {showInfo && (
        <Modal
          showCloseIcon
          isOpen={showInfo}
          title={chat.title}
          onClose={() => setShowInfo(false)}
        >
          <ChatInfo />
        </Modal>
      )}
      <div className="d-flex align-items-center">
        <Avatar title={chat?.title || ""} imageUrl={chat?.thumbnailImageUrl} />
        <div className="ms-3">
          <h6
            onClick={() => setShowInfo(true)}
            className="mb-0 text-truncate"
            style={{ maxWidth: "100ch" }}
          >
            {chat?.title}
          </h6>
          <small style={{ color: "#8696a0" }}>
            {chat?.participants.length} participants
          </small>
        </div>
      </div>
      {allOptions.length > 0 && (
        <div className="d-flex position-relative align-items-center gap-4">
          <div className="dropdown">
            <button
              className="btn btn-body border-0"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              <FaEllipsisVertical
                className="cursor-pointer"
                style={{ color: "#8696a0" }}
                size={16}
              />
            </button>
            <ul
              style={{
                width: "250px",
                boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              }}
              className="dropdown-menu rounded bg-white shadow"
            >
              <div className="d-flex flex-column gap-2 p-1">
                {allOptions.map((opt) => (
                  <li>
                    <button
                      onClick={opt.onClick}
                      className="dropdown-item d-flex gap-1 align-items-center border-0 btn"
                    >
                      {opt.icon}
                      {opt.label}
                    </button>
                  </li>
                ))}
              </div>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;

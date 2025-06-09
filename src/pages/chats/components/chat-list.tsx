import { FaSearch } from "react-icons/fa";
import ChatItem from "./chat-item";
import { useCallback, useEffect, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import {
  getAllChats,
  getChatDetails,
  updateLatestMessage,
  updateMessageSeen,
} from "../../../features/chat-slice";
import useSocket from "../../../hooks/useSocket";
import { ChatUpdated } from "../../../types/socket";
import { addMessage } from "../../../features/message-slice";
import { ChatStatus } from "../../../types/chat";

const ChatList = () => {
  const chats = useAppSelector((s) => s.chatReducer.taskChats) || [];
  const [search, setSearch] = useState("");
  const dispatch = useAppDispatch();
  const userId = useAppSelector((s) => s.auth.userData?.user.id);
  const socket = useSocket();
  const [activeTab, setActiveTab] = useState<ChatStatus>("OPEN");
  const openRef = useRef<HTMLDivElement>(null);
  const closedRef = useRef<HTMLDivElement>(null);
  const submittedRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    dispatch(getAllChats("TASK"));
  }, []);

  const handleChatClick = useCallback((id: number) => {
    dispatch(getChatDetails(id));
    dispatch(updateMessageSeen({ chatId: id, type: "TASK" }));
  }, []);

  useEffect(() => {
    if (socket && userId) {
      socket.on("chatUpdated", (data: ChatUpdated) => {
        const isSelf = data.latestMessage.createdById === userId;
        dispatch(addMessage(data.msg));
        dispatch(updateLatestMessage({ ...data, isSelf }));
      });

      return () => {
        socket?.off("chatUpdated");
      };
    }
  }, [socket, userId]);

  const filteredChats = chats.filter(
    (chat) =>
      chat.title.toLowerCase().includes(search.toLowerCase()) &&
      chat.status === activeTab
  );

  return (
    <div className="chat-list" style={{ width: "380px", height: "100vh" }}>
      <div className="p-2" style={{ backgroundColor: "#fff" }}>
        <div className="chat-tabs">
          <div
            ref={openRef}
            onClick={() => setActiveTab("OPEN")}
            className={activeTab === "OPEN" ? "active" : ""}
          >
            Open
          </div>
          <div
            ref={submittedRef}
            onClick={() => setActiveTab("SUBMITTED")}
            className={activeTab === "SUBMITTED" ? "active" : ""}
          >
            Submitted
          </div>
          <div
            ref={closedRef}
            onClick={() => setActiveTab("CLOSED")}
            className={activeTab === "CLOSED" ? "active" : ""}
          >
            Closed
          </div>
          <div
            className="transition rounded-pill"
            style={{
              position: "absolute",
              height: "90%",
              transform: `translateX(${
                activeTab === "OPEN"
                  ? "0%"
                  : activeTab === "SUBMITTED"
                  ? "100%"
                  : "203%"
              })`,
              zIndex: 0,
              width: "33%",
              backgroundColor: "#e6eef9",
            }}
          />
        </div>
        <div className="position-relative">
          <input
            type="search"
            className="form-control ps-5"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search or start new chat"
            style={{
              backgroundColor: "#f5f5f5",
              border: "none",
              borderRadius: "8px",
            }}
          />
          <FaSearch
            className="position-absolute"
            style={{
              left: "15px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#8696a0",
            }}
            size={14}
          />
        </div>
      </div>
      <div
        className="chat-list-items overflow-auto"
        style={{ height: "calc(100vh - 123px)" }}
      >
        {filteredChats.map((chat) => (
          <ChatItem
            key={chat.id}
            chat={chat}
            onClick={() => handleChatClick(chat.id)}
          />
        ))}
      </div>
    </div>
  );
};

export default ChatList;

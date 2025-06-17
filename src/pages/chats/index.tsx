import Sidebar from "./components/chat-sidebar";
import ChatList from "./components/chat-list";
import { useAppSelector } from "../../store/store";
import { lazy } from "react";
const ChatScreen = lazy(() => import("./components/chat-screen"));

const Chats = () => {
  const chatId = useAppSelector((s) => s.chatReducer.chatDetails?.id);

  console.log("ChatId", chatId);

  return (
    <div className="chat-container d-flex h-100 overflow-hidden">
      <Sidebar />
      <ChatList />
      <div className="chat-main position-relative flex-grow-1 d-flex flex-column">
        {chatId ? (
          <ChatScreen id={chatId} />
        ) : (
          <div className="d-flex h-100 w-100 text-muted flex-column justify-content-center align-items-center">
            <span>Send and recieve messages using eDesk</span>
            <span>Assign and track tasks with messages</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chats;

import React, { useState } from "react";
import { WpCog, WpMessages } from "../../../utils/icons";
import { FaPlusCircle, FaUserCircle } from "react-icons/fa";
import Modal from "../../../components/ui/modals";
import { useAppDispatch } from "../../../store/store";
import { getAllChats } from "../../../features/chat-slice";
import { MdHome } from "react-icons/md";

const CreateTaskForm = React.lazy(() => import("./create-task-form"));

const Sidebar = () => {
  const [showTaskModal, setShowTaskModal] = useState(false);
  const dispatch = useAppDispatch();

  const onSuccess = () => {
    dispatch(getAllChats("TASK"));
    setShowTaskModal(false);
  };

  return (
    <div
      className="chat-sidebar d-flex flex-column align-items-center justify-content-between"
      style={{ width: "4.2857rem", padding: "1rem" }}
    >
      <Modal
        isOpen={showTaskModal}
        onClose={() => setShowTaskModal(false)}
        title="Create Task"
      >
        <CreateTaskForm onSuccess={onSuccess} />
      </Modal>
      <div
        className="d-flex flex-column align-items-center my-3"
        style={{ rowGap: "1.75rem" }}
      >
        <div className="sidebar-icon is-active">
          <WpMessages size={24} className="text-light cursor-pointer" />
        </div>
        <div className="sidebar-icon">
          <a href="/">
            <MdHome size={24} className="text-secondary cursor-pointer" />
          </a>
        </div>
        <div className="sidebar-icon">
          <FaPlusCircle
            onClick={() => setShowTaskModal(true)}
            size={24}
            className="text-dark opacity-75  cursor-pointer"
          />
        </div>
      </div>
      <div className="d-flex flex-column gap-4 mb-2">
        <div className="sidebar-icon">
          <WpCog size={24} className="text-light cursor-pointer" />
        </div>

        <div className="sidebar-icon">
          <div
            className="rounded-circle d-flex justify-content-center align-items-center overflow-hidden cursor-pointer"
            style={{
              width: "28px",
              height: "28px",
              backgroundColor: "#6a7175",
            }}
          >
            <FaUserCircle size={28} className="text-light" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

import { WpCog, WpMessages, WpPeople } from "../../../utils/icons";
import { FaUserCircle } from "react-icons/fa";

const Sidebar = () => {
  return (
    <div
      className="chat-sidebar d-flex flex-column align-items-center justify-content-between"
      style={{ width: "4.2857rem", padding: "1rem" }}
    >
      <div
        className="d-flex flex-column align-items-center my-3"
        style={{ rowGap: "1.75rem" }}
      >
        <div className="sidebar-icon is-active">
          <WpMessages size={24} className="text-light cursor-pointer" />
        </div>
        <div className="sidebar-icon">
          <WpPeople
            size={24}
            className="text-light opacity-75  cursor-pointer"
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

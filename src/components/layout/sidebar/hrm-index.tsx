// hrm-index.tsx sidebar to be used in the hrm-app.tsx file
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { FaCalendarAlt, FaClock, FaBars, FaTimes, FaUsers } from "react-icons/fa";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to close sidebar when a nav link is clicked
  const handleNavClick = () => {
    setIsOpen(false);
  };

  return (
    <div
      className="position-fixed vh-100 border-end bg-white"
      style={{
        width: isOpen ? "250px" : "60px",
        transition: "width 0.3s ease-in-out",
        top: 0,
        left: 0,
        zIndex: 1000,
        paddingTop: "80px",
      }}
    >
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn position-absolute d-flex align-items-center justify-content-center bg-white border rounded"
        style={{
          right: "-16px",
          top: "60px",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          zIndex: 1100,
        }}
      >
        {isOpen ? <FaTimes size={16} /> : <FaBars size={16} />}
      </button>

      <div className="p-2">
        <nav className="d-flex flex-column gap-2">
          <NavLink
            to="/hrm/leave"
            className="btn shadow-none border-0 text-dark py-3 d-flex align-items-center"
            style={{
              justifyContent: isOpen ? "flex-start" : "center",
              backgroundColor: "transparent",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
            onClick={handleNavClick}  // Added onClick handler
          >
            <FaCalendarAlt className="fs-5" style={{ marginRight: "12px" }} />
            <span
              style={{
                opacity: isOpen ? 1 : 0,
                width: isOpen ? "auto" : 0,
                transition: "opacity 0.2s ease-in-out, width 0.2s ease-in-out",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              Leave
            </span>
          </NavLink>

          <NavLink
            to="/hrm/attendance"
            className="btn shadow-none border-0 text-dark py-3 d-flex align-items-center"
            style={{
              justifyContent: isOpen ? "flex-start" : "center",
              backgroundColor: "transparent",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
            onClick={handleNavClick}  // Added onClick handler
          >
            <FaClock className="fs-5" style={{ marginRight: "12px" }} />
            <span
              style={{
                opacity: isOpen ? 1 : 0,
                width: isOpen ? "auto" : 0,
                transition: "opacity 0.2s ease-in-out, width 0.2s ease-in-out",
                overflow: "hidden",
                whiteSpace: "nowrap",
              }}
            >
              Attendance
            </span>
          </NavLink>
          <NavLink
            to="/hrm/department-management"
            className="text-decoration-none text-dark"
            onClick={handleNavClick}  // Added onClick handler
          >
            <div
              className="d-flex align-items-center p-3 rounded"
              style={{
                transition: "all 0.2s",
                justifyContent: isOpen ? "flex-start" : "center",
              }}
            >
              <FaUsers className="fs-5" style={{ minWidth: "24px" }} />
              <span
                className="ms-2"
                style={{
                  opacity: isOpen ? 1 : 0,
                  width: isOpen ? "auto" : 0,
                  overflow: "hidden",
                  transition: "opacity 0.2s, width 0.2s",
                  whiteSpace: "nowrap",
                }}
              >
                Departments
              </span>
            </div>
          </NavLink>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
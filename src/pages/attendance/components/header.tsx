import React from "react";
import { FaUser, FaUserShield, FaClipboardList, FaBuilding } from "react-icons/fa";
import { AttendanceUser, Punch } from "../../../types/attendance.types";

interface DashboardHeaderProps {
  currentUser: AttendanceUser;
  currentView?: "department" | "requests";
  setCurrentView?: (view: "department" | "requests") => void;
  filteredRequests?: Punch[];
  isCardHeader?: boolean;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
  currentUser,
  currentView,
  setCurrentView,
  filteredRequests = [],
  isCardHeader = false
}) => {
  // Main welcome header
  if (!isCardHeader) {
    return (
      <div className="alert alert-primary d-flex align-items-center mb-4">
        <FaUserShield className="me-2" size={24} />
        <div>
          <strong>Welcome, {currentUser.name}!</strong>
          <span className="ms-2">
            {currentUser.isAdmin
              ? `Managing ${currentUser.department} department`
              : "Viewing your attendance records"}
          </span>
        </div>
      </div>
    );
  }
  
  // Card header with navigation tabs
  return (
    <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
      <h3 className="mb-0 d-flex align-items-center gap-3">
        {currentUser?.isAdmin ? (
          <>
            <FaBuilding className="me-2" />
            {currentView === "department"
              ? "Department Attendance"
              : "Miss Punch Requests"}
          </>
        ) : (
          <>
            <FaUser className="me-2" />
            My Attendance
          </>
        )}
      </h3>

      {currentUser?.isAdmin && setCurrentView && (
        <div className="d-flex gap-2">
          <button
            className={`btn ${
              currentView === "department" ? "btn-light" : "btn-outline-light"
            }`}
            onClick={() => setCurrentView("department")}
          >
            <FaBuilding className="me-1" /> Department
          </button>
          <button
            className={`btn ${
              currentView === "requests" ? "btn-light" : "btn-outline-light"
            }`}
            onClick={() => setCurrentView("requests")}
            style={{ position: "relative" }}
          >
            <FaClipboardList className="me-1" /> Requests
            {filteredRequests.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {filteredRequests.length}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardHeader;
import React from "react";
import { FaClipboardList, FaBuilding } from "react-icons/fa";

interface Props {
  currentView?: "attendance" | "users-attendance" | "punch-requests";
  setCurrentView?: (
    view: "attendance" | "users-attendance" | "punch-requests"
  ) => void;
  punchRequestsCount?: number;
  isAdmin: boolean;
}

const DashboardHeader: React.FC<Props> = React.memo(
  ({ currentView, isAdmin, setCurrentView, punchRequestsCount = 0 }) => {
    return (
      <div className="bg-white shadow-md b card mb-2 rounded-md text-white p-3 d-flex gap-2">
        {setCurrentView && (
          <div className="d-flex gap-2">
            <button
              className={`btn ${
                currentView === "attendance"
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setCurrentView("attendance")}
            >
              <FaBuilding className="me-1" /> Attendance
            </button>
            {isAdmin && (
              <>
                <button
                  className={`btn ${
                    currentView === "users-attendance"
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setCurrentView("users-attendance")}
                >
                  <FaBuilding className="me-1" /> Users Attendance
                </button>
                <button
                  className={`btn ${
                    currentView === "punch-requests"
                      ? "btn-primary"
                      : "btn-outline-secondary"
                  }`}
                  onClick={() => setCurrentView("punch-requests")}
                  style={{ position: "relative" }}
                >
                  <FaClipboardList className="me-1" /> Punch Requests
                  {punchRequestsCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {punchRequestsCount}
                      <span className="visually-hidden">pending requests</span>
                    </span>
                  )}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    );
  }
);

DashboardHeader.displayName = "DashboardHeader";

export default DashboardHeader;

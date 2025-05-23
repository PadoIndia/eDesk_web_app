import React, { useCallback } from "react";
import {
  FaUser,
  FaUserShield,
  FaClipboardList,
  FaBuilding,
} from "react-icons/fa";
import { AttendanceUser, Punch } from "../../../types/attendance.types";

interface DashboardHeaderProps {
  currentUser: AttendanceUser;
  currentView?: "department" | "requests";
  setCurrentView?: (view: "department" | "requests") => void;
  filteredRequests?: Punch[];
  isCardHeader?: boolean;
  selectedMonth?: number;
  selectedYear?: number;
  setSelectedMonth?: (month: number) => void;
  setSelectedYear?: (year: number) => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = React.memo(
  ({
    currentUser,
    currentView,
    setCurrentView,
    filteredRequests = [],
    isCardHeader = false,
    selectedMonth,
    selectedYear,
    setSelectedMonth,
    setSelectedYear,
  }) => {
    // Event handlers with useCallback to prevent unnecessary re-renders
    const handleDepartmentView = useCallback(() => {
      if (setCurrentView) setCurrentView("department");
    }, [setCurrentView]);

    const handleRequestsView = useCallback(() => {
      if (setCurrentView) setCurrentView("requests");
    }, [setCurrentView]);

    // Calculate values directly without memoization
    const departmentNames = currentUser.departments && currentUser.departments.length > 0
      ? currentUser.departments.map((dept) => dept.name).join(", ")
      : currentUser.department || "Not Assigned";

    const pendingCount = filteredRequests.filter(
      (req) => req.isApproved === null || req.isApproved === undefined
    ).length;

    // Main welcome header
    if (!isCardHeader) {
      const departmentCount = currentUser.departments?.length || 0;
      const departmentCountText = departmentCount > 1 ? "s" : "";

      return (
        <div className="alert alert-primary d-flex align-items-center mb-4">
          <FaUserShield className="me-2" size={24} />
          <div>
            <strong>Welcome, {currentUser.name}!</strong>
            <span className="ms-2">
              {currentUser.isAdmin
                ? `Managing ${departmentNames} department${departmentCountText}`
                : "Viewing your attendance records"}
            </span>
          </div>
        </div>
      );
    }

    // Determine header content
    let headerTitle: string;
    let headerIcon: React.ReactElement;

    if (currentUser.isAdmin) {
      headerTitle = currentView === "department" 
        ? "Department Attendance" 
        : "Miss Punch Requests";
      headerIcon = currentView === "department" 
        ? <FaBuilding className="me-2" />
        : <FaClipboardList className="me-2" />;
    } else {
      headerTitle = "My Attendance";
      headerIcon = <FaUser className="me-2" />;
    }

    // Card header with navigation tabs
    return (
      <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
        <h3 className="mb-0 d-flex align-items-center gap-3">
          {headerIcon}
          {headerTitle}
        </h3>

        <div className="d-flex align-items-center gap-2">
          {/* Month Picker */}
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth?.(+e.target.value)}
            className="form-select form-select-sm"
          >
            {Array.from({length: 12}).map((_, i) => (
              <option key={i+1} value={i+1}>
                {new Date(0, i).toLocaleString('default', {month: 'long'})}
              </option>
            ))}
          </select>

          {/* Year Picker */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear?.(+e.target.value)}
            className="form-select form-select-sm"
          >
            {Array.from({length: 10}, (_, i) => new Date().getFullYear() - 5 + i).map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {currentUser.isAdmin && setCurrentView && (
          <div className="d-flex gap-2">
            <button
              className={`btn ${
                currentView === "department" ? "btn-light" : "btn-outline-light"
              }`}
              onClick={handleDepartmentView}
            >
              <FaBuilding className="me-1" /> Department
            </button>
            <button
              className={`btn ${
                currentView === "requests" ? "btn-light" : "btn-outline-light"
              }`}
              onClick={handleRequestsView}
              style={{ position: "relative" }}
            >
              <FaClipboardList className="me-1" /> Requests
              {pendingCount > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {pendingCount}
                  <span className="visually-hidden">pending requests</span>
                </span>
              )}
            </button>
          </div>
        )}
      </div>
    );
  }
);

DashboardHeader.displayName = "DashboardHeader";

export default DashboardHeader;
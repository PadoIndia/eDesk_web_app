import React, { useState } from "react";
import UserAttendanceTable from "./user-attendance-table";
import { FaFilter, FaSearch, FaCalendarAlt, FaRegCalendarAlt as FaCalendarYear } from "react-icons/fa";

// Define interfaces
interface Punch {
  id: number;
  userId: number;
  userName: string;
  userDepartment: string;
  date: string;
  time: string;
  type: "manual" | "auto";
  isApproved?: boolean;
  reason?: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectionReason?: string;
}

interface CallDetails {
  id: number;
  callDuration: number;
  missedCalls: number;
  incoming: number;
  outgoing: number;
  date: string;
}

interface ClassDetails {
  id: number;
  glcScheduled: number;
  glcTaken: number;
  oplcScheduled: number;
  oplcTaken: number;
  gdcScheduled: number;
  gdcTaken: number;
  opdcScheduled: number;
  opdcTaken: number;
  date: string;
}

interface AttendanceUser {
  id: number;
  name: string;
  department: string;
  isAdmin: boolean;
  punchData: Punch[];
  attendance: {
    status: string;
    statusManual: string;
    comment: string;
  };
  callDetails?: CallDetails[];
  classDetails?: ClassDetails[];
}

interface CalendarEvent {
  date: string;
  title: string;
  type: "holiday" | "event" | "meeting";
}

interface AttendanceTablesProps {
  users: AttendanceUser[];
  currentUser: AttendanceUser;
  currentView: "personal" | "department" | "requests";
  selectedMonth: number;
  selectedYear: number;
  selectedDate: string;
  onMissPunchRequest: (date: string) => void;
  onManualStatusChange: (
    userId: number,
    date: string,
    newStatus: string
  ) => void;
  isAdmin: boolean;
}

const AttendanceTables: React.FC<AttendanceTablesProps> = ({
  users,
  currentUser,
  currentView,
  selectedDate,
  onMissPunchRequest,
  onManualStatusChange,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState<number>(
    new Date().getMonth()
  );
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  // Mock calendar events - in a real app, this would come from your backend
  const calendarEvents: CalendarEvent[] = [
    {
      date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-01`,
      title: "Company Holiday",
      type: "holiday",
    },
    {
      date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-15`,
      title: "Team Meeting",
      type: "meeting",
    },
    {
      date: `${selectedYear}-${String(selectedMonth + 1).padStart(2, "0")}-20`,
      title: "Company Event",
      type: "event",
    },
  ];

  // Get unique departments for filtering
  const departments = [
    "All",
    ...Array.from(new Set(users.map((user) => user.department))),
  ];

  // Filter users based on search, department, and permissions
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "All" || user.department === filterDepartment;

    // For department view, only show users from current user's department
    if (currentView === "department") {
      return (
        matchesSearch &&
        matchesDepartment &&
        user.department === currentUser.department
      );
    }

    // For personal view, only show current user
    if (currentView === "personal") {
      return user.id === currentUser.id;
    }

    return matchesSearch && matchesDepartment;
  });

  return (
    <>
      {/* Search and filter - Only in department view */}
      { currentUser.isAdmin && (
        <div className="row mb-4">
          <div className="col-md-4">
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text">
                <FaFilter />
              </span>
              <select
                className="form-select"
                value={filterDepartment}
                onChange={(e) => setFilterDepartment(e.target.value)}
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-3">
            <div className="input-group">
              <span className="input-group-text">
                <FaCalendarAlt />
              </span>
              <select
                className="form-select"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              >
                {Array.from({ length: 12 }, (_, i) => (
                  <option key={i} value={i}>
                    {new Date(0, i).toLocaleString("default", {
                      month: "long",
                    })}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="col-md-2">
            <div className="input-group">
              <span className="input-group-text">
                <FaCalendarYear />
              </span>
              <select
                className="form-select"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              >
                {Array.from({ length: 10 }, (_, i) => {
                  const year = new Date().getFullYear() - 5 + i;
                  return (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Status Indicators */}
      <div className="mb-3 d-flex justify-content-end">
        <div className="d-flex align-items-center me-3">
          <span className="badge bg-warning me-1">&nbsp;</span>
          <small>Pending/Missing Punch</small>
        </div>
        <div className="d-flex align-items-center me-3">
          <span className="badge bg-success me-1">&nbsp;</span>
          <small>Approved Manual Punch</small>
        </div>
        <div className="d-flex align-items-center me-3">
          <span className="badge bg-danger me-1">&nbsp;</span>
          <small>Rejected Request/Absent</small>
        </div>
        <div className="d-flex align-items-center">
          <span className="badge bg-light text-dark me-1">&nbsp;</span>
          <small>Weekend/Holiday</small>
        </div>
      </div>

      {/* Individual User Tables */}
      {filteredUsers.length > 0 ? (
        filteredUsers.map((user) => (
          <UserAttendanceTable
            key={user.id}
            user={user}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedDate={selectedDate}
            calendarEvents={calendarEvents}
            onMissPunchRequest={onMissPunchRequest}
            isCurrentUser={user.id === currentUser.id}
            onManualStatusChange={onManualStatusChange}
            isAdmin={currentUser.isAdmin}
          />
        ))
      ) : (
        <div className="alert alert-info">
          No users found matching your search criteria.
        </div>
      )}
    </>
  );
};

export default AttendanceTables;

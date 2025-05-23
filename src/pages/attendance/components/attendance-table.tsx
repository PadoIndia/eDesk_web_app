import React from "react";
import UserAttendanceTable from "./user-attendance-table";
import { AttendanceUser, CalendarEvent } from "../../../types/attendance.types";

interface AttendanceTablesProps {
  users: AttendanceUser[];
  currentUser: AttendanceUser;
  selectedMonth: number;
  selectedYear: number;
  selectedDate: string;
  onMissPunchRequest: (date: string, userId: number) => void;
  onManualStatusChange: (userId: number, date: string, newStatus: string, comment:string) => void;
  isAdmin: boolean;
  currentView: "department" | "requests";
}

const AttendanceTables: React.FC<AttendanceTablesProps> = ({
  users,
  currentUser,
  selectedMonth,
  selectedYear,
  selectedDate,
  onMissPunchRequest,
  onManualStatusChange,
  isAdmin,
}) => {
  // Mock calendar events - should be moved to parent component or API
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

  

  return (
    <>
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
      {users.length > 0 ? (
        users.map((user) => (
          <UserAttendanceTable
            key={user.id}
            user={user}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            selectedDate={selectedDate}
            calendarEvents={calendarEvents}
            onMissPunchRequest={onMissPunchRequest} // Correctly passes the function
            isCurrentUser={user.id === currentUser.id}
            onManualStatusChange={onManualStatusChange}
            isAdmin={isAdmin}
          />
        ))
      ) : (
        <div className="alert alert-info">No users found.</div>
      )}
    </>
  );
};

export default AttendanceTables;
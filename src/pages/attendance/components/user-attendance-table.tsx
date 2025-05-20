import React from "react";
import {
  FaUser,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCalendarAlt,
} from "react-icons/fa";
import Badge from "../../../components/badge";
import {
  AttendanceUser,
  Punch,
  CalendarEvent,
} from "../../../types/attendance.types";

interface UserAttendanceTableProps {
  user: AttendanceUser;
  selectedMonth: number; // 0-11 format (JavaScript Date month)
  selectedYear: number;
  selectedDate: string;
  calendarEvents?: CalendarEvent[];
  onMissPunchRequest: (date: string) => void;
  isCurrentUser: boolean;
  onManualStatusChange?: (
    userId: number,
    date: string,
    newStatus: string
  ) => void;
  isAdmin: boolean;
}

const UserAttendanceTable: React.FC<UserAttendanceTableProps> = ({
  user,
  selectedMonth,
  selectedYear,
  // selectedDate,
  calendarEvents = [],
  onMissPunchRequest,
  isCurrentUser,
  onManualStatusChange,
  isAdmin,
}) => {
  // Helper functions
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const formatTime = (hh: number, mm: number): string => {
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  };

  const getPunchesForDate = (day: number): Punch[] => {
    return user.punchData.filter(
      (punch) =>
        punch.date === day &&
        punch.month === selectedMonth + 1 && // API uses 1-12 format
        punch.year === selectedYear
    );
  };

  const calculateWorkingHours = (punches: Punch[]): string => {
    if (punches.length < 2) return "—";

    const sortedPunches = [...punches].sort((a, b) => {
      const timeA = a.hh * 60 + a.mm;
      const timeB = b.hh * 60 + b.mm;
      return timeA - timeB;
    });

    let totalMinutes = 0;
    for (let i = 0; i < sortedPunches.length; i += 2) {
      if (i + 1 < sortedPunches.length) {
        const inTime = sortedPunches[i];
        const outTime = sortedPunches[i + 1];
        totalMinutes +=
          outTime.hh * 60 + outTime.mm - (inTime.hh * 60 + inTime.mm);
      }
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getStatusForDate = (day: number): string => {
    const date = new Date(selectedYear, selectedMonth, day);
    const punches = getPunchesForDate(day);
    const today = new Date();

    // Format today for comparison
    const todayFormatted = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const dateFormatted = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate()
    );

    if (punches.length > 0) return "P";
    if (date.getDay() === 0 || date.getDay() === 6) return "W"; // Weekend

    // Check for holidays in calendar events
    const dateString = `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    if (
      calendarEvents.some((e) => e.date === dateString && e.type === "holiday")
    )
      return "H";

    // If date is in the future, return placeholder
    if (dateFormatted > todayFormatted) return "—";

    return "A"; // Absent
  };

  const getPunchApprovalIcon = (punch: Punch): React.ReactElement | null => {
    if (punch.type !== "MANUAL") return null;

    if (punch.isApproved === true) {
      return (
        <FaCheckCircle
          className="text-success ms-2"
          title={`Approved by ${punch.approvedBy || "Admin"} on ${
            punch.approvedOn || "N/A"
          }`}
        />
      );
    } else if (punch.isApproved === false) {
      return (
        <FaTimesCircle
          className="text-danger ms-2"
          title={`Rejected: ${punch.missPunchReason || "No reason provided"}`}
        />
      );
    } else {
      return (
        <FaHourglassHalf
          className="text-warning ms-2"
          title="Pending Approval"
        />
      );
    }
  };

  const getRowColorForDate = (day: number): string => {
    const punches = getPunchesForDate(day);

    if (punches.length === 0) {
      const status = getStatusForDate(day);
      if (status === "A") return "table-danger";
      if (status === "W" || status === "H") return "table-light";
      return "";
    }

    const hasPending = punches.some(
      (p) => p.type === "MANUAL" && p.isApproved === undefined
    );
    const hasRejected = punches.some(
      (p) => p.type === "MANUAL" && p.isApproved === false
    );
    const hasApproved = punches.some(
      (p) => p.type === "MANUAL" && p.isApproved === true
    );

    if (
      punches.length % 2 !== 0 &&
      !["BD", "Mentor", "Faculty"].includes(user.department)
    ) {
      return "table-warning";
    }
    if (hasPending) return "table-warning";
    if (hasRejected) return "table-danger";
    if (hasApproved) return "table-success";

    return "";
  };

  // Format date for display
  const formatDate = (day: number): string => {
    return `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
  };

  // Get day of week
  const getDayOfWeek = (date: Date): string => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  // Generate table rows
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="mb-5">
      <div className="d-flex align-items-center mb-3 bg-light p-3 rounded">
      <FaUser className="text-primary me-2" size={24} />
      <h4 className="mb-0">{user.name}</h4>
      <span className="badge bg-secondary ms-2">{user.department}</span>
      {user.isAdmin && <span className="badge bg-primary ms-2">Admin</span>}
      </div>

      <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
        <tr>
          <th className="text-center" style={{ width: "100px" }}>
          Date/Day
          </th>
          <th>Punch Data</th>
          <th className="text-center" style={{ width: "100px" }}>
          Working Hours
          </th>
          <th>Status</th>
          <th className="text-center" style={{ width: "100px" }}>
          Manual Status
          </th>
          <th className="text-center" style={{ width: "120px" }}>
          Actions
          </th>
        </tr>
        </thead>
        <tbody>
        {days.map((day) => {
          const date = formatDate(day);
          const dateObj = new Date(date);
          const dayOfWeek = getDayOfWeek(dateObj);
          const punches = getPunchesForDate(day);
          const calendarEvent = calendarEvents.find((e) => e.date === date);

          return (
          <tr key={date} className={getRowColorForDate(day)}>
            <td className="text-center">
            <div className="d-flex align-items-center justify-content-center">
              <span className="fw-bold me-1">{day}</span>
              <span className="text-muted">({dayOfWeek})</span>
              {calendarEvent && (
              <FaCalendarAlt 
                className={`ms-1 ${calendarEvent.type === "holiday" ? "text-danger" : "text-primary"}`}
                title={calendarEvent.title}
              />
              )}
            </div>
            </td>

            <td>
            {punches.length > 0 ? (
              <div className="d-flex flex-wrap gap-1">
              {punches.map((punch, index) => (
              <div
              key={punch.id}
              className="d-flex align-items-center p-1 bg-light rounded"
              style={{ minWidth: '100px', flex: '0 0 auto' }}
              title={`${index % 2 === 0 ? "IN" : "OUT"} - ${punch.type}`}
              >
              <span
                className={`me-2 ${
                punch.type === "MANUAL"
                ? "text-primary fw-bold"
                : ""
                }`}
              >
                {formatTime(punch.hh, punch.mm)}
              </span>
              {getPunchApprovalIcon(punch)}
              </div>
              ))}
              </div>
            ) : (
              <span className="text-muted">—</span>
            )}
            </td>

            <td className="text-center">
            {calculateWorkingHours(punches)}
            </td>

            <td className="text-center">
            <Badge
              label={getStatusForDate(day)}
              status={
              getStatusForDate(day) === "P"
                ? "SUCCESS"
                : getStatusForDate(day) === "A"
                ? "DANGER"
                : getStatusForDate(day) === "H"
                ? "PRIMARY"
                : "INFO"
              }
            />
            </td>

            <td className="text-center">
            {isAdmin && !isCurrentUser ? (
              <select
              className="form-select form-select-sm"
              onChange={(e) =>
                onManualStatusChange?.(user.id, date, e.target.value)
              }
              >
              <option value="">—</option>
              <option value="P">Present</option>
              <option value="A">Absent</option>
              <option value="L">Leave</option>
              </select>
            ) : (
              <span className="text-muted">—</span>
            )}
            </td>

            <td className="text-center">
            <button
              onClick={() => onMissPunchRequest(date)}
              title="Request Missing Punch"
            >
              <FaPlus className="me-1" />
              Miss Punch
            </button>
            </td>
          </tr>
          );
        })}
        </tbody>
      </table>
      </div>
    </div>
  );
};

export default UserAttendanceTable;

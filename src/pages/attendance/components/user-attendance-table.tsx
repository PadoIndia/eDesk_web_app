import React, { useEffect, useState } from "react";
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
import userService from "../../../services/api-services/user.service";

interface UserAttendanceTableProps {
  user: AttendanceUser;
  selectedMonth: number;
  selectedYear: number;
  selectedDate: string;
  calendarEvents?: CalendarEvent[];
  onMissPunchRequest: (date: string, userId: number) => void;
  isCurrentUser: boolean;
  onManualStatusChange?: (
    userId: number,
    date: string,
    newStatus: string,
    comment: string
  ) => void;
  isAdmin: boolean;
  isManager?: boolean; // Added manager prop
}

// Status mapping to short codes
const statusToShortCode: { [key: string]: string } = {
  PRESENT: "P",
  ABSENT: "A",
  HALF_DAY: "HD",
  WEEK_OFF: "WO",
  HOLIDAY: "H",
  SICK_LEAVE: "SL",
  CASUAL_LEAVE: "CL",
  PAID_LEAVE: "PL",
  UNPAID_LEAVE: "UL",
  COMPENSATORY_LEAVE: "CO",
  EARNED_LEAVE: "EL",
};

const UserAttendanceTable: React.FC<UserAttendanceTableProps> = ({
  user,
  selectedMonth,
  selectedYear,
  calendarEvents = [],
  onMissPunchRequest,
  isCurrentUser,
  onManualStatusChange,
  isAdmin,
  isManager = false,
}) => {
  const [weekOffDays, setWeekOffDays] = useState<string[]>([]);

  useEffect(() => {
    const fetchWeekOff = async () => {
      try {
        const weekOff = await getWeekOff();
        // Convert to uppercase for case-insensitive comparison
        setWeekOffDays(
          weekOff.split(",").map((day) => day.trim().toUpperCase())
        );
      } catch (error) {
        console.error("Failed to fetch week off days", error);
        setWeekOffDays([]);
      }
    };

    fetchWeekOff();
  }, []);

  // Helper functions
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  const formatTime = (hh: number, mm: number): string => {
    return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
  };

  const getPunchesForDate = (day: number): Punch[] => {
    const punches = user.punchData.filter(
      (punch) =>
        punch.date === day &&
        punch.month === selectedMonth + 1 &&
        punch.year === selectedYear
    );

    // Sort punches in ascending order by time
    return punches.sort((a, b) => {
      const timeA = (a.hh ?? 0) * 60 + (a.mm ?? 0);
      const timeB = (b.hh ?? 0) * 60 + (b.mm ?? 0);
      return timeA - timeB;
    });
  };

  const getWeekOff = async (): Promise<string> => {
    const response = await userService.getUserDetailsById(user.id);
    const weekoff = response.data.weekoff;
    return weekoff;
  };

  const calculateWorkingHours = (punches: Punch[]): string => {
    const validPunches = punches.filter(
      (p) => p.isApproved !== false || !p.approvedBy
    );

    if (validPunches.length % 2 !== 0) return "—";

    // Punches are already sorted, so we can calculate directly
    let totalMinutes = 0;

    for (let i = 0; i < validPunches.length; i += 2) {
      if (i + 1 < validPunches.length) {
        const inTime = validPunches[i];
        const outTime = validPunches[i + 1];
        totalMinutes +=
          (outTime.hh ?? 0) * 60 +
          (outTime.mm ?? 0) -
          ((inTime.hh ?? 0) * 60 + (inTime.mm ?? 0));
      }
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getStatusForDate = (day: number): string => {
    const date = new Date(selectedYear, selectedMonth, day);
    const dayOfWeek = date
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    // Check if this is a week-off day
    const isWeekOff = weekOffDays.includes(dayOfWeek);

    // Find attendance entry for this date
    const dateEntry = user.attendance.find(
      (entry) =>
        entry.date === day &&
        entry.month === selectedMonth + 1 &&
        entry.year === selectedYear
    );

    // Priority 1: Manual status override
    if (dateEntry?.statusManual) {
      return statusToShortCode[dateEntry.statusManual] || "A";
    }

    // Priority 2: Check for punch data
    const punches = getPunchesForDate(day);
    if (punches.length > 0) return "P"; // Present if any punches exist

    // Priority 3: Week-off day
    if (isWeekOff) return "WO";

    // Default to absent
    return "A";
  };

  const getPunchApprovalIcon = (punch: Punch): React.ReactElement | null => {
    if (punch.type !== "MANUAL") return null;

    if (punch.isApproved === true) {
      return (
        <FaCheckCircle
          className="text-success ms-2"
          title={`Approved by ${punch.approvedBy || "Admin"}`}
        />
      );
    } else if (punch.isApproved === false && punch.approvedBy) {
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
    const status = getStatusForDate(day);

    const rejectedPunches = punches.filter(
      (p) => p.isApproved === false && p.approvedBy
    ).length;

    // Check for odd number of punches first (yellow highlight)
    if (punches.length > 0 && (punches.length - rejectedPunches) % 2 !== 0) {
      return "table-warning";
    }

    // Then check status-based colors
    if (["A", "SL", "CL", "PL", "UL", "CO"].includes(status))
      return "table-danger";
    if (["WO", "H"].includes(status)) return "table-light";
    if (status === "HD") return "table-warning";
    return "";
  };

  // Check if miss punch request is allowed for a given date
  const isMissPunchAllowed = (day: number): boolean => {
    const today = new Date();
    const targetDate = new Date(selectedYear, selectedMonth, day);
    const daysDifference = Math.floor(
      (today.getTime() - targetDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    // Admin can always make miss punch requests
    if (isAdmin) return true;

    // Manager can make miss punch requests for others for the whole month, but not for themselves
    if (isManager) {
      if (isCurrentUser) {
        // Manager's own attendance - same 4-day rule
        return daysDifference <= 4;
      } else {
        // Manager can request for others for the whole month
        return true;
      }
    }

    // Regular users can only request within 4 days
    return daysDifference <= 4;
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
        {isManager && <span className="badge bg-success ms-2">Manager</span>}
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
              const statusShortCode = getStatusForDate(day);
              const canRequestMissPunch = isMissPunchAllowed(day);

              // Get attendance entry for this date to check for comments
              const attendanceEntry = user.attendance.find(
                (entry) =>
                  entry.date === day &&
                  entry.month === selectedMonth + 1 &&
                  entry.year === selectedYear
              );

              return (
                <tr key={date} className={getRowColorForDate(day)}>
                  <td className="text-center">
                    <div className="d-flex align-items-center justify-content-center">
                      <span className="fw-bold me-1">{day}</span>
                      <span className="text-muted">({dayOfWeek})</span>
                      {calendarEvent && (
                        <FaCalendarAlt
                          className={`ms-1 ${
                            calendarEvent.type === "holiday"
                              ? "text-danger"
                              : "text-primary"
                          }`}
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
                            key={`${punch.date}-${punch.hh}-${punch.mm}-${index}`}
                            className="d-flex align-items-center p-1 bg-light rounded"
                            style={{ minWidth: "100px", flex: "0 0 auto" }}
                            title={`${index % 2 === 0 ? "IN" : "OUT"} - ${
                              punch.type
                            }`}
                          >
                            <span
                              className={`me-2 ${
                                punch.type === "MANUAL"
                                  ? "text-primary fw-bold"
                                  : ""
                              }`}
                            >
                              {formatTime(punch.hh ?? 0, punch.mm ?? 0)}
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
                    {attendanceEntry?.comment ? (
                      <Badge
                        label="i"
                        status="INFO"
                        title={attendanceEntry.comment}
                      />
                    ) : (
                      <Badge
                        label={statusShortCode}
                        status={
                          statusShortCode === "P"
                            ? "SUCCESS"
                            : statusShortCode === "A"
                            ? "DANGER"
                            : statusShortCode === "HD"
                            ? "WARNING"
                            : ["WO", "H"].includes(statusShortCode)
                            ? "PRIMARY"
                            : "INFO"
                        }
                        title=""
                      />
                    )}
                  </td>

                  <td className="text-center">
                    {isAdmin && !isCurrentUser ? (
                      <div className="d-flex align-items-center">
                        <select
                          className="form-select form-select-sm me-2"
                          onChange={(e) => {
                            const comment = prompt(
                              "Enter comment for status change:"
                            );
                            if (comment !== null) {
                              onManualStatusChange?.(
                                user.id,
                                date,
                                e.target.value,
                                comment
                              );
                            }
                          }}
                          value={attendanceEntry?.statusManual || ""}
                        >
                          <option value="">—</option>
                          {Object.entries(statusToShortCode).map(
                            ([status, code]) => (
                              <option key={status} value={status}>
                                {code} - {status.replace("_", " ")}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>

                  <td className="text-center">
                    {canRequestMissPunch ? (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={() => onMissPunchRequest(date, user.id)}
                        title="Request Missing Punch"
                      >
                        <FaPlus className="me-1" />
                        MP
                      </button>
                    ) : (
                      <span className="text-muted small">
                        {isCurrentUser && !isAdmin && !isManager
                          ? "Expired"
                          : isCurrentUser && isManager
                          ? "Expired"
                          : "—"}
                      </span>
                    )}
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

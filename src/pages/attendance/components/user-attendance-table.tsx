import React, { useEffect, useState } from "react";
import {
  FaUser,
  FaPlus,
  // FaCheckCircle,
  // FaTimesCircle,
  // FaHourglassHalf,
  FaCalendarAlt,
  FaChartBar,
} from "react-icons/fa";
import Badge from "../../../components/badge";
import {
  AttendanceUser,
  Punch,
  CalendarEvent,
} from "../../../types/attendance.types";
import {
  getDaysInMonth,
  formatTime,
  getWeekOff,
  calculateWorkingHours,
  calculateWorkingMinutes,
  getLeaveTypeFromComment,
  getDayOfWeek,
} from "../../../utils/helper";
import { getPunchApprovalIcon } from "../../../utils/helper.tsx";

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
        const weekOff = await getWeekOff(user.id);
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

    // Priority 2: Check if there's a comment (indicates leave)
    if (dateEntry?.comment) {
      // If there's a comment but no manual status, treat as leave
      // Determine leave type from comment content
      return getLeaveTypeFromComment(dateEntry.comment);
    }

    // Priority 3: Check for punch data
    const punches = getPunchesForDate(day);
    const validPunches = punches.filter(
      (p) => p.isApproved !== false || !p.approvedBy
    );

    if (isWeekOff && validPunches.length === 0) return "WO";
    if (validPunches.length === 0 || validPunches.length % 2 !== 0) return "A";

    return "P";
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
    if (["A", "SL", "CL", "PL", "UL", "CO", "EL"].includes(status))
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

  // Calculate monthly summary
  const calculateMonthlySummary = () => {
    const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const summary = {
      totalDays: daysInMonth,
      presentDays: 0,
      absentDays: 0,
      halfDays: 0,
      weekOffs: 0,
      holidays: 0,
      leaves: 0,
      totalWorkingHours: 0,
      averageWorkingHours: 0,
      workingDays: 0,
      leavesBreakdown: {
        sickLeave: 0,
        casualLeave: 0,
        paidLeave: 0,
        unpaidLeave: 0,
        compensatoryLeave: 0,
        earnedLeave: 0,
      },
    };

    days.forEach((day) => {
      const status = getStatusForDate(day);
      const punches = getPunchesForDate(day);
      const workingMinutes = calculateWorkingMinutes(punches);

      switch (status) {
        case "P":
          summary.presentDays++;
          summary.workingDays++;
          summary.totalWorkingHours += workingMinutes;
          break;
        case "A":
          summary.absentDays++;
          summary.workingDays++;
          break;
        case "HD":
          summary.halfDays++;
          summary.workingDays++;
          summary.totalWorkingHours += workingMinutes;
          break;
        case "WO":
          summary.weekOffs++;
          break;
        case "H":
          summary.holidays++;
          break;
        case "SL":
          summary.leaves++;
          summary.leavesBreakdown.sickLeave++;
          summary.workingDays++;
          break;
        case "CL":
          summary.leaves++;
          summary.leavesBreakdown.casualLeave++;
          summary.workingDays++;
          break;
        case "PL":
          summary.leaves++;
          summary.leavesBreakdown.paidLeave++;
          summary.workingDays++;
          break;
        case "UL":
          summary.leaves++;
          summary.leavesBreakdown.unpaidLeave++;
          summary.workingDays++;
          break;
        case "CO":
          summary.leaves++;
          summary.leavesBreakdown.compensatoryLeave++;
          summary.workingDays++;
          break;
        case "EL":
          summary.leaves++;
          summary.leavesBreakdown.earnedLeave++;
          summary.workingDays++;
          break;
      }
    });

    // Calculate average working hours
    const totalHours = Math.floor(summary.totalWorkingHours / 60);
    const totalMinutes = summary.totalWorkingHours % 60;
    const presentAndHalfDays = summary.presentDays + summary.halfDays;

    if (presentAndHalfDays > 0) {
      const avgMinutes = summary.totalWorkingHours / presentAndHalfDays;
      const avgHours = Math.floor(avgMinutes / 60);
      const avgMins = Math.floor(avgMinutes % 60);
      summary.averageWorkingHours = parseFloat(
        `${avgHours}.${Math.floor((avgMins / 60) * 100)}`
      );
    }

    return {
      ...summary,
      totalWorkingHoursFormatted: `${totalHours}h ${totalMinutes}m`,
      averageWorkingHoursFormatted: `${Math.floor(
        summary.averageWorkingHours
      )}h ${Math.floor((summary.averageWorkingHours % 1) * 60)}m`,
      attendancePercentage:
        summary.workingDays > 0
          ? Math.round(
              ((summary.presentDays + summary.halfDays * 0.5 + summary.leaves) /
                summary.workingDays) *
                100
            )
          : 0,
    };
  };

  // Generate table rows
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const monthlySummary = calculateMonthlySummary();

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
                    {attendanceEntry?.comment &&
                    !attendanceEntry?.statusManual ? (
                      <Badge
                        label={statusShortCode}
                        status={
                          ["SL", "CL", "PL", "UL", "CO", "EL"].includes(
                            statusShortCode
                          )
                            ? "INFO"
                            : "SUCCESS"
                        }
                        title={attendanceEntry.comment}
                      />
                    ) : attendanceEntry?.comment ? (
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

      {/* Monthly Summary Section */}
      <div className="mt-4">
        <div className="d-flex align-items-center mb-3">
          <FaChartBar className="text-primary me-2" size={20} />
          <h5 className="mb-0">Monthly Summary</h5>
        </div>

        <div className="row">
          {/* Attendance Overview */}
          <div className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-header bg-primary text-white">
                <h6 className="mb-0">Attendance Overview</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-6 col-lg-3 mb-2">
                    <div className="border rounded p-2">
                      <div className="h5 text-success mb-1">
                        {monthlySummary.presentDays}
                      </div>
                      <small className="text-muted">Present</small>
                    </div>
                  </div>
                  <div className="col-6 col-lg-3 mb-2">
                    <div className="border rounded p-2">
                      <div className="h5 text-danger mb-1">
                        {monthlySummary.absentDays}
                      </div>
                      <small className="text-muted">Absent</small>
                    </div>
                  </div>
                  <div className="col-6 col-lg-3 mb-2">
                    <div className="border rounded p-2">
                      <div className="h5 text-warning mb-1">
                        {monthlySummary.halfDays}
                      </div>
                      <small className="text-muted">Half Days</small>
                    </div>
                  </div>
                  <div className="col-6 col-lg-3 mb-2">
                    <div className="border rounded p-2">
                      <div className="h5 text-info mb-1">
                        {monthlySummary.leaves}
                      </div>
                      <small className="text-muted">Leaves</small>
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <span className="badge bg-success fs-6">
                    Attendance: {monthlySummary.attendancePercentage}%
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Working Hours */}
          <div className="col-md-6 mb-3">
            <div className="card h-100">
              <div className="card-header bg-info text-white">
                <h6 className="mb-0">Working Hours</h6>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-12 mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Total Hours:</span>
                      <strong className="text-primary">
                        {monthlySummary.totalWorkingHoursFormatted}
                      </strong>
                    </div>
                  </div>
                  <div className="col-12 mb-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Average/Day:</span>
                      <strong className="text-success">
                        {monthlySummary.averageWorkingHoursFormatted}
                      </strong>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <div className="h6 text-muted mb-1">
                        {monthlySummary.workingDays}
                      </div>
                      <small className="text-muted">Working Days</small>
                    </div>
                  </div>
                  <div className="col-6">
                    <div className="text-center">
                      <div className="h6 text-muted mb-1">
                        {monthlySummary.weekOffs + monthlySummary.holidays}
                      </div>
                      <small className="text-muted">Offs/Holidays</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Leave Breakdown (only show if there are leaves) */}
          {monthlySummary.leaves > 0 && (
            <div className="col-12 mb-3">
              <div className="card">
                <div className="card-header bg-warning text-dark">
                  <h6 className="mb-0">Leave Breakdown</h6>
                </div>
                <div className="card-body">
                  <div className="row text-center">
                    {monthlySummary.leavesBreakdown.sickLeave > 0 && (
                      <div className="col-6 col-md-2 mb-2">
                        <div className="border rounded p-2">
                          <div className="h6 text-danger mb-1">
                            {monthlySummary.leavesBreakdown.sickLeave}
                          </div>
                          <small className="text-muted">Sick Leave</small>
                        </div>
                      </div>
                    )}
                    {monthlySummary.leavesBreakdown.casualLeave > 0 && (
                      <div className="col-6 col-md-2 mb-2">
                        <div className="border rounded p-2">
                          <div className="h6 text-info mb-1">
                            {monthlySummary.leavesBreakdown.casualLeave}
                          </div>
                          <small className="text-muted">Casual Leave</small>
                        </div>
                      </div>
                    )}
                    {monthlySummary.leavesBreakdown.paidLeave > 0 && (
                      <div className="col-6 col-md-2 mb-2">
                        <div className="border rounded p-2">
                          <div className="h6 text-success mb-1">
                            {monthlySummary.leavesBreakdown.paidLeave}
                          </div>
                          <small className="text-muted">Paid Leave</small>
                        </div>
                      </div>
                    )}
                    {monthlySummary.leavesBreakdown.unpaidLeave > 0 && (
                      <div className="col-6 col-md-2 mb-2">
                        <div className="border rounded p-2">
                          <div className="h6 text-warning mb-1">
                            {monthlySummary.leavesBreakdown.unpaidLeave}
                          </div>
                          <small className="text-muted">Unpaid Leave</small>
                        </div>
                      </div>
                    )}
                    {monthlySummary.leavesBreakdown.compensatoryLeave > 0 && (
                      <div className="col-6 col-md-2 mb-2">
                        <div className="border rounded p-2">
                          <div className="h6 text-primary mb-1">
                            {monthlySummary.leavesBreakdown.compensatoryLeave}
                          </div>
                          <small className="text-muted">Comp Leave</small>
                        </div>
                      </div>
                    )}
                    {monthlySummary.leavesBreakdown.earnedLeave > 0 && (
                      <div className="col-6 col-md-2 mb-2">
                        <div className="border rounded p-2">
                          <div className="h6 text-secondary mb-1">
                            {monthlySummary.leavesBreakdown.earnedLeave}
                          </div>
                          <small className="text-muted">Earned Leave</small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAttendanceTable;

import React from "react";
import {
  FaUser,
  FaPlus,
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaCalendarAlt,
} from "react-icons/fa";
import Badge from "../../components/badge";

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

interface UserAttendanceTableProps {
  user: AttendanceUser;
  selectedMonth: number;
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
  selectedDate,
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

  const getDayOfWeek = (date: Date): string => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const getFormattedDate = (day: number): string => {
    return `${selectedYear}-${String(selectedMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
  };

  const getPunchesForDate = (date: string): Punch[] => {
    return user.punchData.filter((punch) => punch.date === date);
  };
  const getCallDetailsForDate = (date: string): CallDetails | undefined => {
    return user.callDetails?.find((call) => call.date === date);
  };
  const getClassDetailsForDate = (date: string): ClassDetails | undefined => {
    return user.classDetails?.find((classDetail) => classDetail.date === date);
  };

  const calculateWorkingHours = (punches: Punch[]): string => {
    if (punches.length < 2) return "—";

    let totalMinutes = 0;
    // Group punches in pairs (in-out)
    for (let i = 0; i < punches.length; i += 2) {
      if (i + 1 < punches.length) {
        const inTime = punches[i].time.split(":");
        const outTime = punches[i + 1].time.split(":");

        const inMinutes = parseInt(inTime[0]) * 60 + parseInt(inTime[1]);
        const outMinutes = parseInt(outTime[0]) * 60 + parseInt(outTime[1]);

        totalMinutes += outMinutes - inMinutes;
      }
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    return `${hours}h ${minutes}m`;
  };

  const getStatusForDate = (date: string): string => {
    // This is simplified - in a real app, you would fetch status from backend
    const punches = getPunchesForDate(date);
    if (punches.length > 0) return "P";

    // Check if it's a weekend
    const dayOfWeek = new Date(date).getDay();
    if (dayOfWeek === 0 || dayOfWeek === 6) return "W"; // Weekend

    // Check if it's a holiday from calendar events
    const isHoliday = calendarEvents.some(
      (event) => event.date === date && event.type === "holiday"
    );
    if (isHoliday) return "H";

    // If the date is in the future
    if (new Date(date) > new Date()) return "—";

    return "A"; // Default to absent
  };

  const getManualStatusForDate = (date: string): string => {
    // In a real app, this would come from your database
    return "";
  };

  const getCalendarEventForDate = (date: string): CalendarEvent | undefined => {
    return calendarEvents.find((event) => event.date === date);
  };

  const getStatusBadge = (status: string): React.ReactElement => {
    switch (status) {
      case "P":
        return <Badge label="Present" status="SUCCESS" />;
      case "A":
        return <Badge label="Absent" status="DANGER" />;
      case "L":
        return <Badge label="Leave" status="WARNING" />;
      case "H":
        return <Badge label="Holiday" status="PRIMARY" />;
      case "W":
        return <Badge label="Weekend" status="INFO" />;
      default:
        return <Badge label={status} />;
    }
  };

  const getPunchApprovalIcon = (punch: Punch): React.ReactElement | null => {
    if (punch.type !== "manual") return null;

    if (punch.isApproved === true) {
      return (
        <FaCheckCircle
          className="text-success ms-2"
          title={`Approved by ${punch.approvedBy} on ${punch.approvedOn}`}
        />
      );
    } else if (punch.isApproved === false) {
      return (
        <FaTimesCircle
          className="text-danger ms-2"
          title={`Rejected: ${punch.rejectionReason}`}
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

  const getRowColorForDate = (date: string): string => {
    const punches = getPunchesForDate(date);

    if (punches.length === 0) {
      const status = getStatusForDate(date);
      if (status === "A") return "table-danger";
      if (status === "W" || status === "H") return "table-light";
      return "";
    }

    // Check if odd number of punches and not in specified departments
    if (
      punches.length % 2 !== 0 &&
      !["BD", "Mentor", "Faculty"].includes(user.department)
    ) {
      return "table-warning";
    }

    // Check if any punch is not approved
    const hasPendingRequest = punches.some(
      (punch: Punch) =>
        punch.type === "manual" && punch.isApproved === undefined
    );
    if (hasPendingRequest) return "table-warning";

    // Check if any punch request was rejected
    const hasRejectedRequest = punches.some(
      (punch: Punch) => punch.type === "manual" && punch.isApproved === false
    );
    if (hasRejectedRequest) return "table-danger";

    // Check if any punch request was approved
    const hasApprovedRequest = punches.some(
      (punch: Punch) => punch.type === "manual" && punch.isApproved === true
    );
    if (hasApprovedRequest) return "table-success";

    return "";
  };

  // Get days in the selected month
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="mb-5">
      {/* User Name Header */}
      <div className="d-flex align-items-center mb-3 bg-light p-3 rounded">
        <FaUser className="text-primary me-2" size={24} />
        <h4 className="mb-0">{user.name}</h4>
        <span className="badge bg-secondary ms-2">{user.department}</span>
        {user.isAdmin && <span className="badge bg-primary ms-2">Admin</span>}
      </div>

      {/* Attendance Table */}
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
              <th>Additional Info</th>
              <th className="text-center" style={{ width: "80px" }}>
                Status
              </th>
              <th className="text-center" style={{ width: "100px" }}>
                Manual Status
              </th>
              <th>Calendar</th>
              <th className="text-center" style={{ width: "120px" }}>
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {days.map((day) => {
              const date = getFormattedDate(day);
              const dayOfWeek = getDayOfWeek(new Date(date));
              const punches = getPunchesForDate(date);
              const callDetails = getCallDetailsForDate(date);
              const classDetails = getClassDetailsForDate(date);
              const status = getStatusForDate(date);
              const manualStatus = getManualStatusForDate(date);
              const calendarEvent = getCalendarEventForDate(date);

              return (
                <tr key={date} className={getRowColorForDate(date)}>
                  {/* Date/Day */}
                  <td className="text-center">
                    <div className="fw-bold">{day}</div>
                    <div className="small text-muted">{dayOfWeek}</div>
                  </td>

                  {/* Punch Data */}
                  {/* <td>
                    {punches.length > 0 ? (
                      <div className="d-flex flex-wrap gap-2">
                        {punches.map((punch, idx) => (
                          <div
                            key={punch.id}
                            className="badge bg-light text-dark p-2 d-flex align-items-center"
                          >
                            {idx % 2 === 0 ? "In: " : "Out: "}
                            <span
                              className={
                                punch.type === "manual"
                                  ? "text-primary fw-bold ms-1"
                                  : "ms-1"
                              }
                            >
                              {punch.time}
                            </span>
                            {getPunchApprovalIcon(punch)}
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td> */}
                  <td>
                    {punches.length > 0 ? (
                      <div className="d-flex flex-column gap-1">
                        {punches.map((punch, idx) => (
                          <div
                            key={punch.id}
                            className="d-flex align-items-center justify-content-between p-1 bg-light rounded"
                          >
                            <div className="d-flex align-items-center">
                              <span className="badge bg-secondary me-2">
                                {idx % 2 === 0 ? "IN" : "OUT"}
                              </span>
                              <span
                                className={
                                  punch.type === "manual"
                                    ? "text-primary fw-bold"
                                    : ""
                                }
                              >
                                {punch.time}
                              </span>
                            </div>
                            <div className="d-flex align-items-center">
                              <span className="badge bg-light text-dark me-2">
                                {punch.type}
                              </span>
                              {getPunchApprovalIcon(punch)}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>

                  {/* Working Hours */}
                  <td className="text-center">
                    {calculateWorkingHours(punches)}
                  </td>

                  {/* Additional Info */}
                  {/* <td>
                    {
                    (user.classDetails || user.callDetails) ? (
                      <div className="small">
                        {user.callDetails &&  callDetails?.map((call:CallDetails, idx) => (
                          <>
                            <div>
                              <span className="fw-bold">Call Duration:</span>{" "}
                              {call.callDuration} mins
                            </div>
                            <div>
                              <span className="fw-bold">Missed Calls:</span>{" "}
                              {call.missedCalls}
                            </div>
                            <div>
                              <span className="fw-bold">Incoming:</span>{" "}
                              {call.incoming}
                            </div>
                            <div>
                              <span className="fw-bold">Outgoing:</span>{" "}
                              {call.outgoing}
                            </div>
                          </>
                        ))}
                        {user.classDetails && classDetails.map((classDetails,idx)=>(
                          <>
                            {classDetails.glcScheduled != null && (
                              <div>
                                <span className="fw-bold">GLC:</span>{" "}
                                {classDetails.glcTaken}/
                                {classDetails.glcScheduled}
                              </div>
                            )}
                            {classDetails.oplcScheduled != null && (
                              <div>
                                <span className="fw-bold">OPLC:</span>{" "}
                                {classDetails.oplcTaken}/
                                {classDetails.oplcScheduled}
                              </div>
                            )}
                            {classDetails.gdcScheduled != null && (
                              <div>
                                <span className="fw-bold">GDC:</span>{" "}
                                {classDetails.gdcTaken}/
                                {classDetails.gdcScheduled}
                              </div>
                            )}
                            {classDetails.opdcScheduled != null && (
                              <div>
                                <span className="fw-bold">OPDC:</span>{" "}
                                {classDetails.opdcTaken}/
                                {classDetails.opdcScheduled}
                              </div>
                            )}
                          </>

                        )) }
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td> */}
                  <td>
                    {callDetails || classDetails ? (
                      <div className="small">
                        {/* Call Details */}
                        {callDetails && (
                          <>
                            <div>
                              <span className="fw-bold">Call Duration:</span>{" "}
                              {callDetails.callDuration} mins
                            </div>
                            <div>
                              <span className="fw-bold">Missed Calls:</span>{" "}
                              {callDetails.missedCalls}
                            </div>
                            <div>
                              <span className="fw-bold">Incoming:</span>{" "}
                              {callDetails.incoming}
                            </div>
                            <div>
                              <span className="fw-bold">Outgoing:</span>{" "}
                              {callDetails.outgoing}
                            </div>
                          </>
                        )}

                        {/* Class Details */}
                        {classDetails && (
                          <>
                            {classDetails.glcScheduled != null && (
                              <div>
                                <span className="fw-bold">GLC:</span>{" "}
                                {classDetails.glcTaken}/
                                {classDetails.glcScheduled}
                              </div>
                            )}
                            {classDetails.oplcScheduled != null && (
                              <div>
                                <span className="fw-bold">OPLC:</span>{" "}
                                {classDetails.oplcTaken}/
                                {classDetails.oplcScheduled}
                              </div>
                            )}
                            {classDetails.gdcScheduled != null && (
                              <div>
                                <span className="fw-bold">GDC:</span>{" "}
                                {classDetails.gdcTaken}/
                                {classDetails.gdcScheduled}
                              </div>
                            )}
                            {classDetails.opdcScheduled != null && (
                              <div>
                                <span className="fw-bold">OPDC:</span>{" "}
                                {classDetails.opdcTaken}/
                                {classDetails.opdcScheduled}
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>

                  {/* Status */}
                  <td className="text-center">{getStatusBadge(status)}</td>

                  {/* Manual Status */}
                  <td className="text-center">
                    {isAdmin && !isCurrentUser ? (
                      <select
                        className="form-select form-select-sm"
                        value={manualStatus || ""}
                        onChange={(e) =>
                          onManualStatusChange &&
                          onManualStatusChange(user.id, date, e.target.value)
                        }
                      >
                        <option value="">—</option>
                        <option value="P">Present</option>
                        <option value="A">Absent</option>
                        <option value="L">Leave</option>
                      </select>
                    ) : manualStatus ? (
                      getStatusBadge(manualStatus)
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>

                  {/* Calendar Events */}
                  <td>
                    {calendarEvent ? (
                      <div
                        className={`small ${
                          calendarEvent.type === "holiday"
                            ? "text-danger"
                            : "text-primary"
                        }`}
                      >
                        <FaCalendarAlt className="me-1" />
                        {calendarEvent.title}
                      </div>
                    ) : (
                      <span className="text-muted">—</span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="text-center">
                    {(isCurrentUser || isAdmin) &&
                      new Date(date) <= new Date() && (
                        <button
                          className="btn btn-sm btn-primary"
                          onClick={() => onMissPunchRequest(date)}
                          title="Request Missing Punch"
                        >
                          <FaPlus className="me-1" />
                          Miss Punch
                        </button>
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

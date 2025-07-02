import React, { useEffect, useState } from "react";
import {
  FaPlus,
  FaCalendarAlt,
  FaClock,
  FaPhone,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaUmbrellaBeach,
  FaHospital,
  FaBriefcase,
  FaMoneyBillWave,
  FaCalendarTimes,
  FaClipboardList,
} from "react-icons/fa";
import { toast } from "react-toastify";
import attendanceDashboardService from "../../../services/api-services/attendance-dashboard.service";
import Avatar from "../../../components/avatar";
import {
  PunchData,
  UserDashboardData,
} from "../../../types/attendance-dashboard.types";

interface UserDetailedAttendanceProps {
  userId: number;
  onMissPunchRequest?: (
    date: string,
    user: { id: number; name: string }
  ) => void;
  onManualStatusChange?: (
    userId: number,
    date: string,
    currentStatus: string,
    userName: string
  ) => void;
  fromMonth?: number;
  fromYear?: number;
}

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

const statusConfig: {
  [key: string]: { icon: React.ReactNode; bgClass: string; textClass: string };
} = {
  WEEK_OFF: {
    icon: <FaCalendarAlt size={14} />,
    bgClass: "bg-light",
    textClass: "text-secondary",
  },
  HOLIDAY: {
    icon: <FaUmbrellaBeach size={14} />,
    bgClass: "bg-info bg-opacity-10",
    textClass: "text-info",
  },
  SICK_LEAVE: {
    icon: <FaHospital size={14} />,
    bgClass: "bg-danger bg-opacity-10",
    textClass: "text-danger",
  },
  CASUAL_LEAVE: {
    icon: <FaBriefcase size={14} />,
    bgClass: "bg-warning bg-opacity-10",
    textClass: "text-warning",
  },
  PAID_LEAVE: {
    icon: <FaMoneyBillWave size={14} />,
    bgClass: "bg-success bg-opacity-10",
    textClass: "text-success",
  },
  UNPAID_LEAVE: {
    icon: <FaCalendarTimes size={14} />,
    bgClass: "bg-secondary bg-opacity-10",
    textClass: "text-secondary",
  },
  COMPENSATORY_LEAVE: {
    icon: <FaCalendarAlt size={14} />,
    bgClass: "bg-primary bg-opacity-10",
    textClass: "text-primary",
  },
  EARNED_LEAVE: {
    icon: <FaCalendarAlt size={14} />,
    bgClass: "bg-primary bg-opacity-10",
    textClass: "text-primary",
  },
};

const UserDetailedAttendance: React.FC<UserDetailedAttendanceProps> = ({
  userId,
  onMissPunchRequest,
  fromMonth,
  fromYear,
}) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(
    null
  );
  const [month, setMonth] = useState(fromMonth || new Date().getMonth() + 1);
  const [year, setYear] = useState(fromYear || new Date().getFullYear());

  const [activeTab, setActiveTab] = useState<
    "attendance" | "calls" | "classes" | "punchRequests"
  >("attendance");

  useEffect(() => {
    fetchDashboardData();
  }, [userId, month, year]);

  useEffect(() => {
    if (fromMonth) {
      setMonth(fromMonth);
    }
    if (fromYear) {
      setYear(fromYear);
    }
  }, [fromMonth, fromYear]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await attendanceDashboardService.getDashboardData(
        userId,
        month,
        year
      );

      if (response.status === "success" && response.data) {
        setDashboardData(response.data);
      } else {
        toast.error("Failed to fetch dashboard data");
      }
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      toast.error("An error occurred while fetching dashboard data");
    } finally {
      setLoading(false);
    }
  };

  const getDaysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const formatTime = (hh: number, mm: number) => {
    return `${hh.toString().padStart(2, "0")}:${mm
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateWorkingHours = (punches: PunchData[], date: number) => {
    const dayPunches = punches
      .filter(
        (p) => p.date === date && (p.isApproved !== false || !p.approvedBy)
      )
      .sort((a, b) => a.hh * 60 + a.mm - (b.hh * 60 + b.mm));

    if (dayPunches.length < 2 || dayPunches.length % 2 !== 0) return "—";

    let totalMinutes = 0;
    for (let i = 0; i < dayPunches.length; i += 2) {
      const inTime = dayPunches[i].hh * 60 + dayPunches[i].mm;
      const outTime = dayPunches[i + 1].hh * 60 + dayPunches[i + 1].mm;
      totalMinutes += outTime - inTime;
    }

    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
  };

  const getStatusForDate = (date: number) => {
    if (!dashboardData) return "—";

    const attendance = dashboardData.attendance.find(
      (a) => a.date === date && a.month === month && a.year === year
    );

    if (attendance?.statusManual) {
      return attendance.statusManual;
    }

    if (attendance) {
      return attendance.statusAuto;
    }

    // Check if it's Sunday (0 = Sunday in JavaScript)
    const dateObj = new Date(year, month - 1, date);
    if (dateObj.getDay() === 0) {
      return "HOLIDAY";
    }

    return "—";
  };

  const getPunchApprovalIcon = (punch: PunchData) => {
    if (punch.approvedBy) {
      if (punch.isApproved === true) {
        return (
          <FaCheckCircle
            className="text-success ms-1"
            size={14}
            title="Approved"
          />
        );
      } else if (punch.isApproved === false) {
        return (
          <FaTimesCircle
            className="text-danger ms-1"
            size={14}
            title="Rejected"
          />
        );
      }
    }
    if (punch.type === "MANUAL") {
      return (
        <FaExclamationCircle
          className="text-warning ms-1"
          size={14}
          title="Pending Approval"
        />
      );
    }
    return null;
  };

  const getRowClass = (status: string) => {
    const config = statusConfig[status];
    return config ? config.bgClass : "";
  };

  const syncAttendance = () => {
    attendanceDashboardService
      .syncUserAttendance(userId, { month, year })
      .then((res) => {
        if (res.status === "success") {
          fetchDashboardData();
        } else toast.error(res.message);
      });
  };

  const calculateMonthlySummary = () => {
    if (!dashboardData) return null;

    const daysInMonth = getDaysInMonth(month - 1, year);
    const summary = {
      totalDays: daysInMonth,
      presentDays: 0,
      absentDays: 0,
      halfDays: 0,
      weekOffs: 0,
      holidays: 0,
      leaves: 0,
      totalWorkingMinutes: 0,
      totalCalls: 0,
      totalCallDuration: 0,
      totalClasses: 0,
      completedClasses: 0,
    };

    // Count Sundays as holidays
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month - 1, day);
      if (date.getDay() === 0) {
        const hasAttendance = dashboardData.attendance.some(
          (a) => a.date === day && a.month === month && a.year === year
        );
        if (!hasAttendance) {
          summary.holidays++;
        }
      }
    }

    dashboardData.attendance.forEach((att) => {
      const status = att.statusManual || att.statusAuto;
      switch (status) {
        case "PRESENT":
          summary.presentDays++;
          break;
        case "ABSENT":
          summary.absentDays++;
          break;
        case "HALF_DAY":
          summary.halfDays++;
          break;
        case "WEEK_OFF":
          summary.weekOffs++;
          break;
        case "HOLIDAY":
          summary.holidays++;
          break;
        case "SICK_LEAVE":
        case "CASUAL_LEAVE":
        case "PAID_LEAVE":
        case "UNPAID_LEAVE":
        case "COMPENSATORY_LEAVE":
          summary.leaves++;
          break;
      }
    });

    for (let day = 1; day <= daysInMonth; day++) {
      const dayPunches = dashboardData.punchData
        .filter(
          (p) => p.date === day && (p.isApproved !== false || !p.approvedBy)
        )
        .sort((a, b) => a.hh * 60 + a.mm - (b.hh * 60 + b.mm));

      if (dayPunches.length >= 2 && dayPunches.length % 2 === 0) {
        for (let i = 0; i < dayPunches.length; i += 2) {
          const inTime = dayPunches[i].hh * 60 + dayPunches[i].mm;
          const outTime = dayPunches[i + 1].hh * 60 + dayPunches[i + 1].mm;
          summary.totalWorkingMinutes += outTime - inTime;
        }
      }
    }

    dashboardData.callDetails.forEach((call) => {
      summary.totalCalls += call.incomingCalls + call.outgoingCalls;
      summary.totalCallDuration += call.callDuration;
    });

    dashboardData.classDetails.forEach((cls) => {
      summary.totalClasses++;
      if (cls.classStatus === "COMPLETED") {
        summary.completedClasses++;
      }
    });

    return summary;
  };

  const getPunchRequests = () => {
    if (!dashboardData) return [];

    return dashboardData.punchData.filter((punch) => punch.type === "MANUAL");
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-20">
        <div className="text-center">
          <div className="spinner-border text-primary mb-3" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="text-muted animate-pulse">
            Loading attendance details...
          </p>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="alert alert-danger">
        Failed to load attendance data. Please try again.
      </div>
    );
  }

  const daysInMonth = getDaysInMonth(month - 1, year);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const summary = calculateMonthlySummary();
  const punchRequests = getPunchRequests();

  return (
    <div className="card shadow-sm rounded-lg">
      <div className="card-body p-6">
        {/* User Header */}
        <div className="d-flex align-items-center bg-light border p-3 rounded mb-4">
          <div className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3">
            <Avatar
              title={dashboardData.user.name}
              imageUrl={null}
              fontSize={14}
            />
          </div>
          <div>
            <h6 className="mb-1 fw-semibold">{dashboardData.user.name}</h6>
            <div className="d-flex flex-wrap gap-1">
              {dashboardData.user.departments.map((dept) => (
                <span
                  key={dept.id}
                  className="badge bg-primary-subtle text-primary fw-normal"
                >
                  {dept.name} {dept.isAdmin && "(Admin)"}
                </span>
              ))}
            </div>
          </div>
          <div className="ms-auto text-end">
            <h5 className="mb-0">
              {new Date(year, month - 1).toLocaleDateString("en-US", {
                month: "long",
                year: "numeric",
              })}
            </h5>
          </div>
          <div className="mx-2">
            <button
              className="btn btn-outline-primary"
              onClick={syncAttendance}
            >
              Sync Attendance
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        {summary && (
          <div className="row mb-6">
            <div className="col-md-3 mb-3">
              <div className="rounded-md border border-success-subtle  text-success h-100 ">
                <div className="card-body p-2 px-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">Present Days</p>
                      <span className="mb-0">{summary.presentDays}</span>
                    </div>
                    <FaCheckCircle size={20} className="opacity-75" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="rounded-md border border-danger-subtle text-danger h-100 ">
                <div className="card-body p-2 px-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">Absent Days</p>
                      <span className="mb-0">{summary.absentDays}</span>
                    </div>
                    <FaTimesCircle size={20} className="opacity-75" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="rounded-md border border-info-subtle text-info h-100 ">
                <div className="card-body p-2 px-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">Working Hours</p>
                      <span className="mb-0">
                        {Math.floor(summary.totalWorkingMinutes / 60)}h
                      </span>
                    </div>
                    <FaClock size={20} className="opacity-75" />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-3 mb-3">
              <div className="rounded-md border border-warning-subtle text-warning h-100 ">
                <div className="card-body p-2 px-4">
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <p className="mb-1">Leaves</p>
                      <span className="mb-0">{summary.leaves}</span>
                    </div>
                    <FaCalendarAlt size={20} className="opacity-75" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab Navigation */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "attendance"
                  ? "active bg-gradient-primary text-white"
                  : ""
              }`}
              onClick={() => setActiveTab("attendance")}
            >
              <FaCalendarAlt className="me-2" />
              Attendance Details
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "calls"
                  ? "active bg-gradient-primary text-white"
                  : ""
              }`}
              onClick={() => setActiveTab("calls")}
            >
              <FaPhone className="me-2" />
              Call Details
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${
                activeTab === "classes"
                  ? "active bg-gradient-primary text-white"
                  : ""
              }`}
              onClick={() => setActiveTab("classes")}
            >
              <FaChalkboardTeacher className="me-2" />
              Class Details
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link position-relative ${
                activeTab === "punchRequests"
                  ? "active bg-gradient-primary text-white"
                  : ""
              }`}
              onClick={() => setActiveTab("punchRequests")}
            >
              <FaClipboardList className="me-2" />
              Punch Requests
              {punchRequests.length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {punchRequests.length}
                  <span className="visually-hidden">punch requests</span>
                </span>
              )}
            </button>
          </li>
          <div className="d-flex ms-auto align-items-center gap-2">
            {/* Month Picker */}
            <select
              value={month}
              onChange={(e) => setMonth(+e.target.value)}
              className="form-select form-select-sm"
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {new Date(0, i).toLocaleString("default", { month: "long" })}
                </option>
              ))}
            </select>

            {/* Year Picker */}
            <select
              value={year}
              onChange={(e) => setYear(+e.target.value)}
              className="form-select form-select-sm"
            >
              {Array.from(
                { length: 10 },
                (_, i) => new Date().getFullYear() - 5 + i
              ).map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </ul>

        {/* Tab Content */}
        {activeTab === "attendance" && (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr className="bg-light">
                  <th className="text-center" style={{ width: "120px" }}>
                    Date
                  </th>
                  <th>Punch In/Out</th>
                  <th className="text-center" style={{ width: "120px" }}>
                    Working Hours
                  </th>
                  <th className="text-center" style={{ width: "100px" }}>
                    Status
                  </th>
                  <th className="text-center" style={{ width: "120px" }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {days.map((day) => {
                  const dayPunches = dashboardData.punchData.filter(
                    (p) => p.date === day
                  );
                  const fullStatus = getStatusForDate(day);
                  const shortStatus =
                    dayPunches.length > 0 && dayPunches.length % 2 == 0
                      ? statusToShortCode[fullStatus] || fullStatus
                      : "A";
                  const date = new Date(year, month - 1, day);
                  const dateStr = `${year}-${month
                    .toString()
                    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                  const config = statusConfig[fullStatus];
                  const rowClass = getRowClass(fullStatus);
                  const isSunday = date.getDay() === 0;

                  return (
                    <tr key={day} className={`${rowClass}`}>
                      <td className={`${rowClass} text-center`}>
                        <div className="d-flex align-items-center justify-content-center gap-1">
                          <div>
                            <div className="fw-bold">{day}</div>
                            <small
                              className={`${
                                isSunday
                                  ? "text-danger fw-semibold"
                                  : "text-muted"
                              }`}
                            >
                              {date.toLocaleDateString("en-US", {
                                weekday: "short",
                              })}
                            </small>
                          </div>
                          {config && (
                            <span className={config.textClass}>
                              {config.icon}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className={rowClass}>
                        {dayPunches.length > 0 ? (
                          <div className="d-flex flex-wrap gap-2">
                            {dayPunches
                              .sort(
                                (a, b) => a.hh * 60 + a.mm - (b.hh * 60 + b.mm)
                              )
                              .map((punch) => (
                                <div
                                  key={punch.id}
                                  className={`badge bg-secondary-subtle text-secondary  rounded-pill px-3 py-2 d-flex align-items-center`}
                                >
                                  <span>{formatTime(punch.hh, punch.mm)}</span>
                                  {getPunchApprovalIcon(punch)}
                                </div>
                              ))}
                          </div>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className={"text-center " + rowClass}>
                        <span className="fw-semibold">
                          {calculateWorkingHours(dayPunches, day)}
                        </span>
                      </td>
                      <td className={"text-center " + rowClass}>
                        <span
                          className={`badge rounded-pill px-3 py-1 ${
                            shortStatus === "P"
                              ? "bg-success"
                              : shortStatus === "A"
                              ? "bg-danger"
                              : shortStatus === "HD"
                              ? "bg-warning text-dark"
                              : shortStatus === "WO" || shortStatus === "H"
                              ? "bg-info"
                              : "bg-secondary"
                          }`}
                        >
                          {shortStatus}
                        </span>
                      </td>
                      <td className={"text-center " + rowClass}>
                        {isSunday && !dayPunches.length ? (
                          <span className="badge bg-info bg-opacity-25 text-info px-3 py-2">
                            <FaCalendarAlt className="me-1" size={12} />
                            Sunday
                          </span>
                        ) : (
                          <div className="d-flex gap-2 justify-content-center">
                            {onMissPunchRequest && (
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>
                                  onMissPunchRequest(dateStr, {
                                    id: userId,
                                    name: dashboardData.user.name,
                                  })
                                }
                                title="Request Missing Punch"
                              >
                                <FaPlus className="me-1" />
                                MP
                              </button>
                            )}
                            {/* {onManualStatusChange && dashboardData && (
                              <button
                                className="btn btn-outline-warning btn-sm"
                                onClick={() =>
                                  onManualStatusChange(
                                    userId,
                                    dateStr,
                                    shortStatus,
                                    dashboardData.user.name
                                  )
                                }
                                title="Change Status"
                              >
                                <FaEdit />
                              </button>
                            )} */}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "calls" && (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr className="bg-light">
                  <th>Date</th>
                  <th className="text-center">Incoming Calls</th>
                  <th className="text-center">Outgoing Calls</th>
                  <th className="text-center">Missed Calls</th>
                  <th className="text-center">Total Duration</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.callDetails.length > 0 ? (
                  dashboardData.callDetails.map((call) => (
                    <tr key={call.id}>
                      <td>
                        <div className="fw-bold">{call.date}</div>
                        <small className="text-muted">
                          {new Date(
                            call.year,
                            call.month - 1,
                            call.date
                          ).toLocaleDateString("en-US", { weekday: "short" })}
                        </small>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-success rounded-pill px-3">
                          {call.incomingCalls}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-primary rounded-pill px-3">
                          {call.outgoingCalls}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="badge bg-danger rounded-pill px-3">
                          {call.missedCalls}
                        </span>
                      </td>
                      <td className="text-center">
                        <span className="fw-semibold">
                          {Math.floor(call.callDuration / 60)}h{" "}
                          {call.callDuration % 60}m
                        </span>
                      </td>
                      <td>{call.comment || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="text-muted">
                        <FaPhone className="mb-2" size={48} />
                        <p>No call data available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "classes" && (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr className="bg-light">
                  <th>Date</th>
                  <th>Class Type</th>
                  <th>Scheduled Time</th>
                  <th>Actual Time</th>
                  <th className="text-center">Status</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.classDetails.length > 0 ? (
                  dashboardData.classDetails.map((cls) => (
                    <tr key={cls.id}>
                      <td>
                        <div className="fw-bold">{cls.date}</div>
                        <small className="text-muted">
                          {new Date(
                            cls.year,
                            cls.month - 1,
                            cls.date
                          ).toLocaleDateString("en-US", { weekday: "short" })}
                        </small>
                      </td>
                      <td>
                        <span className="badge bg-info rounded-pill px-3">
                          {cls.classType}
                        </span>
                      </td>
                      <td>
                        {new Date(cls.startTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}{" "}
                        -
                        {new Date(cls.endTime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td>
                        {cls.actualStartTime && cls.actualEndTime ? (
                          <>
                            {new Date(cls.actualStartTime).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}{" "}
                            -
                            {new Date(cls.actualEndTime).toLocaleTimeString(
                              "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )}
                          </>
                        ) : (
                          <span className="text-muted">—</span>
                        )}
                      </td>
                      <td className="text-center">
                        <span
                          className={`badge rounded-pill px-3 ${
                            cls.classStatus === "COMPLETED"
                              ? "bg-success"
                              : cls.classStatus === "IN_PROGRESS"
                              ? "bg-warning text-dark"
                              : cls.classStatus.includes("CANCELLED")
                              ? "bg-danger"
                              : "bg-secondary"
                          }`}
                        >
                          {cls.classStatus.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td>{cls.comment || "—"}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="text-center py-8">
                      <div className="text-muted">
                        <FaChalkboardTeacher className="mb-2" size={48} />
                        <p>No class data available</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === "punchRequests" && (
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead>
                <tr className="bg-light">
                  <th>Date</th>
                  <th>Time</th>
                  <th>Reason</th>
                  <th className="text-center">Status</th>
                  <th>Approved By</th>
                  <th>Approved On</th>
                  <th>Comment</th>
                </tr>
              </thead>
              <tbody>
                {punchRequests.length > 0 ? (
                  punchRequests
                    .sort((a, b) => {
                      // Sort by date (latest first)
                      const dateA = new Date(a.year, a.month - 1, a.date);
                      const dateB = new Date(b.year, b.month - 1, b.date);
                      return dateB.getTime() - dateA.getTime();
                    })
                    .map((punch) => (
                      <tr key={punch.id}>
                        <td>
                          <div className="fw-bold">{punch.date}</div>
                          <small className="text-muted">
                            {new Date(
                              punch.year,
                              punch.month - 1,
                              punch.date
                            ).toLocaleDateString("en-US", {
                              weekday: "short",
                              month: "short",
                              year: "numeric",
                            })}
                          </small>
                        </td>
                        <td>
                          <span className="badge bg-secondary rounded-pill px-3">
                            {formatTime(punch.hh, punch.mm)}
                          </span>
                        </td>
                        <td>{punch.missPunchReason || "—"}</td>
                        <td className="text-center">
                          {punch.approvedBy ? (
                            punch.isApproved === true ? (
                              <span className="badge bg-success rounded-pill px-3 d-flex align-items-center justify-content-center gap-1">
                                <FaCheckCircle size={12} />
                                Approved
                              </span>
                            ) : (
                              <span className="badge bg-danger rounded-pill px-3 d-flex align-items-center justify-content-center gap-1">
                                <FaTimesCircle size={12} />
                                Rejected
                              </span>
                            )
                          ) : (
                            <span className="badge bg-warning text-dark rounded-pill px-3 d-flex align-items-center justify-content-center gap-1">
                              <FaExclamationCircle size={12} />
                              Pending
                            </span>
                          )}
                        </td>
                        <td>
                          {punch.approvedBy ? (
                            <span className="text-muted">
                              User #{punch.approvedBy}
                            </span>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>
                          {punch.approvedOn ? (
                            <small className="text-muted">
                              {new Date(punch.approvedOn).toLocaleDateString(
                                "en-US",
                                {
                                  month: "short",
                                  day: "numeric",
                                  hour: "2-digit",
                                  minute: "2-digit",
                                }
                              )}
                            </small>
                          ) : (
                            "—"
                          )}
                        </td>
                        <td>{punch.comment || "—"}</td>
                      </tr>
                    ))
                ) : (
                  <tr>
                    <td colSpan={7} className="text-center py-8">
                      <div className="text-muted">
                        <FaClipboardList className="mb-2" size={48} />
                        <p>No punch requests found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDetailedAttendance;

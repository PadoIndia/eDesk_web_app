import React, { lazy, useEffect, useState } from "react";
import {
  FaPlus,
  FaCalendarAlt,
  FaClock,
  FaPhone,
  FaChalkboardTeacher,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaClipboardList,
} from "react-icons/fa";
import { toast } from "react-toastify";
import attendanceDashboardService from "../../../services/api-services/attendance-dashboard.service";
import Avatar from "../../../components/avatar";
import { UserDashboardData } from "../../../types/attendance-dashboard.types";
import {
  calculateWorkingHours,
  convertDayNameToInt,
  formatTime,
  getDaysInMonth,
} from "../../../utils/helper";
import { statusToShortCode } from "../../../utils/constants";
import { STATUS_ICON_CONFIG } from "../../../utils/icons";
import Modal from "../../../components/ui/modals";
import { useAppSelector } from "../../../store/store";
import punchDataService from "../../../services/api-services/punch-data.service";
import { PunchResponse } from "../../../types/punch-data.types";

const ClassesTable = lazy(() => import("./classes-table"));
const CallsTable = lazy(() => import("./calls-table"));
const MissPunchesTable = lazy(() => import("./miss-punches-table"));
const MissPunchForm = lazy(() => import("../components/miss-punch-form"));

interface Props {
  userId: number;
  fromMonth?: number;
  fromYear?: number;
}

const UserDetailedAttendance: React.FC<Props> = ({
  userId,
  fromMonth,
  fromYear,
}) => {
  const [loading, setLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<UserDashboardData | null>(
    null
  );
  const [month, setMonth] = useState(fromMonth || new Date().getMonth() + 1);
  const [year, setYear] = useState(fromYear || new Date().getFullYear());
  const [showMissPunchForm, setShowMissPunchForm] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    reason: "",

    targetUserId: 0,
  });
  const [activeTab, setActiveTab] = useState<
    "attendance" | "calls" | "classes" | "punchRequests"
  >("attendance");

  const currentUser = useAppSelector((s) => s.auth.userData?.user);
  const permissions = currentUser?.permissions || [];
  const isAdmin =
    permissions.some((p) =>
      ["is_admin", "is_team_admin", "is_department_admin"].includes(p)
    ) || false;

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
  const handleMissPunchRequest = (
    date: string,
    user: { id: number; name: string }
  ) => {
    if (!user) {
      toast.error("Target user not found");
      return;
    }

    setFormData({
      name: user.name,
      date,
      time: "",
      reason: "",
      targetUserId: user.id,
    });
    setShowMissPunchForm(true);
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

    const dateObj = new Date(year, month - 1, date);
    if (
      dateObj.getDay() ===
      convertDayNameToInt(dashboardData.user.userDetails?.weekoff || "SUNDAY")
    ) {
      return "WEEK_OFF";
    }

    return "—";
  };

  const getPunchApprovalIcon = (punch: PunchResponse) => {
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
    const baseStatus = status.replace("/2", "");
    const config = STATUS_ICON_CONFIG[baseStatus];
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
        case "FESTIVAL":
        case "UNPAID_LEAVE":
        case "COMPENSATORY":
        case "EARNED_LEAVE":
          summary.leaves++;
          break;
      }

      if (status.includes("/2")) {
        if (status === "ABSENT/2") {
          summary.absentDays += 0.5;
          summary.presentDays += 0.5;
        } else {
          summary.leaves += 0.5;
          summary.presentDays += 0.5;
        }
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

  const getStatusDisplay = (day: number) => {
    const status = getStatusForDate(day);
    const shortCode = statusToShortCode[status] || status;

    let badgeClass = "bg-secondary-subtle text-secondary";

    if (status === "PRESENT") {
      badgeClass = "bg-success-subtle text-success";
    } else if (status === "ABSENT") {
      badgeClass = "bg-danger-subtle text-danger";
    } else if (status === "ABSENT/2") {
      badgeClass = "bg-danger-subtle text-danger";
    } else if (status === "HALF_DAY" || status.includes("/2")) {
      badgeClass = "bg-warning-subtle text-warning";
    } else if (status === "WEEK_OFF" || status === "HOLIDAY") {
      badgeClass = "bg-primary-subtle text-primary";
    } else if (status === "FESTIVAL" || status === "FESTIVAL/2") {
      badgeClass = "bg-purple-subtle text-purple";
    } else if (
      [
        "SICK_LEAVE",
        "CASUAL_LEAVE",
        "UNPAID_LEAVE",
        "COMPENSATORY",
        "EARNED_LEAVE",
      ].includes(status)
    ) {
      badgeClass = "bg-warning-subtle text-warning";
    }

    return {
      code: shortCode,
      badgeClass,
      title: status.replace(/_/g, " ").replace("/2", " (Half Day)"),
    };
  };

  const handleFormClose = () => {
    setShowMissPunchForm(false);
    setFormData({
      name: "",
      date: "",
      reason: "",
      targetUserId: 0,
      time: "",
    });
  };

  const handleMissPunchSuccess = () => {
    punchDataService.getPunches({ year, month }).then((res) => {
      if (res.status === "success") {
        if (dashboardData) {
          const obj: UserDashboardData = {
            ...dashboardData,
            punchData: res.data,
          };
          setDashboardData(obj);
        }
      }
    });
    handleFormClose();
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
    <div className="card rounded-lg" style={{ border: "1px solid #f1f1f1" }}>
      {userId && (
        <Modal
          title="Add Misspunch"
          isOpen={showMissPunchForm}
          onClose={handleFormClose}
          showCloseIcon
          size="lg"
        >
          <MissPunchForm
            formData={formData}
            setFormData={setFormData}
            userId={userId}
            isAdmin={isAdmin}
            onSuccess={handleMissPunchSuccess}
          />
        </Modal>
      )}
      <div className="card-body p-6">
        <div className="d-flex align-items-center bg-light border p-3 rounded mb-4">
          <div className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3">
            <Avatar
              title={dashboardData.user.name}
              imageUrl={dashboardData.user.profileImg?.url}
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
              {punchRequests.filter((p) => !p.approvedBy).length > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {punchRequests.filter((p) => !p.approvedBy).length}
                  <span className="visually-hidden">punch requests</span>
                </span>
              )}
            </button>
          </li>
          <div className="d-flex ms-auto align-items-center gap-2">
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
                  const statusDisplay = getStatusDisplay(day);

                  const date = new Date(year, month - 1, day);
                  const dateStr = `${year}-${month
                    .toString()
                    .padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
                  const baseStatus = fullStatus.replace("/2", "");
                  const config = STATUS_ICON_CONFIG[baseStatus];
                  const rowClass = getRowClass(fullStatus);
                  const isWeekOff =
                    date.getDay() ===
                    convertDayNameToInt(
                      dashboardData.user.userDetails?.weekoff || "SUNDAY"
                    );

                  return (
                    <tr key={day} className={`${rowClass}`}>
                      <td className={`${rowClass} text-center`}>
                        <div className="d-flex align-items-center justify-content-center gap-1">
                          <div>
                            <div className="fw-bold">{day}</div>
                            <small
                              className={`${
                                isWeekOff
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
                            <span
                              className={config.textClass}
                              title={fullStatus.replace(/(_)/, " ")}
                            >
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
                          title={statusDisplay.title}
                          className={`badge rounded-pill px-3 py-1 ${statusDisplay.badgeClass}`}
                        >
                          {statusDisplay.code}
                        </span>
                      </td>
                      <td className={"text-center " + rowClass}>
                        {isWeekOff && !dayPunches.length ? (
                          <span className="badge bg-info bg-opacity-25 text-info px-3 py-2">
                            <FaCalendarAlt className="me-1" size={12} />
                            Week Off
                          </span>
                        ) : (
                          <div className="d-flex gap-2 justify-content-center">
                            {
                              <button
                                className="btn btn-outline-primary btn-sm"
                                onClick={() =>
                                  handleMissPunchRequest(dateStr, {
                                    id: userId,
                                    name: dashboardData.user.name,
                                  })
                                }
                                title="Request Missing Punch"
                              >
                                <FaPlus className="me-1" />
                                MP
                              </button>
                            }
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
          <CallsTable calls={dashboardData.callDetails} />
        )}

        {activeTab === "classes" && (
          <ClassesTable classes={dashboardData.classDetails} />
        )}

        {activeTab === "punchRequests" && (
          <MissPunchesTable missPunches={punchRequests} />
        )}
      </div>
    </div>
  );
};

export default UserDetailedAttendance;

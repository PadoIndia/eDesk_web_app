import { useState, useEffect } from "react";
import attendanceDashboardService from "../../../services/api-services/attendance-dashboard.service";
import { DepartmentResponse } from "../../../types/department-team.types";
import { LeaveScheme, LeaveRequestResponse } from "../../../types/leave.types";
import departmentService from "../../../services/api-services/department.service";
import leaveSchemeService from "../../../services/api-services/leave-scheme.service";
import leaveRequestService from "../../../services/api-services/leave-request.service";

interface AttendanceData {
  departmentName: string;
  companyName: string;
  reportMonth: string;
  data: EmployeeAttendanceRow[];
}

interface EmployeeAttendanceRow {
  empCode: string;
  name: string;
  userId: number;
  dailyAttendance: { [day: number]: string };
  department: string;
  summary: {
    present: number;
    weekOff: number;
    holiday: number;
    leave: number;
    absent: number;
    totalWorkingHours: string;
    overtime: string;
    breakHours: string;
  };
}

const leaveTypeToShortCode: { [key: string]: string } = {
  "SICK LEAVE": "SL",
  "CASUAL LEAVE": "CL",
  "PAID LEAVE": "PL",
  "UNPAID LEAVE": "UL",
  "COMPENSATORY LEAVE": "CO",
  "EARNED LEAVE": "EL",
};

const AttendanceReport = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<AttendanceData | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [leaveSchemeId, setLeaveSchemeId] = useState<number | undefined>();
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [leaveSchemes, setLeaveSchemes] = useState<LeaveScheme[]>([]);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequestResponse[]>(
    []
  );
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  useEffect(() => {
    departmentService.getDepartments().then((res) => {
      if (res.status === "success") setDepartments(res.data);
    });
    leaveSchemeService.getLeaveSchemes().then((res) => {
      if (res.status === "success") setLeaveSchemes(res.data);
    });
  }, []);

  useEffect(() => {
    if (leaveSchemeId) {
      fetchReport();
    }
  }, [month, year, departmentId, leaveSchemeId]);

  const fetchReport = async () => {
    try {
      if (!leaveSchemeId) return;

      setLoading(true);

      // Fetch leave requests first
      const leaveResp = await leaveRequestService.getLeaveRequests({});
      if (leaveResp.status === "success") {
        setLeaveRequests(leaveResp.data);
      }

      // Then fetch attendance data
      const response = await attendanceDashboardService.getSheetData({
        leaveSchemeId,
        year,
        month,
        departmentId,
      });

      if (response.status === "success") {
        setReportData(response.data);
      }
    } catch (error) {
      console.error("Error fetching report:", error);
    } finally {
      setLoading(false);
    }
  };

  const getLeaveRequestForDate = (userId: number, day: number) => {
    // Create current date with time reset to start of day
    const currentDate = new Date(year, month - 1, day);
    currentDate.setHours(0, 0, 0, 0);

    return leaveRequests.find((leave) => {
      if (leave.userId !== userId) return false;

      // Reset hours for start and end dates for accurate comparison
      const startDate = new Date(leave.startDate);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(leave.endDate);
      endDate.setHours(0, 0, 0, 0);

      return currentDate >= startDate && currentDate <= endDate;
    });
  };

  const isLeaveApproved = (leave: LeaveRequestResponse) => {
    return leave.managerStatus === "APPROVED" || leave.hrStatus === "APPROVED";
  };

  const downloadExcel = async () => {
    if (!reportData) return;

    setDownloadingExcel(true);

    try {
      const XLSX = await import("xlsx-js-style");

      const wb = XLSX.utils.book_new();

      const wsData = [
        [
          `Dept. Name: ${reportData.departmentName}`,
          "",
          "",
          `Report Month: ${reportData.reportMonth}`,
        ],
        [],
        [
          "Empcode",
          "Name",
          "Department",
          ...Array.from({ length: 31 }, (_, i) => (i + 1).toString()),
          "Pre",
          "WO",
          "HL",
          "LV",
          "Abs",
          "Work+OT",
          "OT",
          "Break",
        ],
      ];

      reportData.data.forEach((employee) => {
        const row = [
          employee.empCode,
          employee.name,
          employee.department,
          ...Array.from({ length: 31 }, (_, i) => {
            const day = i + 1;
            const originalStatus = employee.dailyAttendance[day] || "";

            // Check if there's a leave request for this date
            const leaveRequest = getLeaveRequestForDate(employee.userId, day);

            if (leaveRequest) {
              // Leave request exists, use leave type
              const leaveTypeName = leaveRequest.leaveType.name.toUpperCase();
              const shortCode = leaveTypeToShortCode[leaveTypeName] || "PL";

              // Always use leave type when leave request exists
              return leaveRequest.duration === 0.5
                ? `${shortCode}/2`
                : shortCode;
            }

            return originalStatus;
          }),
          employee.summary.present,
          employee.summary.weekOff,
          employee.summary.holiday,
          employee.summary.leave,
          employee.summary.absent,
          employee.summary.totalWorkingHours,
          employee.summary.overtime,
          employee.summary.breakHours,
        ];

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        wsData.push(row as any);
      });

      const ws = XLSX.utils.aoa_to_sheet(wsData);

      // Simplified styling - only essential styles
      const colWidths = [
        { wch: 12 },
        { wch: 20 },
        { wch: 20 },
        ...Array.from({ length: 31 }, () => ({ wch: 5 })),
        { wch: 5 },
        { wch: 5 },
        { wch: 5 },
        { wch: 5 },
        { wch: 5 },
        { wch: 10 },
        { wch: 8 },
        { wch: 8 },
      ];
      ws["!cols"] = colWidths;

      const range = XLSX.utils.decode_range(ws["!ref"] || "A1");

      // Apply minimal styling only to headers
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const headerCell = XLSX.utils.encode_cell({ r: 2, c: C });
        if (ws[headerCell]) {
          ws[headerCell].s = {
            font: { bold: true },
            fill: { patternType: "solid", fgColor: { rgb: "E2E8F0" } },
            alignment: { horizontal: "center" },
          };
        }
      }

      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
        { s: { r: 0, c: 2 }, e: { r: 0, c: 3 } },
      ];

      XLSX.utils.book_append_sheet(wb, ws, "Attendance Report");
      XLSX.writeFile(wb, `attendance-report-${month}-${year}.xlsx`);
    } catch (error) {
      console.error("Error generating Excel:", error);
      alert("Failed to generate Excel file. Please try again.");
    } finally {
      setDownloadingExcel(false);
    }
  };

  const getDayOfWeek = (day: number) => {
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString("en-US", { weekday: "short" }).charAt(0);
  };

  const daysInMonth = new Date(year, month, 0).getDate();

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-4">
      <div className="card border-0 shadow-sm">
        <div className="card-header bg-white border-bottom py-3">
          <div className="row align-items-center">
            <div className="col-md-6">
              <h4 className="mb-0">Attendance Report</h4>
              {reportData && (
                <div className="mt-2 text-muted">
                  <small>
                    {reportData.departmentName} | {reportData.reportMonth}
                  </small>
                </div>
              )}
            </div>
            <div className="col-md-6">
              <div className="d-flex flex-wrap gap-2 justify-content-md-end mt-3 mt-md-0">
                <select
                  className="form-select form-select-sm"
                  style={{ width: "auto" }}
                  value={leaveSchemeId || ""}
                  onChange={(e) =>
                    setLeaveSchemeId(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                  required
                >
                  <option value="">Select Leave Scheme</option>
                  {leaveSchemes.map((scheme) => (
                    <option key={scheme.id} value={scheme.id}>
                      {scheme.name}
                    </option>
                  ))}
                </select>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "auto" }}
                  value={departmentId || ""}
                  onChange={(e) =>
                    setDepartmentId(
                      e.target.value ? parseInt(e.target.value) : undefined
                    )
                  }
                >
                  <option value="">All Departments</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "auto" }}
                  value={month}
                  onChange={(e) => setMonth(parseInt(e.target.value))}
                >
                  {Array.from({ length: 12 }, (_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {new Date(0, i).toLocaleString("default", {
                        month: "long",
                      })}
                    </option>
                  ))}
                </select>
                <select
                  className="form-select form-select-sm"
                  style={{ width: "auto" }}
                  value={year}
                  onChange={(e) => setYear(parseInt(e.target.value))}
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    const y = new Date().getFullYear() - 2 + i;
                    return (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    );
                  })}
                </select>
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={fetchReport}
                  title="Refresh"
                  disabled={!leaveSchemeId}
                >
                  <i className="bi bi-arrow-clockwise"></i>
                </button>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={downloadExcel}
                  title="Download Excel"
                  disabled={!reportData || downloadingExcel}
                >
                  {downloadingExcel ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-1"
                        role="status"
                      >
                        <span className="visually-hidden">Loading...</span>
                      </span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="bi bi-download me-1"></i>
                      Excel
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body p-0">
          {!leaveSchemeId ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-calendar-check fs-1 mb-3 d-block"></i>
              <p>Please select a leave scheme to view the attendance report</p>
            </div>
          ) : !reportData && !loading ? (
            <div className="text-center py-5 text-muted">
              <i className="bi bi-file-earmark-text fs-1 mb-3 d-block"></i>
              <p>No data available for the selected criteria</p>
            </div>
          ) : (
            <div
              className="table-responsive"
              style={{ maxHeight: "600px", overflow: "auto" }}
            >
              <table className="table table-sm table-hover mb-0">
                <thead className="sticky-top bg-white">
                  <tr>
                    <th
                      className="text-center border-end"
                      style={{ minWidth: "100px" }}
                    >
                      Empcode
                    </th>
                    <th className="border-end" style={{ minWidth: "180px" }}>
                      Name
                    </th>
                    <th className="border-end" style={{ minWidth: "180px" }}>
                      Department
                    </th>
                    {Array.from({ length: daysInMonth }, (_, i) => (
                      <th
                        key={i + 1}
                        className="text-center px-1"
                        style={{ width: "45px", fontSize: "12px" }}
                      >
                        <div>
                          <div className="fw-bold">{i + 1}</div>
                          <div
                            className="text-muted"
                            style={{ fontSize: "10px" }}
                          >
                            {getDayOfWeek(i + 1)}
                          </div>
                        </div>
                      </th>
                    ))}
                    <th
                      className="text-center border-start"
                      style={{ fontSize: "12px" }}
                    >
                      Pre
                    </th>
                    <th className="text-center" style={{ fontSize: "12px" }}>
                      WO
                    </th>
                    <th className="text-center" style={{ fontSize: "12px" }}>
                      HL
                    </th>
                    <th className="text-center" style={{ fontSize: "12px" }}>
                      LV
                    </th>
                    <th className="text-center" style={{ fontSize: "12px" }}>
                      Abs
                    </th>
                    <th
                      className="text-center border-start"
                      style={{ fontSize: "12px" }}
                    >
                      Work+OT
                    </th>
                    <th className="text-center" style={{ fontSize: "12px" }}>
                      OT
                    </th>
                    <th className="text-center" style={{ fontSize: "12px" }}>
                      Break
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {reportData?.data.map((employee) => (
                    <tr key={employee.empCode}>
                      <td className="text-center fw-semibold border-end">
                        {employee.empCode}
                      </td>
                      <td className="border-end">{employee.name}</td>
                      <td className="border-end">{employee.department}</td>
                      {Array.from({ length: daysInMonth }, (_, i) => {
                        // Always check for leave request first, regardless of original status
                        const day = i + 1;
                        const originalStatus =
                          employee.dailyAttendance[day] || "";

                        // Check if there's a leave request for this date
                        const leaveRequest = getLeaveRequestForDate(
                          employee.userId,
                          day
                        );
                        let status = originalStatus;
                        let isPending = false;

                        if (leaveRequest) {
                          // Leave request exists, use leave type
                          const leaveTypeName =
                            leaveRequest.leaveType.name.toUpperCase();
                          const shortCode =
                            leaveTypeToShortCode[leaveTypeName] || "PL";
                          const isApproved = isLeaveApproved(leaveRequest);

                          // Always use leave type when leave request exists
                          status =
                            leaveRequest.duration === 0.5
                              ? `${shortCode}/2`
                              : shortCode;
                          isPending = !isApproved;
                        }

                        let textColor = "";
                        let fontWeight = "normal";

                        if (status === "P") {
                          textColor = "text-primary";
                          fontWeight = "fw-semibold";
                        } else if (status === "A") {
                          textColor = "text-danger";
                          fontWeight = "fw-semibold";
                        } else if (status === "P/2" || status.includes("/2")) {
                          textColor = "text-warning";
                          fontWeight = "fw-semibold";
                        } else if (status === "WO") {
                          textColor = "text-secondary";
                        } else if (status === "H") {
                          textColor = "text-info";
                        } else if (
                          ["SL", "CL", "PL", "UL", "CO", "EL"].includes(status)
                        ) {
                          textColor = "text-purple";
                        }

                        return (
                          <td
                            key={day}
                            className={`text-center px-1 ${textColor} ${fontWeight}`}
                            style={{ fontSize: "12px", position: "relative" }}
                            title={
                              leaveRequest
                                ? `${leaveRequest.leaveType.name}${
                                    isPending ? " (Pending)" : " (Approved)"
                                  }`
                                : ""
                            }
                          >
                            {status || "—"}
                            {isPending && (
                              <i
                                className="bi bi-clock-fill text-warning"
                                style={{
                                  fontSize: "8px",
                                  position: "absolute",
                                  top: "2px",
                                  right: "2px",
                                }}
                                title="Pending Approval"
                              ></i>
                            )}
                          </td>
                        );
                      })}
                      <td className="text-center fw-semibold text-primary border-start">
                        {employee.summary.present}
                      </td>
                      <td className="text-center">
                        {employee.summary.weekOff}
                      </td>
                      <td className="text-center">
                        {employee.summary.holiday}
                      </td>
                      <td className="text-center">{employee.summary.leave}</td>
                      <td className="text-center fw-semibold text-danger">
                        {employee.summary.absent}
                      </td>
                      <td className="text-center fw-semibold border-start">
                        {employee.summary.totalWorkingHours}
                      </td>
                      <td className="text-center text-purple">
                        {employee.summary.overtime}
                      </td>
                      <td className="text-center">
                        {employee.summary.breakHours}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-footer bg-white border-top py-3">
          <div className="d-flex flex-wrap gap-4 small">
            <div>
              <span className="text-primary fw-semibold">P</span> - Present
            </div>
            <div>
              <span className="text-warning fw-semibold">P/2</span> - Half Day
            </div>
            <div>
              <span className="text-danger fw-semibold">A</span> - Absent
            </div>
            <div>
              <span className="text-secondary">WO</span> - Week Off
            </div>
            <div>
              <span className="text-info">H</span> - Holiday
            </div>
            <div>
              <span className="text-purple">SL/CL/PL</span> - Leave Types
            </div>
            <div>
              <span className="text-warning fw-semibold">HD/2, SL/2</span> -
              Half Day Leaves
            </div>
            <div>
              <i className="bi bi-clock-fill text-warning"></i> - Pending Leave
            </div>
          </div>
          <div className="text-muted small mt-2">
            <em>
              Note: Overtime (OT) is calculated for hours worked beyond 9 hours.
            </em>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttendanceReport;

import { useState, useEffect } from "react";
import attendanceDashboardService from "../../../services/api-services/attendance-dashboard.service";
import { DepartmentResponse } from "../../../types/department-team.types";
import { LeaveScheme } from "../../../types/leave.types";
import departmentService from "../../../services/api-services/department.service";
import leaveSchemeService from "../../../services/api-services/leave-scheme.service";
import { statusToShortCode } from "../../../utils/constants";
import { Spinner } from "../../../components/loading";

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

const AttendanceReport = () => {
  const [loading, setLoading] = useState(false);
  const [reportData, setReportData] = useState<AttendanceData | null>(null);
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [year, setYear] = useState(new Date().getFullYear());
  const [departmentId, setDepartmentId] = useState<number | undefined>();
  const [leaveSchemeId, setLeaveSchemeId] = useState<number | undefined>();
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [leaveSchemes, setLeaveSchemes] = useState<LeaveScheme[]>([]);
  const [downloadingExcel, setDownloadingExcel] = useState(false);

  useEffect(() => {
    Promise.all([
      departmentService.getDepartments(),
      leaveSchemeService.getLeaveSchemes(),
    ]).then(([deptRes, schemeRes]) => {
      if (deptRes.status === "success") setDepartments(deptRes.data);
      if (schemeRes.status === "success") setLeaveSchemes(schemeRes.data);
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

  const getStatusShortCode = (status: string): string => {
    return statusToShortCode[status] || status;
  };

  const downloadExcel = async () => {
    if (!reportData) return;
    setDownloadingExcel(true);

    try {
      const XLSX = await import("xlsx-js-style");
      const wb = XLSX.utils.book_new();

      // Header rows
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

      // Data rows
      reportData.data.forEach((employee) => {
        const row = [
          employee.empCode,
          employee.name,
          employee.department,
          ...Array.from({ length: 31 }, (_, i) => {
            const status = employee.dailyAttendance[i + 1] || "";
            return getStatusShortCode(status);
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

      // Column widths
      ws["!cols"] = [
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

      const range = XLSX.utils.decode_range(ws["!ref"] || "A1");

      // Apply styles
      for (let R = 0; R <= range.e.r; ++R) {
        for (let C = 0; C <= range.e.c; ++C) {
          const cellRef = XLSX.utils.encode_cell({ r: R, c: C });
          if (!ws[cellRef]) continue;

          // Header row styling
          if (R === 2) {
            ws[cellRef].s = {
              font: { bold: true, color: { rgb: "FFFFFF" } },
              fill: { patternType: "solid", fgColor: { rgb: "2E7D32" } },
              alignment: { horizontal: "center", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "000000" } },
                bottom: { style: "thin", color: { rgb: "000000" } },
                left: { style: "thin", color: { rgb: "000000" } },
                right: { style: "thin", color: { rgb: "000000" } },
              },
            };
          }
          // Title row styling
          else if (R === 0) {
            ws[cellRef].s = {
              font: { bold: true, size: 12 },
              alignment: { horizontal: "left" },
            };
          }
          // Data rows styling
          else if (R > 2) {
            const cellValue = ws[cellRef].v?.toString() || "";
            let bgColor = "FFFFFF";
            let fontColor = "000000";

            // Status column styling (columns 3-33)
            if (C >= 3 && C <= 33) {
              if (cellValue === "P") {
                bgColor = "E8F5E9";
                fontColor = "2E7D32";
              } else if (cellValue === "A") {
                bgColor = "FFEBEE";
                fontColor = "C62828";
              } else if (cellValue.includes("/2")) {
                bgColor = "FFF3E0";
                fontColor = "EF6C00";
              } else if (cellValue === "WO") {
                bgColor = "E3F2FD";
                fontColor = "1565C0";
              } else if (cellValue === "H") {
                bgColor = "E1F5FE";
                fontColor = "0277BD";
              } else if (
                ["SL", "CL", "FL", "UL", "CO", "EL"].includes(cellValue)
              ) {
                bgColor = "F3E5F5";
                fontColor = "6A1B9A";
              }
            }
            // Summary columns styling
            else if (C === 34) {
              // Present
              bgColor = "E8F5E9";
              fontColor = "2E7D32";
            } else if (C === 38) {
              // Absent
              bgColor = "FFEBEE";
              fontColor = "C62828";
            }

            ws[cellRef].s = {
              fill: { patternType: "solid", fgColor: { rgb: bgColor } },
              font: { color: { rgb: fontColor }, bold: C >= 34 && C <= 38 },
              alignment: { horizontal: "center", vertical: "center" },
              border: {
                top: { style: "thin", color: { rgb: "E0E0E0" } },
                bottom: { style: "thin", color: { rgb: "E0E0E0" } },
                left: { style: "thin", color: { rgb: "E0E0E0" } },
                right: { style: "thin", color: { rgb: "E0E0E0" } },
              },
            };
          }
        }
      }

      // Merge cells for title
      ws["!merges"] = [
        { s: { r: 0, c: 0 }, e: { r: 0, c: 1 } },
        { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } },
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

  const getStatusStyle = (status: string) => {
    const shortCode = getStatusShortCode(status);

    switch (shortCode) {
      case "P":
        return "text-primary fw-semibold";
      case "A":
        return "text-danger fw-semibold";
      case "WO":
        return "text-secondary";
      case "H":
        return "text-info";
      case "SL":
      case "CL":
      case "FL":
      case "UL":
      case "CO":
      case "EL":
        return "text-purple";
      default:
        return shortCode.includes("/2") ? "text-warning fw-semibold" : "";
    }
  };

  const daysInMonth = new Date(year, month, 0).getDate();

  if (loading) {
    return <Spinner />;
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
                        const day = i + 1;
                        const status = employee.dailyAttendance[day] || "";
                        const shortCode = getStatusShortCode(status);
                        const styleClass = getStatusStyle(status);

                        return (
                          <td
                            key={day}
                            className={`text-center px-1 ${styleClass}`}
                            style={{ fontSize: "12px" }}
                          >
                            {shortCode || "—"}
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
              <span className="text-purple">SL/CL/FL</span> - Leave Types
            </div>
            <div>
              <span className="text-warning fw-semibold">HD/2, SL/2</span> -
              Half Day Leaves
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

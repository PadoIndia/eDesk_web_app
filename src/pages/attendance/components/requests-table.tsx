import React from "react";
import {
  FaUserCircle,
  FaBuilding,
  FaCalendarAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
  FaExclamationCircle,
  FaClipboardList,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import { Punch } from "../../../types/attendance.types";

interface RequestsTableProps {
  filteredRequests: Punch[];
  handleApproveReject: (request: Punch, action: "approve" | "reject") => void;
  isAdmin: boolean;
}

const RequestsTable: React.FC<RequestsTableProps> = ({
  filteredRequests,
  handleApproveReject,
  isAdmin,
}) => {
  const formatTime = (hh: number, mm: number) => {
    return `${hh.toString().padStart(2, "0")}:${mm
      .toString()
      .padStart(2, "0")}`;
  };

  const getStatusBadge = (isApproved: boolean | null) => {
    if (isApproved === null) {
      return (
        <span className="badge bg-warning text-dark rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1">
          <FaExclamationCircle size={12} />
          Pending
        </span>
      );
    } else if (isApproved) {
      return (
        <span className="badge bg-success rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1">
          <FaCheckCircle size={12} />
          Approved
        </span>
      );
    } else {
      return (
        <span className="badge bg-danger rounded-pill px-3 py-2 d-inline-flex align-items-center gap-1">
          <FaTimesCircle size={12} />
          Rejected
        </span>
      );
    }
  };

  return (
    <div className="card shadow-sm rounded-lg">
      <div className="card-body p-0">
        <div className="table-responsive">
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr className="bg-light">
                <th className="px-4 py-3">
                  <div className="d-flex align-items-center gap-2">
                    <FaUserCircle className="text-muted" size={16} />
                    Employee
                  </div>
                </th>
                <th className="px-4 py-3">
                  <div className="d-flex align-items-center gap-2">
                    <FaBuilding className="text-muted" size={16} />
                    Department
                  </div>
                </th>
                <th className="px-4 py-3">
                  <div className="d-flex align-items-center gap-2">
                    <FaCalendarAlt className="text-muted" size={16} />
                    Date
                  </div>
                </th>
                <th className="px-4 py-3 text-center">
                  <div className="d-flex align-items-center justify-content-center gap-2">
                    <FaClock className="text-muted" size={16} />
                    Time
                  </div>
                </th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3 text-center">Status</th>
                {isAdmin && <th className="px-4 py-3 text-center">Actions</th>}
              </tr>
            </thead>
            <tbody>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request, index) => {
                  const requestDate = new Date(
                    request.year,
                    request.month - 1,
                    request.date
                  );
                  const isWeekend =
                    requestDate.getDay() === 0 || requestDate.getDay() === 6;

                  return (
                    <tr
                      key={request.id}
                      className={
                        index % 2 === 0 ? "" : "bg-light bg-opacity-50"
                      }
                    >
                      <td className="px-4 py-3">
                        <div className="d-flex align-items-center gap-2">
                          <div
                            className="rounded-circle bg-primary bg-opacity-10 text-primary d-flex align-items-center justify-content-center"
                            style={{
                              width: "32px",
                              height: "32px",
                              fontSize: "14px",
                              fontWeight: "600",
                            }}
                          >
                            {request.user?.name
                              ? request.user?.name.charAt(0).toUpperCase()
                              : "U"}
                          </div>
                          <div>
                            <div className="fw-semibold">
                              {request.user?.name || "Unknown"}
                            </div>
                            <small className="text-muted">
                              ID: {request.userId}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="badge bg-primary-subtle text-primary fw-normal rounded-pill px-3 py-1">
                          {request.userDepartment || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div>
                          <div className="fw-semibold">
                            {requestDate.toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </div>
                          <small
                            className={`${
                              isWeekend
                                ? "text-danger fw-semibold"
                                : "text-muted"
                            }`}
                          >
                            {requestDate.toLocaleDateString("en-US", {
                              weekday: "short",
                            })}
                          </small>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className="badge bg-secondary rounded-pill px-3 py-2">
                          {formatTime(request.hh || 0, request.mm || 0)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div
                          className="text-truncate"
                          style={{ maxWidth: "250px" }}
                          title={
                            request.missPunchReason || "No reason provided"
                          }
                        >
                          {request.missPunchReason ? (
                            <span>{request.missPunchReason}</span>
                          ) : (
                            <span className="text-muted fst-italic">
                              No reason provided
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        {getStatusBadge(request.isApproved)}
                      </td>

                      {isAdmin && (
                        <td className="px-4 py-3">
                          {request.isApproved === null ? (
                            <div className="d-flex gap-2 justify-content-center">
                              <button
                                className="btn btn-success btn-sm d-inline-flex align-items-center gap-1 px-3"
                                onClick={() =>
                                  handleApproveReject(request, "approve")
                                }
                                title="Approve Request"
                              >
                                <FaCheck size={12} />
                                Approve
                              </button>
                              <button
                                className="btn btn-danger btn-sm d-inline-flex align-items-center gap-1 px-3"
                                onClick={() =>
                                  handleApproveReject(request, "reject")
                                }
                                title="Reject Request"
                              >
                                <FaTimes size={12} />
                                Reject
                              </button>
                            </div>
                          ) : (
                            <div className="text-center">
                              <span className="badge bg-secondary bg-opacity-25 text-secondary px-3 py-2">
                                Processed
                              </span>
                            </div>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} className="text-center py-5">
                    <div className="text-muted">
                      <FaClipboardList className="mb-3 opacity-50" size={48} />
                      <p className="mb-0 fs-5">No punch requests found</p>
                      <small>
                        All requests have been processed or there are no new
                        requests
                      </small>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RequestsTable;

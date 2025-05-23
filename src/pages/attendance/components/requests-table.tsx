import React from "react";
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
  const formatDate = (date: number, month: number, year: number): string => {
    return `${year}-${String(month).padStart(2, "0")}-${String(date).padStart(2, "0")}`;
  };

  return (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Employee</th>
            <th>Department</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th>Status</th>
            {isAdmin && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {filteredRequests.length > 0 ? (
            filteredRequests.map((request) => (
              <tr key={request.id}>
                <td>{request.userName || "Unknown"}</td>
                <td>{request.userDepartment || "Unknown"}</td>
                <td>{formatDate(request.date, request.month, request.year)}</td>
                <td>{request.time}</td>
                <td>{request.missPunchReason || "No reason provided"}</td>
                <td>
                  {request.isApproved === null ? (
                    <span className="badge bg-warning">Pending</span>
                  ) : request.isApproved ? (
                    <span className="badge bg-success">Approved</span>
                  ) : (
                    <span className="badge bg-danger">Rejected</span>
                  )}
                </td>
                {isAdmin && request.isApproved === null && (
                  <td>
                    <button
                      className="btn btn-sm btn-success me-2"
                      onClick={() => handleApproveReject(request, "approve")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => handleApproveReject(request, "reject")}
                    >
                      Reject
                    </button>
                  </td>
                )}
                {isAdmin && request.isApproved !== null && (
                  <td>
                    <span className="text-muted">No actions available</span>
                  </td>
                )}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? 7 : 6} className="text-center">
                No pending requests found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RequestsTable;

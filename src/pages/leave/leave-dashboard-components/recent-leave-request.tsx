import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaClipboardList, FaSearch } from "react-icons/fa";
import { LeaveRequestResponse } from "../../../types/leave.types";
import { getFinalLeaveRequestStatus } from "../../../utils/helper";

interface DateFormatOptions {
  year: "numeric";
  month: "short";
  day: "numeric";
}

interface RecentLeaveRequestsProps {
  recentRequests: LeaveRequestResponse[];
  loading?: boolean;
}

const RecentLeaveRequestsComponent: React.FC<RecentLeaveRequestsProps> = ({
  recentRequests,
  loading = false,
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "bg-subtle-success text-success";
      case "PENDING":
        return "bg-subtle-warning text-warning";
      case "REJECTED":
        return "bg-subtle-danger text-danger";
      case "CANCELLED":
        return "bg-subtle-secondary text-secondary";
      default:
        return "bg-subtle-primary text-primary";
    }
  };

  const formatDate = (dateString: string): string => {
    const options: DateFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const filteredRequests = recentRequests.filter(
    (request) =>
      request.leaveType.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      request.hrStatus?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.reason?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="card h-100">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaClipboardList className="me-2" /> Recent Leave Requests
          </h5>
          <div
            className="input-group input-group-sm"
            style={{ width: "150px" }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Search..."
              disabled
            />
            <button
              className="btn btn-outline-secondary"
              type="button"
              disabled
            >
              <FaSearch />
            </button>
          </div>
        </div>
        <div className="card-body d-flex justify-content-center align-items-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="card h-100">
      <div className="card-header bg-light d-flex justify-content-between align-items-center">
        <h5 className="mb-0">
          <FaClipboardList className="me-2" /> Recent Leave Requests
        </h5>
        <div className="input-group input-group-sm" style={{ width: "150px" }}>
          <input
            type="text"
            className="form-control"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-outline-secondary" type="button">
            <FaSearch />
          </button>
        </div>
      </div>
      <div className="card-body d-flex flex-column">
        <div className="flex-grow-1">
          {filteredRequests.length > 0 ? (
            <div className="list-group">
              {filteredRequests.map((request) => (
                <div
                  // to={`/hrm/leave-request/${request.id}`}
                  key={request.id}
                  className="list-group-item list-group-item-action"
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">{request.leaveType.name}</h6>
                    <span
                      className={`badge ${getStatusColor(request.hrStatus)}`}
                    >
                      {getFinalLeaveRequestStatus(
                        request.hrStatus,
                        request.managerStatus
                      )}
                    </span>
                  </div>
                  <p className="mb-1 text-muted">
                    {formatDate(request.startDate)} -{" "}
                    {formatDate(request.endDate)}
                    <span className="ms-2">({request.duration} days)</span>
                  </p>
                  <small>{request.reason}</small>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <p>
                {searchTerm
                  ? "No leave requests match your search"
                  : "No recent leave requests"}
              </p>
            </div>
          )}
        </div>
        <div className="mt-auto text-center pt-3">
          <Link
            to="/hrm/leave-requests"
            className="btn btn-outline-primary btn-sm"
          >
            View All Leave Requests
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RecentLeaveRequestsComponent;

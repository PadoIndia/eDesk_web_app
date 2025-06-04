import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaClipboardList, FaSearch } from "react-icons/fa";
import Badge from "../../../components/badge";

interface LeaveRequest {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: string;
  reason: string;
}

interface DateFormatOptions {
  year: "numeric";
  month: "short";
  day: "numeric";
}

interface RecentLeaveRequestsProps {
  recentRequests: LeaveRequest[];
  loading?: boolean;
}

const RecentLeaveRequestsComponent: React.FC<RecentLeaveRequestsProps> = ({ 
  recentRequests, 
  loading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState("");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "APPROVED":
        return "badge-approved";
      case "PENDING":
        return "badge-pending";
      case "REJECTED":
        return "badge-rejected";
      case "CANCELLED":
        return "badge-cancelled";
      default:
        return "badge-default";
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

  const filteredRequests = recentRequests.filter(request =>
    request.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    request.status?.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
            <button className="btn btn-outline-secondary" type="button" disabled>
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
        <div
          className="input-group input-group-sm"
          style={{ width: "150px" }}
        >
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
                <Link
                  to={`/hrm/leave-request/${request.id}`}
                  key={request.id}
                  className="list-group-item list-group-item-action"
                >
                  <div className="d-flex w-100 justify-content-between">
                    <h6 className="mb-1">{request.type}</h6>
                    <Badge 
                      label={request.status} 
                      colorClassName={getStatusColor(request.status)} 
                    />
                  </div>
                  <p className="mb-1 text-muted">
                    {formatDate(request.startDate)} -{" "}
                    {formatDate(request.endDate)}
                    <span className="ms-2">
                      ({request.duration} days)
                    </span>
                  </p>
                  <small>{request.reason}</small>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted py-4">
              <p>
                {searchTerm 
                  ? "No leave requests match your search" 
                  : "No recent leave requests"
                }
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
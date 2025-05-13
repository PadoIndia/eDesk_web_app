import React, { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaClipboardList,
  FaChartBar,
  FaUserClock,
  FaPlus,
  FaSearch,
  FaCircle,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import Badge from "../../components/badge";


const LeaveDashboard = () => {
  interface LeaveBalance {
    id: number;
    type: string;
    total: number;
    used: number;
    remaining: number;
    isPaid: boolean;
  }

  interface LeaveRequest {
    id: number;
    type: string;
    startDate: string;
    endDate: string;
    duration: number;
    status: string;
    reason: string;
  }

  // State for dashboard data
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
  const [recentRequests, setRecentRequests] = useState<LeaveRequest[]>([]);
  const [leaveStats, setLeaveStats] = useState({
    pending: 0,
    approved: 0,
    rejected: 0,
    total: 0,
  });
  const [loading, setLoading] = useState(true);

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setLeaveBalance([
        {
          id: 1,
          type: "Annual Leave",
          total: 20,
          used: 8,
          remaining: 12,
          isPaid: true,
        },
        {
          id: 2,
          type: "Sick Leave",
          total: 12,
          used: 3,
          remaining: 9,
          isPaid: true,
        },
        {
          id: 3,
          type: "Unpaid Leave",
          total: 30,
          used: 0,
          remaining: 30,
          isPaid: false,
        },
        {
          id: 4,
          type: "Bereavement Leave",
          total: 5,
          used: 0,
          remaining: 5,
          isPaid: true,
        },
      ]);

      setRecentRequests([
        {
          id: 101,
          type: "Annual Leave",
          startDate: "2025-05-10",
          endDate: "2025-05-12",
          duration: 3,
          status: "APPROVED",
          reason: "Family vacation",
        },
        {
          id: 102,
          type: "Sick Leave",
          startDate: "2025-04-20",
          endDate: "2025-04-21",
          duration: 2,
          status: "APPROVED",
          reason: "Fever and cold",
        },
        {
          id: 103,
          type: "Annual Leave",
          startDate: "2025-06-15",
          endDate: "2025-06-16",
          duration: 2,
          status: "PENDING",
          reason: "Personal work",
        },
      ]);

      setLeaveStats({
        pending: 2,
        approved: 5,
        rejected: 1,
        total: 8,
      });

      setLoading(false);
    }, 1000);
  }, []);

  // Helper function for status badge color
  interface LeaveStatus {
    APPROVED: "success";
    PENDING: "warning";
    REJECTED: "danger";
    CANCELLED: "secondary";
  }

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

  // Function to format date
  interface DateFormatOptions {
    year: "numeric";
    month: "short";
    day: "numeric";
  }

  const formatDate = (dateString: string): string => {
    const options: DateFormatOptions = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div
        className="container d-flex justify-content-center align-items-center"
        style={{ minHeight: "70vh" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="mb-0">Leave Dashboard</h1>
        <div className="gap-2 d-flex">
        <Link to="/hrm/apply-leave" className="btn btn-primary">
          <FaPlus className="me-2" /> Apply for Leave
        </Link>
        <Link to="/hrm/leave-config" className="btn btn-primary">
          <FaCalendarAlt className="me-2" /> Leave Configuration
        </Link>
        </div>
      </div>
      <div className="row g-4">
        {/* Leave Balance */}
        <div className="col-md-6">
          <div className="card h-100">
            <div className="card-header bg-light">
              <h5 className="mb-0">
                <FaChartBar className="me-2" /> Leave Balance
              </h5>
            </div>
            <div className="card-body d-flex flex-column">
              <div className="flex-grow-1">
                <div className="table-responsive">
                  <table className="table table-hover">
                    <thead>
                      <tr>
                        <th>Leave Type</th>
                        <th>Total</th>
                        <th>Used</th>
                        <th>Remaining</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leaveBalance.map((leave) => (
                        <tr key={leave.id}>
                          <td>
                            <div className="d-flex align-items-center">
                              <FaCircle
                                className="me-2"
                                color={leave.isPaid ? "#28a745" : "#6c757d"}
                                size={10}
                              />
                              {leave.type}
                              {leave.isPaid && (
                                <Badge label="Paid" status="SUCCESS" />
                              )}
                            </div>
                          </td>
                          <td>{leave.total}</td>
                          <td>{leave.used}</td>
                          <td>
                            <span className="badge bg-primary">
                              {leave.remaining}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className="mt-auto text-center pt-3">
                <Link
                  to="/hrm/leave-transactions"
                  className="btn btn-outline-primary btn-sm"
                >
                  View Leave Transaction History
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Leave Requests */}
        <div className="col-md-6">
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
                />
                <button className="btn btn-outline-secondary" type="button">
                  <FaSearch />
                </button>
              </div>
            </div>
            <div className="card-body d-flex flex-column">
              <div className="flex-grow-1">
                {recentRequests.length > 0 ? (
                  <div className="list-group">
                    {recentRequests.map((request) => (
                      <Link
                        to={`/hrm/leave-request/${request.id}`}
                        key={request.id}
                        className="list-group-item list-group-item-action"
                      >
                        <div className="d-flex w-100 justify-content-between">
                          <h6 className="mb-1">{request.type}</h6>
                          <Badge label={request.status} colorClassName={getStatusColor(request.status)}  />
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
                    <p>No recent leave requests</p>
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
        </div>
      </div>
    </div>
  );
};

export default LeaveDashboard;

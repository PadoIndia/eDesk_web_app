import { useState, useEffect } from "react";
import {
  FaSearch,
  FaFilter,
  FaCalendarAlt,
  FaUser,
  FaCheck,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "../../App.css";
import Badge from "../../components/badge";
import leaveRequestService from "../../services/api-services/leave-request.service";
import { CreateLeaveRequestRequest } from "../../types/leave.types";
import { useAppSelector } from "../../store/store";
import userService from "../../services/api-services/user.service";

interface LeaveRequest {
  id: number;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  reason: string;
  submittedOn: string;
}

const LeaveRequests = () => {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [dateFilter, setDateFilter] = useState<{
    start: Date | null;
    end: Date | null;
  }>({
    start: null,
    end: null,
  });

  const userId = useAppSelector((s)=>s.auth.userData?.user.id);

  
  useEffect(() => {
    const fetchRequests = async () => {
      
      const user = await userService.getUserById(userId);
      
      setLoading(true);
      
      try {
        let response;
        if (user?.role === "MANAGER") {
          response = await leaveRequestService.getLeaveRequestsForManagerApproval();
        } else if (user?.role === "HR") {
          response = await leaveRequestService.getLeaveRequestsForHRApproval();
        } else {
          response = await leaveRequestService.getMyLeaveRequests();
        }
        
        setRequests(response.data);
      } catch (error) {
        console.error("Failed to fetch leave requests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user?.role]);

  const filteredRequests = requests.filter((request) => {
    // Search filter
    const matchesSearch =
      request.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.leaveType.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter
    const matchesStatus = statusFilter ? request.status === statusFilter : true;

    // Date range filter
    const matchesDate =
      dateFilter.start && dateFilter.end
        ? new Date(request.startDate) >= dateFilter.start &&
          new Date(request.endDate) <= dateFilter.end
        : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

const handleApprove = async (id: number) => {
    try {
      const data: ManagerApproveRejectLeaveRequestRequest = {
        status: "APPROVED",
        comment: "Approved by manager"
      };
      await leaveRequestService.managerApproveRejectLeaveRequest(id, data);
      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, status: "APPROVED" } : req
        )
      );
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      const data: ManagerApproveRejectLeaveRequestRequest = {
        status: "REJECTED",
        comment: "Rejected by manager"
      };
      await leaveRequestService.managerApproveRejectLeaveRequest(id, data);
      setRequests(
        requests.map((req) =>
          req.id === id ? { ...req, status: "REJECTED" } : req
        )
      );
    } catch (error) {
      console.error("Failed to reject request:", error);
    }
  };

  const getStatusBadge = (status: string) => {
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  return (
    <div className="container py-4">
      <div className="card">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Leave Requests</h2>
          <div className="d-flex">
            <div className="input-group me-2" style={{ width: "250px" }}>
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle"
                type="button"
                id="filterDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <FaFilter className="me-1" /> Filters
              </button>
              <ul className="dropdown-menu" aria-labelledby="filterDropdown">
                <li>
                  <h6 className="dropdown-header">Status</h6>
                  <div className="px-3">
                    <select
                      className="form-select form-select-sm"
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                    >
                      <option value="">All Statuses</option>
                      <option value="PENDING">Pending</option>
                      <option value="APPROVED">Approved</option>
                      <option value="REJECTED">Rejected</option>
                      <option value="CANCELLED">Cancelled</option>
                    </select>
                  </div>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <h6 className="dropdown-header">Date Range</h6>
                  <div className="px-3">
                    <div className="mb-2">
                      <label className="form-label small">Start Date</label>
                      <DatePicker
                        selected={dateFilter.start}
                        onChange={(date) =>
                          setDateFilter({ ...dateFilter, start: date })
                        }
                        selectsStart
                        startDate={dateFilter.start}
                        endDate={dateFilter.end}
                        className="form-control form-control-sm"
                        placeholderText="Start date"
                      />
                    </div>
                    <div>
                      <label className="form-label small">End Date</label>
                      <DatePicker
                        selected={dateFilter.end}
                        onChange={(date) =>
                          setDateFilter({ ...dateFilter, end: date })
                        }
                        selectsEnd
                        startDate={dateFilter.start}
                        endDate={dateFilter.end}
                        {...(dateFilter.start && { minDate: dateFilter.start })}
                        className="form-control form-control-sm"
                        placeholderText="End date"
                      />
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : filteredRequests.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaInfoCircle size={48} className="mb-3" />
              <h4>No leave requests found</h4>
              <p>Try adjusting your filters</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Leave Type</th>
                    <th>Dates</th>
                    <th>Duration</th>
                    <th>Status</th>
                    <th>Submitted On</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => (
                    <tr key={request.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="avatar-sm bg-light rounded-circle me-2 d-flex align-items-center justify-content-center">
                            <FaUser className="text-muted" />
                          </div>
                          {request.employeeName}
                        </div>
                      </td>
                      <td>{request.leaveType}</td>
                      <td>
                        <div className="d-flex align-items-center">
                          <FaCalendarAlt className="me-2 text-muted" />
                          {formatDate(request.startDate)} -{" "}
                          {formatDate(request.endDate)}
                        </div>
                      </td>
                      <td>{request.duration} day(s)</td>
                      <td>
                        <Badge label={request.status} colorClassName={getStatusBadge(request.status)} />
                      </td>
                      <td>{formatDate(request.submittedOn)}</td>
                      <td>
                        <div className="d-flex gap-2">
                          {request.status === "PENDING" && (
                            <>
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleApprove(request.id)}
                              >
                                <FaCheck />
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleReject(request.id)}
                              >
                                <FaTimes />
                              </button>
                            </>
                          )}
                          <button className="btn btn-sm btn-outline-primary">
                            <FaInfoCircle />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-footer bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Showing {filteredRequests.length} of {requests.length} requests
            </small>
            <nav>
              <ul className="pagination pagination-sm mb-0">
                <li className="page-item disabled">
                  <a className="page-link" href="#" tabIndex={-1}>
                    Previous
                  </a>
                </li>
                <li className="page-item active">
                  <a className="page-link" href="#">
                    1
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    2
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    3
                  </a>
                </li>
                <li className="page-item">
                  <a className="page-link" href="#">
                    Next
                  </a>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaveRequests;

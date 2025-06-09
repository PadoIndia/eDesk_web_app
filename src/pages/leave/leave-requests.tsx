import { useState, useEffect, useCallback } from "react";
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
import {
  ManagerApproveRejectLeaveRequestRequest,
  HRApproveRejectLeaveRequestRequest,
  LeaveRequestStatus,
} from "../../types/leave.types";
import { useAppSelector } from "../../store/store";
// import { useDispatch } from "react-redux";
import { IsDeptManager, IsHr, isTeamManager } from "../../utils/helper";

// Updated interface to match API response structure
interface LeaveRequest {
  id: number;
  userId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  managerId: number;
  hrId: number;
  submittedOn: string;
  updatedOn: string;
  managerStatus: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  hrStatus: "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";
  comment: string | null;
  leaveType: {
    id: number;
    name: string;
    description: string;
  };
  user: {
    id: number;
    name: string;
    username: string;
  };
}

const LeaveRequests = () => {
  // const dispatch = useDispatch<AppDispatch>();

  // All useState hooks first
  const [myRequests, setMyRequests] = useState<LeaveRequest[]>([]);
  const [othersRequests, setOthersRequests] = useState<LeaveRequest[]>([]);
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
  const [activeTab, setActiveTab] = useState<"my-requests" | "others-requests">("my-requests");
  const [isTeamManagerState, setIsTeamManagerState] = useState<boolean>(false);

  // All useAppSelector hooks
  const userId = useAppSelector((s) => s.auth.userData?.user.id);

  // All static helper function calls (these don't use hooks internally that would affect order)
  const isHR = IsHr();
  const isDeptManager = IsDeptManager();
  const isManager = isTeamManagerState || isDeptManager;

  // Memoized functions
  const canApproveReject = useCallback(() => {
    return isHR || isManager;
  }, [isHR, isManager]);

  const showTabs = useCallback(() => {
    return isHR || isManager;
  }, [isHR, isManager]);

  // Helper function to get the effective status based on user role
  const getEffectiveStatus = useCallback((request: LeaveRequest) => {
    if (isHR) {
      return request.hrStatus;
    } else if (isManager) {
      return request.managerStatus;
    }
    return request.hrStatus;
  }, [isHR, isManager]);

  // Check team manager status - separate useEffect with proper dependencies
  useEffect(() => {
    let isMounted = true;
    
    const checkTeamManagerStatus = async () => {
      try {
        const isTeamManagerResult = await isTeamManager();
        if (isMounted) {
          setIsTeamManagerState(isTeamManagerResult);
        }
      } catch (error) {
        console.error("Failed to check team manager status:", error);
        if (isMounted) {
          setIsTeamManagerState(false);
        }
      }
    };

    checkTeamManagerStatus();

    return () => {
      isMounted = false;
    };
  }, []); // Empty dependency array - only run once on mount

  // Main data fetching useEffect with proper dependencies
  useEffect(() => {
    let isMounted = true;

    const fetchUserAndRequests = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        const myRequestsResponse = await leaveRequestService.getMyLeaveRequests();
        if (isMounted) {
          setMyRequests(myRequestsResponse.data);
        }

        // Fetch others' requests only if user is HR or Manager
        if (isHR || isManager) {
          let allOthersRequests: any[] = [];

          if (isHR && isManager) {
            // User is both HR and Manager - fetch both types
            const [managerResponse, hrResponse] = await Promise.all([
              leaveRequestService.getLeaveRequestsForManagerApproval(),
              leaveRequestService.getLeaveRequestsForHRApproval(),
            ]);

            // Combine and deduplicate requests (in case there are overlaps)
            const managerRequests = managerResponse.data;
            const hrRequests = hrResponse.data;

            // Use Map to deduplicate by request ID
            const requestsMap = new Map();
            [...managerRequests, ...hrRequests].forEach(request => {
              requestsMap.set(request.id, request);
            });

            allOthersRequests = Array.from(requestsMap.values());
          } else if (isManager) {
            // User is only Manager
            const response = await leaveRequestService.getLeaveRequestsForManagerApproval();
            allOthersRequests = response.data;
          } else if (isHR) {
            // User is only HR
            const response = await leaveRequestService.getLeaveRequestsForHRApproval();
            allOthersRequests = response.data;
          }

          if (isMounted) {
            setOthersRequests(allOthersRequests);
          }
        }
      } catch (error) {
        console.error("Failed to fetch leave requests:", error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchUserAndRequests();

    return () => {
      isMounted = false;
    };
  }, [userId, isHR, isManager]); // Proper dependencies

  // Get current requests based on active tab
  const getCurrentRequests = useCallback(() => {
    return activeTab === "my-requests" ? myRequests : othersRequests;
  }, [activeTab, myRequests, othersRequests]);

  const filteredRequests = getCurrentRequests().filter((request) => {
    // Search filter - using the correct property paths
    const employeeName = request.user?.name || "";
    const leaveTypeName = request.leaveType?.name || "";

    const matchesSearch =
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leaveTypeName.toLowerCase().includes(searchTerm.toLowerCase());

    // Status filter - using effective status based on user role
    const effectiveStatus = getEffectiveStatus(request);
    const matchesStatus = statusFilter
      ? effectiveStatus === statusFilter
      : true;

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
      if (isHR && isManager) {
        // User is both HR and Manager - approve as both
        const data: ManagerApproveRejectLeaveRequestRequest = {
          status: LeaveRequestStatus.APPROVED,
          comment: "Approved by HR manager",
        };
        await leaveRequestService.managerApproveRejectLeaveRequest(id, data);
        await leaveRequestService.hrApproveRejectLeaveRequest(id, data);
      } else if (isHR) {
        const data: HRApproveRejectLeaveRequestRequest = {
          status: LeaveRequestStatus.APPROVED,
          comment: "Approved by HR",
        };
        await leaveRequestService.hrApproveRejectLeaveRequest(id, data);
      } else if (isManager) {
        const data: ManagerApproveRejectLeaveRequestRequest = {
          status: LeaveRequestStatus.APPROVED,
          comment: "Approved by manager",
        };
        await leaveRequestService.managerApproveRejectLeaveRequest(id, data);
      }

      // Update the local state - update the correct status field
      setOthersRequests(
        othersRequests.map((req) => {
          if (req.id === id) {
            if (isHR && isManager) {
              return { ...req, hrStatus: "APPROVED", managerStatus: "APPROVED" };
            } else if (isHR) {
              return { ...req, hrStatus: "APPROVED" };
            } else if (isManager) {
              return { ...req, managerStatus: "APPROVED" };
            }
          }
          return req;
        })
      );
    } catch (error) {
      console.error("Failed to approve request:", error);
    }
  };

  const handleReject = async (id: number) => {
    try {
      if (isHR && isManager) {
        // User is both HR and Manager - reject as both
        const data: ManagerApproveRejectLeaveRequestRequest = {
          status: LeaveRequestStatus.REJECTED,
          comment: "Rejected by HR manager",
        };
        await leaveRequestService.managerApproveRejectLeaveRequest(id, data);
        await leaveRequestService.hrApproveRejectLeaveRequest(id, data);
      } else if (isHR) {
        const data: HRApproveRejectLeaveRequestRequest = {
          status: LeaveRequestStatus.REJECTED,
          comment: "Rejected by HR",
        };
        await leaveRequestService.hrApproveRejectLeaveRequest(id, data);
      } else if (isManager) {
        const data: ManagerApproveRejectLeaveRequestRequest = {
          status: LeaveRequestStatus.REJECTED,
          comment: "Rejected by manager",
        };
        await leaveRequestService.managerApproveRejectLeaveRequest(id, data);
      }

      // Update the local state - update the correct status field
      setOthersRequests(
        othersRequests.map((req) => {
          if (req.id === id) {
            if (isHR && isManager) {
              return { ...req, hrStatus: "REJECTED", managerStatus: "REJECTED" };
            } else if (isHR) {
              return { ...req, hrStatus: "REJECTED" };
            } else if (isManager) {
              return { ...req, managerStatus: "REJECTED" };
            }
          }
          return req;
        })
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
        <div className="card-header bg-light">
          <div className="d-flex justify-content-between align-items-center mb-3">
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

          {/* Navigation Tabs - Only show if user is HR or Manager */}
          {showTabs() && (
            <ul className="nav nav-tabs card-header-tabs">
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "my-requests" ? "active" : ""}`}
                  onClick={() => setActiveTab("my-requests")}
                >
                  My Requests ({myRequests.length})
                </button>
              </li>
              <li className="nav-item">
                <button
                  className={`nav-link ${activeTab === "others-requests" ? "active" : ""}`}
                  onClick={() => setActiveTab("others-requests")}
                >
                  Team Requests ({othersRequests.length})
                </button>
              </li>
            </ul>
          )}
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
                    {activeTab === "others-requests" && <th>Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((request) => {
                    const effectiveStatus = getEffectiveStatus(request);
                    return (
                      <tr key={request.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="avatar-sm bg-light rounded-circle me-2 d-flex align-items-center justify-content-center">
                              <FaUser className="text-muted" />
                            </div>
                            {request.user?.name || "Unknown"}
                          </div>
                        </td>
                        <td>{request.leaveType?.name || "Unknown"}</td>
                        <td>
                          <div className="d-flex align-items-center">
                            <FaCalendarAlt className="me-2 text-muted" />
                            {formatDate(request.startDate)} -{" "}
                            {formatDate(request.endDate)}
                          </div>
                        </td>
                        <td>{request.duration} day(s)</td>
                        <td>
                          <Badge
                            label={effectiveStatus}
                            colorClassName={getStatusBadge(effectiveStatus)}
                          />
                        </td>
                        <td>{formatDate(request.submittedOn)}</td>
                        {activeTab === "others-requests" && (
                          <td>
                            <div className="d-flex gap-2">
                              {effectiveStatus === "PENDING" &&
                                canApproveReject() && (
                                  <>
                                    <button
                                      className="btn btn-sm btn-success"
                                      onClick={() => handleApprove(request.id)}
                                      title="Approve"
                                    >
                                      <FaCheck />
                                    </button>
                                    <button
                                      className="btn btn-sm btn-danger"
                                      onClick={() => handleReject(request.id)}
                                      title="Reject"
                                    >
                                      <FaTimes />
                                    </button>
                                  </>
                                )}
                            </div>
                          </td>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="card-footer bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <small className="text-muted">
              Showing {filteredRequests.length} of {getCurrentRequests().length} requests
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
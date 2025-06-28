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
import leaveRequestService from "../../services/api-services/leave-request.service";
import generalService from "../../services/api-services/general.service";
import {
  LeaveRequestResponse,
  ApproveRejectLeaveRequestRequest,
} from "../../types/leave.types";
import { useAppSelector } from "../../store/store";
import { IsDeptManager, IsHr, isTeamManager } from "../../utils/helper";
import { toast } from "react-toastify";

const LeaveRequests = () => {
  const [myRequests, setMyRequests] = useState<LeaveRequestResponse[]>([]);
  const [othersRequests, setOthersRequests] = useState<LeaveRequestResponse[]>(
    []
  );
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
  const [activeTab, setActiveTab] = useState<"my-requests" | "others-requests">(
    "my-requests"
  );
  const [isTeamManagerState, setIsTeamManagerState] = useState<boolean>(false);

  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState<
    "APPROVED" | "REJECTED" | null
  >(null);
  const [selectedRequestId, setSelectedRequestId] = useState<number | null>(
    null
  );
  const [comment, setComment] = useState("");
  const [commentError, setCommentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const userId = useAppSelector((s) => s.auth.userData?.user.id);
  const permissions = useAppSelector((s) => s.auth.userData?.user.permissions);

  const isHR = IsHr();
  const isDeptManager = IsDeptManager();
  const isManager = isTeamManagerState || isDeptManager;

  const hasAdminPermissions = useCallback(() => {
    return permissions?.some((p) =>
      ["is_admin", "is_admin_department", "is_admin_team"].includes(p)
    );
  }, [permissions]);

  const showTabs = useCallback(() => {
    return (isHR || isManager) && hasAdminPermissions();
  }, [isHR, isManager, hasAdminPermissions]);

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
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchRequests = async () => {
      if (!userId) return;

      setLoading(true);

      try {
        const myRequestsResponse = await generalService.getMyLeaveRequests();
        if (isMounted) {
          setMyRequests(myRequestsResponse.data);
        }

        if (hasAdminPermissions()) {
          const othersRequestsResponse =
            await leaveRequestService.getLeaveRequests();
          if (isMounted) {
            const filteredOthersRequests = othersRequestsResponse.data.filter(
              (request) => request.user?.id !== userId
            );
            setOthersRequests(filteredOthersRequests);
          }
        } else {
          if (isMounted) {
            setOthersRequests([]);
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

    fetchRequests();

    return () => {
      isMounted = false;
    };
  }, [userId, isHR, isManager, hasAdminPermissions]);

  const getRequestsForCurrentTab = () => {
    if (activeTab === "my-requests") {
      return myRequests;
    } else {
      return othersRequests;
    }
  };

  const tabRequests = getRequestsForCurrentTab();

  const filteredRequests = tabRequests.filter((request) => {
    const employeeName = request.user?.name || "";
    const leaveTypeName = request.leaveType?.name || "";

    const matchesSearch =
      employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      leaveTypeName.toLowerCase().includes(searchTerm.toLowerCase());

    const effectiveStatus = request.managerStatus;
    const matchesStatus = statusFilter
      ? effectiveStatus === statusFilter
      : true;

    const matchesDate =
      dateFilter.start && dateFilter.end
        ? new Date(request.startDate) >= dateFilter.start &&
          new Date(request.endDate) <= dateFilter.end
        : true;

    return matchesSearch && matchesStatus && matchesDate;
  });

  const refreshRequests = async () => {
    try {
      const myRequestsResponse = await generalService.getMyLeaveRequests();
      setMyRequests(myRequestsResponse.data);

      if (hasAdminPermissions()) {
        const othersRequestsResponse =
          await leaveRequestService.getLeaveRequests();

        const filteredOthersRequests = othersRequestsResponse.data.filter(
          (request) => request.user?.id !== userId
        );
        setOthersRequests(filteredOthersRequests);
      }
    } catch (error) {
      console.error("Failed to refresh leave requests:", error);
    }
  };

  const openModal = (action: "APPROVED" | "REJECTED", requestId: number) => {
    setModalAction(action);
    setSelectedRequestId(requestId);
    setComment("");
    setCommentError("");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setModalAction(null);
    setSelectedRequestId(null);
    setComment("");
    setCommentError("");
    setIsSubmitting(false);
  };

  const validateComment = () => {
    if (!comment.trim()) {
      setCommentError("Comment is required");
      return false;
    }
    if (comment.trim().length < 5) {
      setCommentError("Comment must be at least 5 characters");
      return false;
    }
    setCommentError("");
    return true;
  };

  const handleSubmitAction = async () => {
    if (!validateComment() || !modalAction || !selectedRequestId) {
      return;
    }

    setIsSubmitting(true);

    try {
      const requestData: ApproveRejectLeaveRequestRequest = {
        status: modalAction,
        comment: comment.trim(),
      };

      const resp = await leaveRequestService.approveRejectLeaveRequest(
        selectedRequestId,
        requestData
      );

      if (resp.status === "success") {
        toast.success(resp.message);
        await refreshRequests();
        closeModal();
      } else {
        toast.error(resp.message);
      }
    } catch (error) {
      console.error(`Failed to ${modalAction.toLowerCase()} request:`, error);
      toast.error(`Failed to ${modalAction.toLowerCase()} request`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleApprove = (id: number) => {
    openModal("APPROVED", id);
  };

  const handleReject = (id: number) => {
    openModal("REJECTED", id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  const myRequestsCount = myRequests.length;
  const othersRequestsCount = othersRequests.length;

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
                          {...(dateFilter.start && {
                            minDate: dateFilter.start,
                          })}
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
                  className={`nav-link ${
                    activeTab === "my-requests" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("my-requests")}
                >
                  My Requests ({myRequestsCount})
                </button>
              </li>
              {hasAdminPermissions() && (
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "others-requests" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("others-requests")}
                  >
                    Team Requests ({othersRequestsCount})
                  </button>
                </li>
              )}
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
                        <td>{request.hrStatus}</td>
                        <td>{formatDate(request.submittedOn)}</td>
                        {activeTab === "others-requests" && (
                          <td>
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-success"
                                onClick={() => handleApprove(request.id)}
                                title="Approve"
                                disabled={
                                  !(
                                    request.hrStatus === "PENDING" &&
                                    request.managerStatus === "PENDING"
                                  )
                                }
                              >
                                <FaCheck />
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleReject(request.id)}
                                title="Reject"
                                disabled={
                                  !(
                                    request.hrStatus === "PENDING" &&
                                    request.managerStatus === "PENDING"
                                  )
                                }
                              >
                                <FaTimes />
                              </button>
                              {request.managerStatus === "APPROVED" && (
                                <span className="badge bg-success">
                                  Approved
                                </span>
                              )}
                              {request.managerStatus === "REJECTED" && (
                                <span className="badge bg-danger">
                                  Rejected
                                </span>
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
              Showing {filteredRequests.length} of {tabRequests.length} requests
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

      {/* Approve/Reject Comment Modal */}
      {showModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
          tabIndex={-1}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {modalAction === "APPROVED" ? (
                    <span className="text-success">
                      <FaCheck className="me-2" />
                      Approve Leave Request
                    </span>
                  ) : (
                    <span className="text-danger">
                      <FaTimes className="me-2" />
                      Reject Leave Request
                    </span>
                  )}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                  disabled={isSubmitting}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-3">
                  Please provide a comment for{" "}
                  {modalAction === "APPROVED" ? "approving" : "rejecting"} this
                  leave request:
                </p>
                <div className="mb-3">
                  <label htmlFor="comment" className="form-label">
                    Comment <span className="text-danger">*</span>
                  </label>
                  <textarea
                    id="comment"
                    className={`form-control ${
                      commentError ? "is-invalid" : ""
                    }`}
                    rows={4}
                    value={comment}
                    onChange={(e) => {
                      setComment(e.target.value);
                      if (commentError) {
                        setCommentError("");
                      }
                    }}
                    placeholder={`Enter your reason for ${
                      modalAction === "APPROVED" ? "approving" : "rejecting"
                    } this request...`}
                    disabled={isSubmitting}
                    maxLength={500}
                  />
                  {commentError && (
                    <div className="invalid-feedback">{commentError}</div>
                  )}
                  <div className="form-text">
                    {comment.length}/500 characters
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeModal}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${
                    modalAction === "APPROVED" ? "btn-success" : "btn-danger"
                  }`}
                  onClick={handleSubmitAction}
                  disabled={isSubmitting || !comment.trim()}
                >
                  {isSubmitting ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                      ></span>
                      Processing...
                    </>
                  ) : (
                    <>
                      {modalAction === "APPROVED" ? (
                        <FaCheck className="me-2" />
                      ) : (
                        <FaTimes className="me-2" />
                      )}
                      {modalAction === "APPROVED" ? "Approve" : "Reject"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LeaveRequests;

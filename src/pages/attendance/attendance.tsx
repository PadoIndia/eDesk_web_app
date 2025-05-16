import { useState, useEffect } from "react";
import {
  FaUser,
  FaUserShield,
  FaClipboardList,
  FaCheck,
  FaBan,
  FaPlus,
  FaBuilding,
} from "react-icons/fa";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
// import Badge from "../../components/badge";
import AttendanceTables from "./components/attendance-table";

interface Punch {
  id: number;
  userId: number;
  userName: string;
  userDepartment: string;
  date: string;
  time: string;
  type: "manual" | "auto";
  isApproved?: boolean;
  reason?: string;
  approvedBy?: string;
  approvedOn?: string;
  rejectionReason?: string;
}

interface CallDetails {
  id: number;
  callDuration: number;
  missedCalls: number;
  incoming: number;
  outgoing: number;
  date: string;
}

interface ClassDetails {
  id: number;
  glcScheduled: number;
  glcTaken: number;
  oplcScheduled: number;
  oplcTaken: number;
  gdcScheduled: number;
  gdcTaken: number;
  opdcScheduled: number;
  opdcTaken: number;
  date: string;
}

interface AttendanceUser {
  id: number;
  name: string;
  department: string;
  isAdmin: boolean;
  punchData: Punch[];
  attendance: {
    status: string;
    statusManual: string;
    comment: string;
  };
  callDetails?: CallDetails[];
  classDetails?: ClassDetails[];
}

const mockUsers: AttendanceUser[] = [
  // Existing users corrected
  {
    id: 1,
    name: "John Doe",
    department: "Sales",
    isAdmin: true,
    punchData: [
      // ... keep existing punch data
      {
        id: 1,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-08",
        time: "09:00",
        type: "auto",
        isApproved: true,
      },
      {
        id: 2,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-08",
        time: "12:30",
        type: "auto",
        isApproved: true,
      },
      {
        id: 3,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-08",
        time: "13:30",
        type: "auto",
        isApproved: true,
      },
      {
        id: 4,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-08",
        time: "18:00",
        type: "auto",
        isApproved: true,
      },
      {
        id: 5,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-09",
        time: "09:00",
        type: "auto",
        isApproved: true,
      },
      {
        id: 6,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-09",
        time: "12:30",
        type: "auto",
        isApproved: true,
      },
      {
        id: 7,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-09",
        time: "13:30",
        type: "auto",
        isApproved: true,
      },
      {
        id: 8,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-09",
        time: "18:00",
        type: "auto",
        isApproved: true,
      },
      {
        id: 9,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-10",
        time: "09:00",
        type: "auto",
        isApproved: true,
      },
      {
        id: 10,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-10",
        time: "12:30",
        type: "auto",
        isApproved: true,
      },
      {
        id: 11,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-10",
        time: "13:30",
        type: "auto",
        isApproved: true,
      },
      {
        id: 12,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-10",
        time: "18:00",
        type: "auto",
        isApproved: true,
      },
      {
        id: 13,
        userId: 1,
        userName: "John Doe",
        userDepartment: "Sales",
        date: "2025-05-11",
        time: "18:00",
        type: "auto",
        isApproved: true,
      },
    ],
    attendance: { status: "P", statusManual: "", comment: "" },
    callDetails: [
      {
        id: 1,
        callDuration: 240,
        missedCalls: 2,
        incoming: 15,
        outgoing: 20,
        date: "2025-05-08",
      },
      {
        id: 2,
        callDuration: 240,
        missedCalls: 2,
        incoming: 15,
        outgoing: 20,
        date: "2025-05-09",
      },
      {
        id: 3,
        callDuration: 240,
        missedCalls: 2,
        incoming: 15,
        outgoing: 20,
        date: "2025-05-10",
      },
    ],
  },
  {
    id: 3,
    name: "Robert Taylor",
    department: "Faculty",
    isAdmin: true,
    punchData: [
      {
        id: 8,
        userId: 3,
        userName: "Robert Taylor",
        userDepartment: "Faculty",
        date: "2025-05-08",
        time: "08:45",
        type: "auto",
        isApproved: true,
      },
      {
        id: 9,
        userId: 3,
        userName: "Robert Taylor",
        userDepartment: "Faculty",
        date: "2025-05-08",
        time: "18:15",
        type: "auto",
        isApproved: true,
      },
    ],
    attendance: { status: "P", statusManual: "", comment: "" },
    classDetails: [
      {
        id: 1,
        date: "2025-05-08",
        glcScheduled: 2,
        glcTaken: 2,
        oplcScheduled: 1,
        oplcTaken: 1,
        gdcScheduled: 0,
        gdcTaken: 0,
        opdcScheduled: 1,
        opdcTaken: 1,
      },
    ],
  },
  {
    id: 6,
    name: "Sarah Brown",
    department: "Mentor",
    isAdmin: false,
    punchData: [],
    attendance: { status: "A", statusManual: "", comment: "" },
    callDetails: [
      {
        id: 4,
        date: "2025-05-08",
        callDuration: 180,
        missedCalls: 1,
        incoming: 12,
        outgoing: 15,
      },
    ],
  },

  // New users with varied scenarios
  {
    id: 9,
    name: "Laura Wilson",
    department: "Faculty",
    isAdmin: false,
    punchData: [
      {
        id: 22,
        userId: 9,
        userName: "Laura Wilson",
        userDepartment: "Faculty",
        date: "2025-05-08",
        time: "08:50",
        type: "auto",
        isApproved: true,
      },
      {
        id: 23,
        userId: 9,
        userName: "Laura Wilson",
        userDepartment: "Faculty",
        date: "2025-05-08",
        time: "17:45",
        type: "auto",
        isApproved: true,
      },
    ],
    classDetails: [
      {
        id: 2,
        date: "2025-05-08",
        glcScheduled: 3,
        glcTaken: 3,
        oplcScheduled: 2,
        oplcTaken: 1,
        gdcScheduled: 1,
        gdcTaken: 1,
        opdcScheduled: 2,
        opdcTaken: 2,
      },
    ],
    attendance: { status: "P", statusManual: "", comment: "" },
  },
  {
    id: 10,
    name: "Mark Thompson",
    department: "IT",
    isAdmin: true,
    punchData: [
      {
        id: 24,
        userId: 10,
        userName: "Mark Thompson",
        userDepartment: "IT",
        date: "2025-05-08",
        time: "09:05",
        type: "auto",
        isApproved: true,
      },
      {
        id: 25,
        userId: 10,
        userName: "Mark Thompson",
        userDepartment: "IT",
        date: "2025-05-08",
        time: "12:30",
        type: "manual",
        isApproved: undefined,
        reason: "System error",
      },
      {
        id: 26,
        userId: 10,
        userName: "Mark Thompson",
        userDepartment: "IT",
        date: "2025-05-08",
        time: "13:45",
        type: "auto",
        isApproved: true,
      },
      {
        id: 27,
        userId: 10,
        userName: "Mark Thompson",
        userDepartment: "IT",
        date: "2025-05-08",
        time: "18:15",
        type: "auto",
        isApproved: true,
      },
    ],
    attendance: { status: "P", statusManual: "", comment: "" },
    callDetails: [
      {
        id: 5,
        date: "2025-05-08",
        callDuration: 300,
        missedCalls: 0,
        incoming: 20,
        outgoing: 18,
      },
    ],
  },
  {
    id: 11,
    name: "Sophia Lee",
    department: "Mentor",
    isAdmin: false,
    punchData: [
      {
        id: 28,
        userId: 11,
        userName: "Sophia Lee",
        userDepartment: "Mentor",
        date: "2025-05-08",
        time: "09:15",
        type: "auto",
        isApproved: true,
      },
      {
        id: 29,
        userId: 11,
        userName: "Sophia Lee",
        userDepartment: "Mentor",
        date: "2025-05-08",
        time: "17:30",
        type: "auto",
        isApproved: true,
      },
    ],
    classDetails: [
      {
        id: 3,
        date: "2025-05-08",
        glcScheduled: 2,
        glcTaken: 2,
        oplcScheduled: 1,
        oplcTaken: 1,
        gdcScheduled: 0,
        gdcTaken: 0,
        opdcScheduled: 0,
        opdcTaken: 0,
      },
    ],
    callDetails: [
      {
        id: 6,
        date: "2025-05-08",
        callDuration: 420,
        missedCalls: 3,
        incoming: 25,
        outgoing: 30,
      },
    ],
    attendance: { status: "P", statusManual: "", comment: "" },
  },
  {
    id: 12,
    name: "Daniel Kim",
    department: "BD",
    isAdmin: false,
    punchData: [
      {
        id: 30,
        userId: 12,
        userName: "Daniel Kim",
        userDepartment: "BD",
        date: "2025-05-08",
        time: "10:00",
        type: "manual",
        isApproved: true,
        reason: "Client meeting",
      },
      {
        id: 31,
        userId: 12,
        userName: "Daniel Kim",
        userDepartment: "BD",
        date: "2025-05-08",
        time: "15:30",
        type: "auto",
        isApproved: true,
      },
    ],
    attendance: {
      status: "P",
      statusManual: "L",
      comment: "Half-day leave approved",
    },
    callDetails: [
      {
        id: 7,
        date: "2025-05-08",
        callDuration: 180,
        missedCalls: 5,
        incoming: 10,
        outgoing: 15,
      },
    ],
  },
];

// Mock miss punch requests
const mockMissPunchRequests: Punch[] = [
  {
    id: 22,
    userId: 7,
    userName: "Michael Chen",
    userDepartment: "Sales",
    date: "2025-05-07",
    time: "17:00",
    type: "manual",
    isApproved: undefined,
    reason: "Forgot to punch out",
  },
  {
    id: 23,
    userId: 8,
    userName: "Emily Davis",
    userDepartment: "Marketing",
    date: "2025-05-06",
    time: "18:15",
    type: "manual",
    isApproved: undefined,
    reason: "System was down",
  },
  {
    id: 24,
    userId: 5,
    userName: "David Wilson",
    userDepartment: "IT",
    date: "2025-05-07",
    time: "17:45",
    type: "manual",
    isApproved: undefined,
    reason: "Working remotely, forgot to log",
  },
];

const AttendanceDashboard = () => {
  const [currentUser, setCurrentUser] = useState<AttendanceUser>(mockUsers[0]);
  const [users, setUsers] = useState(mockUsers);
  const [missPunchRequests, setMissPunchRequests] = useState(
    mockMissPunchRequests
  );
  // const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  // const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [showMissPunchForm, setShowMissPunchForm] = useState(false);
  const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<Punch | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    reason: "",
  });
  const selectedMonth = new Date().getMonth();
  const selectedYear = new Date().getFullYear();
  // const [searchTerm, setSearchTerm] = useState("");
  // const [filterDepartment, setFilterDepartment] = useState("All");
  const searchTerm = "";
  const filterDepartment = "All";
  const [currentView, setCurrentView] = useState<"department" | "requests">(
    "department"
  );

  // const months = [
  //   "January", "February", "March", "April", "May", "June",
  //   "July", "August", "September", "October", "November", "December"
  // ];

  // const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - 2 + i);
  // const departments = ["All", ...Array.from(new Set(users.map(user => user.department)))];

  useEffect(() => {
    const newDate = new Date(selectedYear, selectedMonth, 1);
    setSelectedDate(newDate.toISOString().split("T")[0].substring(0, 8) + "01");
  }, [selectedMonth, selectedYear]);

  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDepartment =
      filterDepartment === "All" || user.department === filterDepartment;

    if (!currentUser.isAdmin) return user.id === currentUser.id;
    return (
      matchesSearch &&
      matchesDepartment &&
      user.department === currentUser.department
    );
  });

  const filteredRequests = missPunchRequests.filter(
    (request) =>
      request.userDepartment === currentUser.department &&
      request.isApproved === undefined
  );

  const handleMissPunchRequest = () => {
    setFormData({
      name: currentUser.name,
      date: selectedDate,
      time: "",
      reason: "",
    });
    setShowMissPunchForm(true);
  };

  const handleManualStatusChange = (userId: number, newStatus: string) => {
    const updatedUsers = users.map((user) => {
      if (user.id === userId) {
        return {
          ...user,
          attendance: {
            ...user.attendance,
            statusManual: newStatus,
          },
        };
      }
      return user;
    });
    setUsers(updatedUsers);
    toast.success("Manual status updated successfully");
  };

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.time || !formData.reason) {
      toast.error("Please fill all required fields");
      return;
    }

    const newPunch: Punch = {
      id:
        Math.max(
          ...missPunchRequests.map((p) => p.id),
          ...users.flatMap((u) => u.punchData.map((p) => p.id))
        ) + 1,
      userId: currentUser.id,
      userName: currentUser.name,
      userDepartment: currentUser.department,
      date: formData.date,
      time: formData.time,
      type: "manual",
      reason: formData.reason,
    };

    setMissPunchRequests([...missPunchRequests, newPunch]);
    setUsers(
      users.map((user) =>
        user.id === currentUser.id
          ? { ...user, punchData: [...user.punchData, newPunch] }
          : user
      )
    );
    toast.success("Miss punch request submitted successfully!");
    setShowMissPunchForm(false);
  };

  const handleApproveReject = (
    request: Punch,
    action: "approve" | "reject"
  ) => {
    setCurrentRequest(request);
    setActionType(action);
    setRejectionReason("");
    setShowApproveRejectModal(true);
  };

  const confirmApproveReject = () => {
    if (!currentRequest || !actionType) return;

    const updatedRequests = missPunchRequests.map((req) =>
      req.id === currentRequest.id
        ? {
            ...req,
            isApproved: actionType === "approve",
            ...(actionType === "approve"
              ? {
                  approvedBy: currentUser.name,
                  approvedOn: new Date().toISOString().split("T")[0],
                }
              : {
                  rejectionReason,
                }),
          }
        : req
    );

    const updatedUsers = users.map((user) =>
      user.id === currentRequest.userId
        ? {
            ...user,
            punchData: user.punchData.map((punch) =>
              punch.id === currentRequest.id
                ? {
                    ...punch,
                    isApproved: actionType === "approve",
                    ...(actionType === "approve"
                      ? {
                          approvedBy: currentUser.name,
                          approvedOn: new Date().toISOString().split("T")[0],
                        }
                      : {
                          rejectionReason,
                        }),
                  }
                : punch
            ),
          }
        : user
    );

    setMissPunchRequests(updatedRequests);
    setUsers(updatedUsers);
    toast.success(
      `Request ${
        actionType === "approve" ? "approved" : "rejected"
      } successfully!`
    );
    setShowApproveRejectModal(false);
  };

  const renderHeader = () => (
    <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
      <h3 className="mb-0 d-flex align-items-center gap-3">
        {currentUser.isAdmin ? (
          <>
            <FaBuilding className="me-2" />
            {currentView === "department"
              ? "Department Attendance"
              : "Miss Punch Requests"}
          </>
        ) : (
          <>
            <FaUser className="me-2" />
            My Attendance
          </>
        )}
      </h3>

      {currentUser.isAdmin && (
        <div className="d-flex gap-2">
          <button
            className={`btn ${
              currentView === "department" ? "btn-light" : "btn-outline-light"
            }`}
            onClick={() => setCurrentView("department")}
          >
            <FaBuilding className="me-1" /> Department
          </button>
          <button
            className={`btn ${
              currentView === "requests" ? "btn-light" : "btn-outline-light"
            }`}
            onClick={() => setCurrentView("requests")}
            style={{ position: "relative" }}
          >
            <FaClipboardList className="me-1" /> Requests
            {filteredRequests.length > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {filteredRequests.length}
              </span>
            )}
          </button>
        </div>
      )}
    </div>
  );

  const renderControls = () => (
    <div className="row g-3 mb-4 align-items-end">
      {!currentUser.isAdmin && currentUser.punchData.length % 2 !== 0 && (
        <div className="col-md-4 col-lg-3 ms-auto">
          <button
            className="btn btn-primary w-100"
            onClick={handleMissPunchRequest}
          >
            <FaPlus className="me-2" /> Request Miss Punch
          </button>
        </div>
      )}
    </div>
  );

  const renderRequestsTable = () => (
    <div className="table-responsive">
      <table className="table table-bordered table-hover">
        <thead className="table-light">
          <tr>
            <th>Employee</th>
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredRequests.map((request) => (
            <tr key={request.id}>
              <td>{request.userName}</td>
              <td>{request.date}</td>
              <td>{request.time}</td>
              <td>{request.reason}</td>
              <td className="text-center">
                <div className="btn-group">
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleApproveReject(request, "approve")}
                  >
                    <FaCheck className="me-1" /> Approve
                  </button>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleApproveReject(request, "reject")}
                  >
                    <FaBan className="me-1" /> Reject
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="alert alert-primary d-flex align-items-center mb-4">
        <FaUserShield className="me-2" size={24} />
        <div>
          <strong>Welcome, {currentUser.name}!</strong>
          <span className="ms-2">
            {currentUser.isAdmin
              ? `Managing ${currentUser.department} department`
              : "Viewing your attendance records"}
          </span>
        </div>
      </div>

      <div className="card shadow mb-4">
        {renderHeader()}
        <div className="card-body">
          {currentView === "department" && (
            <>
              {renderControls()}
              <AttendanceTables
                users={filteredUsers}
                currentUser={currentUser}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth}
                selectedDate={selectedDate}
                onManualStatusChange={handleManualStatusChange}
                onMissPunchRequest={handleMissPunchRequest}
                isAdmin={currentUser.isAdmin}
                currentView={currentView}
              />
            </>
          )}
          {currentView === "requests" && renderRequestsTable()}
        </div>
      </div>

      {showMissPunchForm && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Miss Punch Request</h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowMissPunchForm(false)}
                />
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={formData.date}
                      onChange={(e) =>
                        setFormData({ ...formData, date: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Time</label>
                    <input
                      type="time"
                      className="form-control"
                      value={formData.time}
                      onChange={(e) =>
                        setFormData({ ...formData, time: e.target.value })
                      }
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Reason</label>
                    <textarea
                      className="form-control"
                      value={formData.reason}
                      onChange={(e) =>
                        setFormData({ ...formData, reason: e.target.value })
                      }
                      required
                      rows={3}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setShowMissPunchForm(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Submit Request
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {showApproveRejectModal && currentRequest && (
        <div
          className="modal show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">
                  {actionType === "approve"
                    ? "Approve Request"
                    : "Reject Request"}
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  onClick={() => setShowApproveRejectModal(false)}
                />
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <p>
                    <strong>Employee:</strong> {currentRequest.userName}
                  </p>
                  <p>
                    <strong>Date:</strong> {currentRequest.date}
                  </p>
                  <p>
                    <strong>Time:</strong> {currentRequest.time}
                  </p>
                  <p>
                    <strong>Reason:</strong> {currentRequest.reason}
                  </p>
                </div>
                {actionType === "reject" && (
                  <div className="mb-3">
                    <label className="form-label">Rejection Reason</label>
                    <textarea
                      className="form-control"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      required
                      rows={3}
                    />
                  </div>
                )}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowApproveRejectModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className={`btn ${
                    actionType === "approve" ? "btn-success" : "btn-danger"
                  }`}
                  onClick={confirmApproveReject}
                  disabled={actionType === "reject" && !rejectionReason}
                >
                  {actionType === "approve"
                    ? "Confirm Approval"
                    : "Confirm Rejection"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentUser.isAdmin && (
        <div className="card mt-4">
          <div className="card-header bg-secondary text-white">
            <h5 className="mb-0">Admin Controls</h5>
          </div>
          <div className="card-body">
            <div className="mb-3">
              <label className="form-label">Switch User View</label>
              <select
                className="form-select"
                value={currentUser.id}
                onChange={(e) => {
                  const user = users.find(
                    (u) => u.id === parseInt(e.target.value)
                  );
                  if (user) setCurrentUser(user);
                }}
              >
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.department})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AttendanceDashboard;

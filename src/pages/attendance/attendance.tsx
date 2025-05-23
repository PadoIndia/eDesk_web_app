import { useState, useEffect, useCallback } from "react";
import { useAppSelector } from "../../store/store";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import attendanceDashboardService from "../../services/api-services/attendance-dashboard.service";

import MissPunchForm from "./components/miss-punch-form";
import AttendanceTables from "./components/attendance-table";
import DashboardControls from "./components/control";
import LoadingErrorState from "./components/loading-error-state";
import DashboardHeader from "./components/header";
import ApproveRejectModal from "./components/approve-reject-modal";
import RequestsTable from "./components/requests-table";

// Type definitions (simplified, using the existing ones from your components)
import {
  AttendanceUser,
  Punch,
  DashboardData,
} from "../../types/attendance.types";
import { Department } from "../../types/department-team.types";

const AttendanceDashboard = () => {
  // Get userId from Redux store
  const userId = useAppSelector((state) => state.auth.userData?.user.id);

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1); // 1-12
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Simplified state - no more complex data processing needed
  const [dashboardData, setDashboardData] = useState<DashboardData>();
  const [departmentUsers, setDepartmentUsers] = useState<AttendanceUser[]>([]);
  const [missPunchRequests, setMissPunchRequests] = useState<Punch[]>([]);

  // UI state
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

  // Form data - ADDED targetUserId to track who the request is for
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    reason: "",
    departmentId: 0,
    targetUserId: 0, // NEW: Track which user the request is for
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [filterDepartment, setFilterDepartment] = useState("All");
  const [currentView, setCurrentView] = useState<"department" | "requests">(
    "department"
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Derived state from dashboard data
  const currentUser: AttendanceUser | null = dashboardData?.user
    ? {
        id: dashboardData.user.id,
        name: dashboardData.user.name,
        department:
          dashboardData.user.departments.map((d) => d.name).join(", ") ||
          "Not Assigned",
        departments: dashboardData.user.departments,
        isAdmin: dashboardData.user.isAdmin,
        punchData: dashboardData.punchData || [],
        attendance: Array.isArray(dashboardData.attendance)
          ? dashboardData.attendance
          : [],
        callDetails: dashboardData.callDetails || [],
        classDetails: dashboardData.classDetails || [],
      }
    : null;

  // Update the isAdmin and userDepartments derivation
  const isAdmin = currentUser?.isAdmin || false;
  const userDepartments = currentUser?.departments || [];

const fetchInitialData = useCallback(async () => {
  try {
    setLoading(true);
    setError(null);

    if (!userId) throw new Error("User ID is required");

    const dashboardResponse =
      await attendanceDashboardService.getDashboardData(
        userId,
        selectedMonth,
        selectedYear
      );

    if (dashboardResponse.status !== "success") {
      throw new Error(dashboardResponse.message || "Failed to fetch dashboard data");
    }

    setDashboardData(dashboardResponse.data);

    if (dashboardResponse.data.user.isAdmin) {
      const [departmentUsersResponse, pendingRequestsResponse] = await Promise.all([
        attendanceDashboardService.getDepartmentUsers(userId, selectedMonth, selectedYear),
        attendanceDashboardService.getPendingRequests(userId),
      ]);

      if (departmentUsersResponse.status === "success") {
        setDepartmentUsers(departmentUsersResponse.data.users);
      }

      if (pendingRequestsResponse.status === "success") {
        setMissPunchRequests(pendingRequestsResponse.data);
      }
    } else {
      setDepartmentUsers([
        {
          id: dashboardResponse.data.user.id,
          name: dashboardResponse.data.user.name,
          department: dashboardResponse.data.user.departments.map((d: Department) => d.name).join(", "),
          departments: dashboardResponse.data.user.departments,
          isAdmin: false,
          punchData: dashboardResponse.data.punchData,
          attendance: dashboardResponse.data.attendance,
          callDetails: dashboardResponse.data.callDetails,
          classDetails: dashboardResponse.data.classDetails,
        },
      ]);

      const userPendingRequests = dashboardResponse.data.punchData.filter(
        (punch: Punch) => punch.type === "MANUAL" && punch.isApproved === undefined
      );
      setMissPunchRequests(userPendingRequests);
    }

    if (dashboardResponse.data.user.departments.length > 0) {
      setFormData((prev) => ({
        ...prev,
        departmentId: dashboardResponse.data.user.departments[0].id,
      }));
    }
  } catch (err) {
    console.error("Error fetching data:", err);
    setError(err instanceof Error ? err.message : "Failed to load attendance data");
    toast.error("Error loading data: " + (err instanceof Error ? err.message : "Unknown error"));
  } finally {
    setLoading(false);
  }
}, [userId, selectedMonth, selectedYear]);




  useEffect(() => {

    if (userId) {
      fetchInitialData();
    }
  }, [userId, selectedMonth, selectedYear, fetchInitialData]);

  // Filter users based on search term and department
  const filteredUsers = departmentUsers.filter((user) => {
    const matchesSearch = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesDepartment =
      filterDepartment === "All" ||
      (user.departments &&
        user.departments.some((dept) => dept.name === filterDepartment));

    // If not admin, only show current user
    if (!isAdmin) return user.id === userId;

    return matchesSearch && matchesDepartment;
  });

  // Filter requests based on user role
  const filteredRequests = missPunchRequests.filter((request) => {
    if (!currentUser) return false;

    // For admins, show requests from their departments
    if (isAdmin) {
      const adminDepartmentIds =
        currentUser.departments
          ?.filter((dept) => dept.isAdmin)
          .map((dept) => dept.id) || [];

      return (
        request.departmentId &&
        adminDepartmentIds.includes(request.departmentId)
      );
    }

    // For non-admins, only show their own requests
    return request.userId === userId && request.isApproved === undefined;
  });

  // UPDATED: Handler for miss punch request - now accepts targetUserId
  const handleMissPunchRequest = (date: string, targetUserId?: number) => {
    setSelectedDate(date);

    // Find the target user (for admin requests) or use current user
    const targetUser = targetUserId
      ? departmentUsers.find((user) => user.id === targetUserId)
      : currentUser;

    if (!targetUser) {
      toast.error("Target user not found");
      return;
    }

    setFormData({
      name: targetUser.name, // Set the target user's name
      date,
      time: "",
      reason: "",
      departmentId:
        targetUser.departments[0]?.id || userDepartments[0]?.id || 0,
      targetUserId: targetUserId || currentUser?.id || 0, // NEW: Set target user ID
    });
    setShowMissPunchForm(true);
  };

  // Handler for department change in miss punch form
  const handleDepartmentChange = (departmentId: number) => {
    setFormData((prev) => ({ ...prev, departmentId }));
  };

  // Handler for manual status change - NOW using backend API
  const handleManualStatusChange = async (
    userId: number,
    date: string,
    newStatus: string,
    comment: string
  ): Promise<void> => {
    try {
      const [year, month, day] = date.split("-").map(Number);

      const statusData = {
        userId,
        date: day,
        month,
        year,
        status: newStatus as
          | "PRESENT"
          | "ABSENT"
          | "HALF_DAY"
          | "WEEK_OFF"
          | "HOLIDAY"
          | "SICK_LEAVE"
          | "CASUAL_LEAVE"
          | "PAID_LEAVE"
          | "UNPAID_LEAVE"
          | "COMPENSATORY_LEAVE",
        comment,
        commentBy: currentUser?.id,
      };

      // Update local state first
      setDepartmentUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId
            ? {
                ...user,
                attendance: user.attendance
                  .map((entry) =>
                    entry.date === day &&
                    entry.month === month &&
                    entry.year === year
                      ? { ...entry, statusManual: newStatus, comment }
                      : entry
                  )
                  .concat(
                    // Add new entry if not exists
                    user.attendance.some(
                      (entry) =>
                        entry.date === day &&
                        entry.month === month &&
                        entry.year === year
                    )
                      ? []
                      : [
                          {
                            date: day,
                            month,
                            year,
                            status: "MANUAL",
                            statusManual: newStatus,
                            comment,
                          },
                        ]
                  ),
              }
            : user
        )
      );

      const response = await attendanceDashboardService.updateManualStatus(
        statusData
      );

      if (response.status !== "success") {
        throw new Error(response.message || "Failed to update status");
      }

      toast.success("Manual status updated successfully");
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to update status: " + errorMessage);
    }
  };

  // UPDATED: Form submit handler - now uses targetUserId
  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (
      !currentUser ||
      !formData.time ||
      !formData.reason ||
      !formData.departmentId ||
      !formData.targetUserId
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const [hours, minutes] = formData.time.split(":").map(Number);
      const [year, month, day] = formData.date.split("-").map(Number);

      if (!year || !month || !day) {
        toast.error("Invalid date format");
        return;
      }

      const requestData = {
        userId: formData.targetUserId, // FIXED: Use target user ID instead of current user ID
        date: day,
        month,
        year,
        hh: hours,
        mm: minutes,
        missPunchReason: formData.reason,
        departmentId: formData.departmentId,
      };

      const response = await attendanceDashboardService.createMissPunchRequest(
        requestData
      );

      if (response.status !== "success") {
        throw new Error(
          response.message || "Failed to create miss punch request"
        );
      }

      // Update local state
      setMissPunchRequests((prevRequests) => [...prevRequests, response.data]);

      // Update the target user's punch data in the department users list
      setDepartmentUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === formData.targetUserId
            ? {
                ...user,
                punchData: [...user.punchData, response.data],
              }
            : user
        )
      );

      const targetUserName =
        departmentUsers.find((u) => u.id === formData.targetUserId)?.name ||
        "user";
      toast.success(
        `Miss punch request submitted successfully for ${targetUserName}!`
      );
      setShowMissPunchForm(false);

      // Reset form
      setFormData({
        name: "",
        date: "",
        time: "",
        reason: "",
        departmentId: userDepartments[0]?.id || 0,
        targetUserId: 0,
      });
      await fetchInitialData(); 
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to submit request: " + errorMessage);
    }
  };

  // Handler for approve/reject actions
  const handleApproveReject = (
    request: Punch,
    action: "approve" | "reject"
  ): void => {
    setCurrentRequest(request);
    setActionType(action);
    setRejectionReason("");
    setShowApproveRejectModal(true);
  };

  // Confirm approve/reject action - NOW using backend API
  const confirmApproveReject = async () => {
    if (!currentRequest || !actionType || !currentUser) return;

    try {
      const approvalData = {
        isApproved: actionType === "approve",
        comment: actionType === "reject" ? rejectionReason : undefined,
        approvedBy: currentUser.id,
      };

      const response = await attendanceDashboardService.approveMissPunchRequest(
        currentRequest.id,
        approvalData
      );

      if (response.status !== "success") {
        throw new Error(response.message || "Failed to process request");
      }

      // Update local state
      setMissPunchRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === currentRequest.id ? response.data : req
        )
      );

      setDepartmentUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === currentRequest.userId
            ? {
                ...user,
                punchData: user.punchData.map((punch) =>
                  punch.id === currentRequest.id ? response.data : punch
                ),
              }
            : user
        )
      );

      toast.success(
        `Request ${
          actionType === "approve" ? "approved" : "rejected"
        } successfully!`
      );
      setShowApproveRejectModal(false);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to ${actionType} request: ` + errorMessage);
    }
  };

  if (loading || error || !currentUser) {
    return (
      <LoadingErrorState
        loading={loading}
        error={error}
        currentUser={currentUser}
      />
    );
  }

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <DashboardHeader currentUser={currentUser} />

      <div className="card shadow mb-4">
        <DashboardHeader
          currentUser={currentUser}
          currentView={currentView}
          setCurrentView={setCurrentView}
          filteredRequests={filteredRequests}
          isCardHeader={true}
          selectedMonth={selectedMonth}
          selectedYear={selectedYear}
          setSelectedMonth={setSelectedMonth}
          setSelectedYear={setSelectedYear}
        />

        <div className="card-body">
          {currentView === "department" && (
            <>
              {isAdmin && (
                <DashboardControls
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filterDepartment={filterDepartment}
                  setFilterDepartment={setFilterDepartment}
                  users={departmentUsers}
                  currentUser={currentUser}
                  handleMissPunchRequest={handleMissPunchRequest}
                  // selectedDate={selectedDate}
                />
              )}

              <AttendanceTables
                users={filteredUsers}
                currentUser={currentUser}
                selectedYear={selectedYear}
                selectedMonth={selectedMonth - 1}
                selectedDate={selectedDate}
                onManualStatusChange={handleManualStatusChange}
                onMissPunchRequest={handleMissPunchRequest}
                isAdmin={isAdmin}
                currentView={currentView}
              />
            </>
          )}

          {currentView === "requests" && (
            <RequestsTable
              filteredRequests={filteredRequests}
              handleApproveReject={handleApproveReject}
              isAdmin={isAdmin}
            />
          )}
        </div>
      </div>

      {/* Miss Punch Request Modal */}
      {showMissPunchForm && (
        <MissPunchForm
          formData={formData}
          setFormData={setFormData}
          handleFormSubmit={handleFormSubmit}
          setShowMissPunchForm={setShowMissPunchForm}
          userDepartments={userDepartments}
          handleDepartmentChange={handleDepartmentChange}
        />
      )}

      {/* Approve/Reject Modal */}
      {showApproveRejectModal && currentRequest && (
        <ApproveRejectModal
          currentRequest={currentRequest}
          actionType={actionType}
          rejectionReason={rejectionReason}
          setRejectionReason={setRejectionReason}
          confirmApproveReject={confirmApproveReject}
          setShowApproveRejectModal={setShowApproveRejectModal}
        />
      )}
    </div>
  );
};

export default AttendanceDashboard;

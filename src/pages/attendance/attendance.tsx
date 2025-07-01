import { lazy, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { ToastContainer, toast } from "react-toastify";
import attendanceDashboardService from "../../services/api-services/attendance-dashboard.service";

import MissPunchForm from "./components/miss-punch-form";
import DashboardHeader from "./components/header";
import ApproveRejectModal from "./components/approve-reject-modal";

import { Punch } from "../../types/attendance.types";
import { fetchUserPermissions } from "../../features/auth.slice";
import UserDetailedAttendance from "./components/detailed-attendance";
const RequestsTable = lazy(() => import("./components/requests-table"));
const UsersAttendanceTable = lazy(
  () => import("./components/users-attendance-table-")
);

const AttendanceDashboard = () => {
  const userId = useAppSelector((state) => state.auth.userData?.user.id);
  const dispatch = useAppDispatch();
  const [missPunchRequests, setMissPunchRequests] = useState<Punch[]>([]);

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

    targetUserId: 0,
  });

  const [currentView, setCurrentView] = useState<
    "attendance" | "users-attendance" | "punch-requests"
  >("attendance");
  const currentUser = useAppSelector((s) => s.auth.userData?.user);
  const permissions = currentUser?.permissions || [];
  const isAdmin =
    permissions.some((p) =>
      ["is_admin", "is_team_admin", "is_department_admin"].includes(p)
    ) || false;

  const filteredRequests = missPunchRequests.filter((request) => {
    if (!currentUser) return false;

    if (isAdmin) {
      return true;
    }

    return request.userId === userId && request.isApproved === undefined;
  });

  const handleMissPunchRequest = (
    date: string,
    user: { id: number; name: string }
  ) => {
    if (!user) {
      toast.error("Target user not found");
      return;
    }

    setFormData({
      name: user.name,
      date,
      time: "",
      reason: "",

      targetUserId: user.id,
    });
    setShowMissPunchForm(true);
  };

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

  const autoApproveMissPunchRequest = async (
    requestId: number
  ): Promise<Punch | null> => {
    try {
      const approvalData = {
        isApproved: true,
        comment: "Auto-approved by admin",
        approvedBy: currentUser?.id,
      };

      const response = await attendanceDashboardService.approveMissPunchRequest(
        requestId,
        approvalData
      );

      if (response.status !== "success") {
        throw new Error(response.message || "Failed to auto-approve request");
      }

      return response.data;
    } catch (err) {
      console.error("Error auto-approving request:", err);
      throw err;
    }
  };

  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (
      !currentUser ||
      !formData.time ||
      !formData.reason ||
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
        userId: formData.targetUserId,
        date: day,
        month,
        year,
        hh: hours,
        mm: minutes,
        missPunchReason: formData.reason,
      };

      const response = await attendanceDashboardService.createMissPunchRequest(
        requestData
      );

      if (response.status !== "success") {
        throw new Error(
          response.message || "Failed to create miss punch request"
        );
      }

      let finalRequestData = response.data;

      const isAdminRequestForOtherUser =
        isAdmin && formData.targetUserId !== currentUser.id;

      if (isAdminRequestForOtherUser) {
        try {
          const approvedRequest = await autoApproveMissPunchRequest(
            response.data.id
          );
          if (approvedRequest) {
            finalRequestData = approvedRequest;
            toast.success(`Miss punch request created and auto-approved!`);
          }
        } catch (approvalErr) {
          console.error("Auto-approval failed:", approvalErr);
          toast.success(
            `Miss punch request submitted! (Auto-approval failed, will need manual approval)`
          );
        }
      } else {
        toast.success(`Miss punch request submitted successfully!`);
      }

      setMissPunchRequests((prevRequests) => {
        const filteredRequests = prevRequests.filter(
          (req) => req.id !== finalRequestData.id
        );
        return [...filteredRequests, finalRequestData];
      });

      setShowMissPunchForm(false);

      setFormData({
        name: "",
        date: "",
        time: "",
        reason: "",

        targetUserId: 0,
      });
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error("Failed to submit request: " + errorMessage);
    }
  };

  const handleApproveReject = (
    request: Punch,
    action: "approve" | "reject"
  ): void => {
    setCurrentRequest(request);
    setActionType(action);
    setRejectionReason("");
    setShowApproveRejectModal(true);
  };

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

      setMissPunchRequests((prevRequests) =>
        prevRequests.map((req) =>
          req.id === currentRequest.id ? response.data : req
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
  useEffect(() => {
    if (currentUser && currentUser.id) {
      dispatch(fetchUserPermissions(currentUser.id));

      attendanceDashboardService
        .getPendingRequests(currentUser.id)
        .then((res) => {
          if (res.status === "success") {
            setMissPunchRequests(res.data);
          }
        });
    }
  }, []);

  console.log(currentUser?.permissions);
  return (
    <div className="px-5 mx-5 py-4">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className=" shadow mb-4">
        <DashboardHeader
          currentView={currentView}
          setCurrentView={setCurrentView}
          punchRequestsCount={
            filteredRequests.filter(
              (req) => req.isApproved === null || req.isApproved === undefined
            ).length
          }
          isAdmin={isAdmin}
        />
        {currentView === "attendance" && userId && (
          <UserDetailedAttendance
            onManualStatusChange={handleManualStatusChange}
            onMissPunchRequest={handleMissPunchRequest}
            userId={userId}
          />
        )}

        {currentView === "users-attendance" && <UsersAttendanceTable />}
        {currentView === "punch-requests" && (
          <RequestsTable
            filteredRequests={filteredRequests}
            handleApproveReject={handleApproveReject}
            isAdmin={isAdmin}
          />
        )}
      </div>

      {/* Miss Punch Request Modal */}
      {showMissPunchForm && (
        <MissPunchForm
          formData={formData}
          setFormData={setFormData}
          handleFormSubmit={handleFormSubmit}
          setShowMissPunchForm={setShowMissPunchForm}
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

import { lazy, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../store/store";
import { toast } from "react-toastify";
import DashboardHeader from "./components/header";
import UserDetailedAttendance from "./components/detailed-attendance";
import punchDataService from "../../services/api-services/punch-data.service";
import { PunchResponse } from "../../types/punch-data.types";
import generalService from "../../services/api-services/general.service";

const RequestsTable = lazy(() => import("./components/requests-table"));

const MissPunchForm = lazy(() => import("./components/miss-punch-form"));
const ApproveRejectModal = lazy(
  () => import("./components/approve-reject-modal")
);
const UsersAttendanceTable = lazy(
  () => import("./components/users-attendance-table")
);

const AttendanceDashboard = () => {
  const [missPunchRequests, setMissPunchRequests] = useState<PunchResponse[]>(
    []
  );

  const [showMissPunchForm, setShowMissPunchForm] = useState(false);
  const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<PunchResponse | null>(
    null
  );
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
  const userId = currentUser?.id;
  const permissions = currentUser?.permissions || [];
  const isAdmin =
    permissions.some((p) =>
      ["is_admin", "is_team_admin", "is_department_admin"].includes(p)
    ) || false;

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

  const handleFormSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (
      !currentUser ||
      !formData.time ||
      !formData.reason ||
      (isAdmin && !formData.targetUserId)
    ) {
      toast.error("Please fill all required fields");
      return;
    }

    const [hours, minutes] = formData.time.split(":").map(Number);
    const [year, month, day] = formData.date.split("-").map(Number);

    if (!year || !month || !day) {
      toast.error("Invalid date format");
      return;
    }

    const requestData = {
      date: day,
      month,
      year,
      hh: hours,
      mm: minutes,
      userId: formData.targetUserId,
      missPunchReason: formData.reason,
    };

    const isSameUser = userId == formData.targetUserId;

    const resp = isSameUser
      ? await generalService.createPunchRequest(requestData)
      : await punchDataService.createPunchData(requestData);

    if (resp.status == "success") {
      setShowMissPunchForm(false);
      setFormData({
        name: "",
        date: "",
        time: "",
        reason: "",
        targetUserId: 0,
      });
    } else toast.error(resp.message);
  };

  const handleApproveReject = (
    request: PunchResponse,
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
      };

      const resp = await punchDataService.approvePunch(
        currentRequest.id,
        approvalData
      );

      if (resp.status == "success") {
        fetchPunchRequests();
        toast.success(resp.message);
        setShowApproveRejectModal(false);
      } else toast.error(resp.message);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      toast.error(`Failed to ${actionType} request: ` + errorMessage);
    }
  };

  const fetchPunchRequests = useCallback(() => {
    if (currentUser && currentUser.id) {
      punchDataService.getPunches({ type: "MANUAL" }).then((res) => {
        if (res.status === "success") {
          setMissPunchRequests(res.data);
        }
      });
    }
  }, [currentUser]);

  useEffect(() => {
    fetchPunchRequests();
  }, []);

  return (
    <div className="p-2 mx-2">
      <div className="mb-4">
        <DashboardHeader
          currentView={currentView}
          setCurrentView={setCurrentView}
          punchRequestsCount={
            missPunchRequests.filter((r) => !r.approvedBy).length
          }
          isAdmin={isAdmin}
        />
        {currentView === "attendance" && userId && (
          <UserDetailedAttendance
            onMissPunchRequest={handleMissPunchRequest}
            userId={userId}
          />
        )}

        {currentView === "users-attendance" && (
          <UsersAttendanceTable onMissPunchRequest={handleMissPunchRequest} />
        )}
        {currentView === "punch-requests" && (
          <RequestsTable
            filteredRequests={missPunchRequests}
            handleApproveReject={handleApproveReject}
            isAdmin={isAdmin}
          />
        )}
      </div>

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

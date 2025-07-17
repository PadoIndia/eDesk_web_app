import { lazy, useCallback, useEffect, useState } from "react";
import { useAppSelector } from "../../store/store";
import { toast } from "react-toastify";
import DashboardHeader from "./components/header";
import UserDetailedAttendance from "./components/detailed-attendance";
import punchDataService from "../../services/api-services/punch-data.service";
import { PunchResponse } from "../../types/punch-data.types";

const RequestsTable = lazy(() => import("./components/requests-table"));

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

  const [showApproveRejectModal, setShowApproveRejectModal] = useState(false);
  const [currentRequest, setCurrentRequest] = useState<PunchResponse | null>(
    null
  );
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(
    null
  );
  const [rejectionReason, setRejectionReason] = useState("");

  const [currentView, setCurrentView] = useState<
    "attendance" | "users-attendance" | "punch-requests"
  >("attendance");

  const currentUser = useAppSelector((s) => s.auth.userData?.user);
  const userId = currentUser?.id;
  const permissions = currentUser?.permissions || [];
  const isAdmin =
    permissions.some((p) =>
      ["is_admin", "is_admin_team", "is_admin_department"].includes(p)
    ) || false;

  const isHr = permissions.some((p) => ["is_hr", "is_admin"].includes(p));

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
          <UserDetailedAttendance userId={userId} />
        )}

        {currentView === "users-attendance" && <UsersAttendanceTable />}
        {currentView === "punch-requests" && (
          <RequestsTable
            filteredRequests={missPunchRequests}
            handleApproveReject={handleApproveReject}
            isAdmin={isHr}
          />
        )}
      </div>

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

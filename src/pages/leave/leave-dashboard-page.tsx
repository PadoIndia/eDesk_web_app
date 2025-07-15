import { useState, useEffect, lazy, useCallback } from "react";
import { FaCog } from "react-icons/fa";
import { useAppSelector } from "../../store/store";
import { LeaveRequestStatus } from "../../types/leave.types";
import { GrTransaction } from "react-icons/gr";
import { BiGitPullRequest } from "react-icons/bi";
import { PiPiggyBankBold } from "react-icons/pi";
import { MdOutlineSend } from "react-icons/md";
import leaveRequestService from "../../services/api-services/leave-request.service";

const LeaveConfiguration = lazy(() => import("./leave-configuration"));
const ApplyLeave = lazy(() => import("./apply-leave"));
const LeaveRequests = lazy(() => import("./leave-requests"));
const LeaveTransactions = lazy(() => import("./leave-transaction"));
const LeaveBalanceComponent = lazy(
  () => import("./leave-dashboard-components/leave-balance")
);

const LeaveDashboard = () => {
  const user = useAppSelector((s) => s.auth.userData?.user);
  const userId = user?.id;
  const permissions = user?.permissions || [];
  const isAdmin = permissions.some((p) =>
    ["is_admin", "is_admin_department", "is_admin_team"].includes(p)
  );
  const [leaveReqCount, setLeaveReqCount] = useState<number>(0);
  const [currentTab, setCurrentTab] = useState<
    "balance" | "transactions" | "config" | "requests" | "apply"
  >("balance");

  const fetchData = useCallback(async () => {
    if (!userId || !isAdmin) return;

    try {
      const requestsRes = await leaveRequestService.getLeaveRequests({
        hrStatus: LeaveRequestStatus.PENDING,
        managerStatus: LeaveRequestStatus.PENDING,
      });
      if (requestsRes.status === "success")
        setLeaveReqCount(requestsRes.data.length);
    } catch (error) {
      console.error("Failed to fetch dashboard data:", error);
    }
  }, [userId, isAdmin]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="p-2 mx-2">
      <div
        style={{
          border: "1px solid #f1f1f1",
        }}
        className="bg-white shadow-md  card mb-2 rounded-lg text-white p-3 d-flex gap-2"
      >
        <div className="d-flex gap-2 align-items-center">
          <button
            className={`btn ${
              currentTab === "balance" ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setCurrentTab("balance")}
          >
            <PiPiggyBankBold className="me-1" /> Leave Balance
          </button>
          {isAdmin && (
            <button
              className={`btn ${
                currentTab === "transactions"
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setCurrentTab("transactions")}
            >
              <GrTransaction className="me-1" /> Leave Transactions
            </button>
          )}
          {isAdmin && (
            <button
              className={`btn ${
                currentTab === "config"
                  ? "btn-primary"
                  : "btn-outline-secondary"
              }`}
              onClick={() => setCurrentTab("config")}
            >
              <FaCog className="me-1" /> Leave Configuration
            </button>
          )}
          <button
            className={`btn position-relative ${
              currentTab === "requests"
                ? "btn-primary"
                : "btn-outline-secondary"
            }`}
            onClick={() => setCurrentTab("requests")}
          >
            <BiGitPullRequest className="me-1" /> Leave Requests
            {leaveReqCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {leaveReqCount}
                <span className="visually-hidden">leave requests</span>
              </span>
            )}
          </button>
          <button
            className={`btn ${
              currentTab === "apply" ? "btn-primary" : "btn-outline-secondary"
            }`}
            onClick={() => setCurrentTab("apply")}
          >
            <MdOutlineSend className="me-1" /> Apply Leave
          </button>
        </div>
      </div>
      <div
        style={{
          border: "1px solid #f1f1f1",
        }}
        className="bg-white shadow-md  card mb-2 rounded-lg text-white p-3 d-flex gap-2"
      >
        {currentTab === "balance" ? (
          <LeaveBalanceComponent userId={userId} />
        ) : currentTab === "requests" ? (
          <LeaveRequests refetch={fetchData} />
        ) : currentTab === "transactions" ? (
          <LeaveTransactions />
        ) : currentTab === "apply" ? (
          <ApplyLeave />
        ) : (
          <LeaveConfiguration />
        )}
      </div>
    </div>
  );
};

export default LeaveDashboard;

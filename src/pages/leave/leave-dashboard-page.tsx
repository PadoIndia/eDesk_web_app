import { useState, useEffect, lazy } from "react";
import { FaCalendarAlt, FaPlus } from "react-icons/fa";
import { Link } from "react-router-dom";
import leaveTransactionService from "../../services/api-services/leave-transaction.service";
import { useAppSelector } from "../../store/store";
import RecentLeaveRequestsComponent from "./leave-dashboard-components/recent-leave-request";
import { toast } from "react-toastify";
import leaveTypeService from "../../services/api-services/leave-type.service";
import { buildLeaveBalances } from "../../utils/helper";
import { LeaveBalance, LeaveRequestResponse } from "../../types/leave.types";
import generalService from "../../services/api-services/general.service";

const LeaveBalanceComponent = lazy(
  () => import("./leave-dashboard-components/leave-balance")
);

const LeaveDashboard = () => {
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
  const [recentRequests, setRecentRequests] = useState<LeaveRequestResponse[]>(
    []
  );
  const [loading, setLoading] = useState(true);

  const userId = useAppSelector((s) => s.auth.userData?.user.id);

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;

      setLoading(true);
      try {
        const resp = await leaveTransactionService.getLeaveTransactions({
          userId,
        });

        if (resp.status === "success") {
          const typesResp = await leaveTypeService.getLeaveTypes();
          if (typesResp.status === "success") {
            setLeaveBalance(buildLeaveBalances(typesResp.data, resp.data));
          }
        } else toast.error(resp.message);

        const requestsRes = await generalService.getMyLeaveRequests({
          limit: 3,
          userId,
          sortBy: "submittedOn",
          sortOrder: "desc",
        });
        if (requestsRes.status === "success")
          setRecentRequests(requestsRes.data);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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
        {/* Leave Balance Component */}
        <div className="col-md-6">
          <LeaveBalanceComponent
            leaveBalance={leaveBalance}
            loading={loading}
          />
        </div>

        {/* Recent Leave Requests Component */}
        <div className="col-md-6">
          <RecentLeaveRequestsComponent
            recentRequests={recentRequests}
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
};

export default LeaveDashboard;

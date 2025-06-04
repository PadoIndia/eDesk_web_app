import { useState, useEffect } from "react";
import {
  FaCalendarAlt,
  FaPlus,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import leaveRequestService from "../../services/api-services/leave-request.service";
import leaveTransactionService from "../../services/api-services/leave-transaction.service";
import { useAppSelector } from "../../store/store";
import LeaveBalanceComponent from "./leave-dashboard-components/leave-balance";
import RecentLeaveRequestsComponent from "./leave-dashboard-components/recent-leave-request";

interface LeaveBalance {
  id: number;
  type: string;
  total: number;
  used: number;
  remaining: number;
  isPaid: boolean;
}

interface LeaveRequest {
  id: number;
  type: string;
  startDate: string;
  endDate: string;
  duration: number;
  status: string;
  reason: string;
}

const LeaveDashboard = () => {
  // State for dashboard data
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance[]>([]);
  const [recentRequests, setRecentRequests] = useState<LeaveRequest[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = useAppSelector((s) => s.auth.userData?.user.id);

  // Fetch dashboard data
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      
      setLoading(true);
      try {
        // Fetch leave balance - corrected API call
        const balanceRes = await leaveTransactionService.getLeaveBalance(userId);
        setLeaveBalance(balanceRes.data);
        
        // Fetch recent requests - corrected parameters structure
        const requestsRes = await leaveRequestService.getMyLeaveRequests({
          limit: 3,
          sortBy: "submittedOn",
          sortOrder: "desc"
        });
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
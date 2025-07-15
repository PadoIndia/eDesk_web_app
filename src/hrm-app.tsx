import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { AppDispatch, useAppSelector } from "./store/store";
import { useDispatch } from "react-redux";
import { setUserDepartments } from "./features/user-department.slice";
import React from "react";
import generalService from "./services/api-services/general.service";
import HrmLayout from "./components/layout/hrm-layout";

const Dashboard = React.lazy(() => import("./pages/dashboard/dashboard"));

const Attendance = React.lazy(() => import("./pages/attendance/attendance"));
const DepartmentManagement = React.lazy(
  () => import("./pages/department/department-management")
);
const LeaveDashboard = React.lazy(
  () => import("./pages/leave/leave-dashboard-page")
);
// const ApplyLeave = React.lazy(() => import("./pages/leave/apply-leave"));
// const LeaveRequests = React.lazy(() => import("./pages/leave/leave-requests"));
// const LeaveTransactions = React.lazy(
//   () => import("./pages/leave/leave-transaction")
// );
// const LeaveConfiguration = React.lazy(
//   () => import("./pages/leave/leave-configuration")
// );
// const UserLeaveBalances = React.lazy(
//   () => import("./pages/leave/user-leave-balance")
// );

const UsersList = React.lazy(() => import("./pages/users/user-list"));

function HrmApp() {
  const dispatch = useDispatch<AppDispatch>();
  const userId = useAppSelector((state) => state.auth.userData?.user.id);
  useEffect(() => {
    const fetchDepartments = async () => {
      if (!userId) return;
      const resp = await generalService.getUserDepartments(userId);
      if (resp.status === "success") {
        dispatch(setUserDepartments(resp.data));
      }
    };
    fetchDepartments();
  }, [userId, dispatch]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Routes>
        <Route path="/" element={<HrmLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users/list" element={<UsersList />} />
          <Route path="/leave" element={<LeaveDashboard />} />
          {/* <Route path="/leave-requests" element={<LeaveRequests />} />
          <Route path="/leave-transactions" element={<LeaveTransactions />} />
          <Route path="/leave-config" element={<LeaveConfiguration />} />
          <Route path="/user-leave-balances" element={<UserLeaveBalances />} /> */}
          <Route path="/attendance" element={<Attendance />} />
          <Route
            path="/department-management"
            element={<DepartmentManagement />}
          />
        </Route>
      </Routes>
    </div>
  );
}

export default HrmApp;

import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard/dashboard";
import { useAppDispatch, useAppSelector } from "./store/store";
import { useEffect } from "react";
import { checkAuth } from "./features/auth.slice";
import HrmNavbar from "./components/layout/navbar/hrm-index";
import HrmSidebar from "./components/layout/sidebar/hrm-index";
import Attendance from "./pages/attendance/attendance";
import DepartmentManagement from "./pages/department/department-management";
import LeaveDashboard from "./pages/leave/leave-dashboard-page";
import ApplyLeave from "./pages/leave/apply-leave";
import LeaveRequests from "./pages/leave/leave-requests";
import LeaveTransactions from "./pages/leave/leave-transaction";
import LeaveConfiguration from "./pages/leave/leave-configuration";
import UserLeaveBalances from "./pages/leave/user-leave-balance";
import UserDetails from "./pages/users/user-details";
import UserEditForm from "./pages/users/user-edit-form";

function HrmApp() {
  const loggedIn = useAppSelector((s) => s.auth.isLoggedIn);
  const isVerifying = useAppSelector((s) => s.auth.isVerifying);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, []);

  if (isVerifying) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>Loading...</div>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
        <HrmNavbar />
        <HrmSidebar />
    <Routes>
     <Route
        path="/dashboard"
        element={ <Dashboard /> }
        />
         <Route path="/users/:userId" element={<UserDetails />} />
          <Route path="/users/edit/:userId" element={<UserEditForm />} />
          <Route path="/leave" element={<LeaveDashboard />} />
          <Route path="/apply-leave" element={<ApplyLeave />} />
          <Route path="/leave-requests" element={<LeaveRequests />} />
          <Route path="/leave-transactions" element={<LeaveTransactions />} />
          <Route path="/leave-config" element={<LeaveConfiguration />} />
          <Route path="/user-leave-balances" element={<UserLeaveBalances />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route
            path="/department-management"
            element={<DepartmentManagement />}
          />
  </Routes>
        </div>
  );
}

export default HrmApp;
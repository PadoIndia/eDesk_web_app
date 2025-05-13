import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/login";
import Layout from "./components/layout";
import Dashboard from "./pages/dashboard/dashboard";
import { useAppDispatch, useAppSelector } from "./store/store";
import { useEffect } from "react";
import { checkAuth } from "./features/auth.slice";
import HrmNavbar from "./components/layout/navbar/hrm-index";
import HrmSidebar from "./components/layout/sidebar/hrm-index";

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
  </Routes>
        </div>
  );
}

export default HrmApp;
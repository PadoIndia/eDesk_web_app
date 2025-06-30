import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import "./styles.scss";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { fetchUserPermissions } from "../../features/auth.slice";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const pathname = location.pathname;
  const isHome = pathname === "/";
  const isEventPage = /^\/events\/[^/]+$/.test(pathname);

  const shouldShowSidebar = isHome || isEventPage;
  const userId = useAppSelector((s) => s.auth.userData?.user.id);
  const dispatch = useAppDispatch();

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);
  const isChat = pathname === "/chats";

  useEffect(() => {
    if (userId) {
      dispatch(fetchUserPermissions(userId));
    }
  }, []);

  return (
    <div className="layout-container">
      {!isChat && <Navbar onMenuClick={toggleSidebar} />}

      <div className="layout-body">
        {shouldShowSidebar && (
          <>
            <div className={`mobile-sidebar ${isSidebarOpen ? "open" : ""}`}>
              <Sidebar />
            </div>
            <aside className="desktop-sidebar">
              <Sidebar />
            </aside>
          </>
        )}

        {isSidebarOpen && (
          <div className="sidebar-overlay" onClick={closeSidebar} />
        )}

        <main
          className={`main-content ${shouldShowSidebar ? "with-sidebar" : ""} ${
            isChat ? "m-0" : ""
          }`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

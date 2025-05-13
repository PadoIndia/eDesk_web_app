import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import "./styles.scss";

const Layout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const pathname = location.pathname;
  const isHome = pathname === "/";
  const isEventPage = /^\/events\/[^/]+$/.test(pathname);

  const shouldShowSidebar = isHome || isEventPage;

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="layout-container">
      <Navbar onMenuClick={toggleSidebar} />

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
          className={`main-content ${shouldShowSidebar ? "with-sidebar" : ""}`}
        >
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;

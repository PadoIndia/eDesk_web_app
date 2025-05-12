import { useState } from "react";
import Navbar from "./navbar";
import Sidebar from "./sidebar";
import "./styles.scss";

const Layout = ({
  children,
  showSideBar = true,
}: {
  children: React.ReactNode;
  showSideBar?: boolean;
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="layout-container">
      <Navbar onMenuClick={toggleSidebar} />

      <div className="layout-body">
        {showSideBar && (
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
          <div className="sidebar-overlay" onClick={closeSidebar}></div>
        )}

        <main className={`main-content ${showSideBar ? "with-sidebar" : ""}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;

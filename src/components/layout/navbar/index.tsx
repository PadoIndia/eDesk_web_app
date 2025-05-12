import { Link } from "react-router-dom";
import { useState } from "react";
import { useAppDispatch } from "../../../store/store";
import { logOut } from "../../../features/auth.slice";

export default function Navbar({ onMenuClick }: { onMenuClick: () => void }) {
  const [navbarCollapsed, setNavbarCollapsed] = useState(true);
  const dispatch = useAppDispatch();

  const toggleNavbar = () => {
    setNavbarCollapsed(!navbarCollapsed);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
        <div className="container-fluid">
          {/* Logo and hamburger section */}
          <div className="d-flex align-items-center">
            <button
              className="btn btn-light border-0 d-lg-none me-2"
              onClick={onMenuClick}
              aria-label="Toggle sidebar"
            >
              <i className="bi bi-list fs-5"></i>
            </button>
            <Link className="navbar-brand d-flex align-items-center" to="/">
              <img src="/logo.png" alt="Logo" height="30" className="me-2" />
              <span className="fw-bold">VideoRepo</span>
            </Link>
          </div>

          {/* Responsive toggle button */}
          <button
            className="navbar-toggler"
            type="button"
            onClick={toggleNavbar}
            aria-controls="navbarContent"
            aria-expanded={!navbarCollapsed}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          {/* Collapsible content */}
          <div
            className={`collapse navbar-collapse ${
              navbarCollapsed ? "" : "show"
            }`}
            id="navbarContent"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link px-3" to="/dashboard">
                  <i className="bi bi-speedometer2 me-1"></i> Dashboard
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3" to="/search">
                  <i className="bi bi-search me-1"></i> Search
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3" to="/events">
                  <i className="bi bi-calendar-event me-1"></i> Events
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3" to="/social-media">
                  <i className="bi bi-share me-1"></i> Socials
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link px-3" to="/logs">
                  <i className="bi bi-journal-text me-1"></i> Logs
                </Link>
              </li>
            </ul>

            {/* Profile dropdown - always visible but adjusts based on screen size */}
            <div className="nav-item dropdown">
              <button
                className="btn btn-outline-secondary dropdown-toggle d-flex align-items-center"
                type="button"
                id="profileDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <i className="bi bi-person-circle me-1"></i>
                <span className="d-none d-md-inline">Account</span>
              </button>
              <ul
                className="dropdown-menu dropdown-menu-end shadow"
                aria-labelledby="profileDropdown"
              >
                <li>
                  <Link className="dropdown-item" to="/profile">
                    <i className="bi bi-person me-2 text-muted"></i> Profile
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button
                    className="dropdown-item text-danger"
                    onClick={() => {
                      dispatch(logOut());
                    }}
                  >
                    <i className="bi bi-box-arrow-right me-2"></i> Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>
    </>
  );
}

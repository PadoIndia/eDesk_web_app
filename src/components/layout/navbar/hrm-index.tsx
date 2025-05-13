import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';

  return (
    <nav className="navbar navbar-expand-md bg-white shadow-sm sticky-top px-3 w-100">
      <button
        className="navbar-toggler d-md-none me-2"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#sidebarOffcanvas"
        aria-controls="sidebarOffcanvas"
      >
        <span className="navbar-toggler-icon"></span>
      </button>

      <Link className="navbar-brand me-auto" to="/">
        eCloud
      </Link>

      <div className="d-flex gap-2">
        {!isDashboard && (
          <Link className="btn btn-primary" to="/dashboard">
            Dashboard
          </Link>
        )}
        <Link className="btn btn-outline-primary" to="/login">
          Login
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;
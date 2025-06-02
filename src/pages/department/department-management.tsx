import { FaUsers } from "react-icons/fa";
import DepartmentSidebar from "./components/department-sidebar";
import DepartmentList from "./components/department-list";
import { Link } from "react-router-dom";

const DepartmentManagement = () => {

  return (
    <div className="container p-4">
      <div className="row g-4">
        <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
          <h5 className="mb-0">
            <FaUsers className="me-2" />
            Departments & Teams
          </h5>
          <div>
            <Link to="/hrm/user-department" className="btn btn-light me-2">
              Assign Users
            </Link>
          </div>
        </div>
        <DepartmentSidebar />
        <div className="col-lg-9">
          <div className="card shadow">
            <div className="card-header bg-primary text-white py-3">
              <h5 className="mb-0 d-flex align-items-center">
                <FaUsers className="me-2 fs-4" />
                Departments & Teams
              </h5>
            </div>
            <div className="card-body p-0">
              <DepartmentList />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DepartmentManagement;

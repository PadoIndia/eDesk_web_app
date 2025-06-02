import { FaPlus } from "react-icons/fa";
import DepartmentForm from "./department-form";
import TeamForm from "./team-form";


const DepartmentSidebar = () => (
  <div className="col-md-3">
    <div className="card shadow">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <FaPlus className="me-2" />
          Organization Structure
        </h5>
      </div>
      <div className="card-body">
        <DepartmentForm />
        <TeamForm />
      </div>
    </div>
  </div>
);

export default DepartmentSidebar;
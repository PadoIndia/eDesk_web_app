import { FaPlus } from "react-icons/fa";
import DepartmentForm from "./department-form";
import TeamForm from "./team-form";
import { Department } from "../../../types/department-team.types";

interface DepartmentSidebarProps {
  departments: Department[];
  onAddDepartment: (department: {
    name: string;
    slug: string;
    responsibilities: string;
  }) => void;
  onAddTeam: (departmentId: string, teamName: string, responsibilities:string ) => void;
}

const DepartmentSidebar = ({ departments, onAddDepartment, onAddTeam }: DepartmentSidebarProps) => (
  <div className="col-md-3">
    <div className="card shadow">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">
          <FaPlus className="me-2" />
          Organization Structure
        </h5>
      </div>
      <div className="card-body">
        <DepartmentForm onAddDepartment={onAddDepartment} />
        <TeamForm departments={departments} onAddTeam={onAddTeam} />
      </div>
    </div>
  </div>
);

export default DepartmentSidebar;
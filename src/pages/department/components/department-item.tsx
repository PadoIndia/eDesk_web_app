import { FaTrash, FaInfoCircle } from "react-icons/fa";
import TeamList from "./team-list";
import { Department, User } from "../../../types/department-team.types";

interface DepartmentItemProps {
  department: Department;
  onDeleteDepartment: (id: string) => void;
  onDeleteTeam: (deptId: string, teamId: string) => void;
  onAddMember: (deptId: string, teamId: string, user: User) => void;
  users: User[];
}

const DepartmentItem = ({
  department,
  onDeleteDepartment,
  onDeleteTeam,
  onAddMember,
  users
}: DepartmentItemProps) => (
  <div className="mb-4 border-bottom pb-4 m-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 className="mb-1">
          {department.name}
          <span className="badge bg-secondary ms-2">{department.teams.length} teams</span>
        </h4>
        {department.responsibilities && (
          <div className="mt-2 mx-5">
            <div className="d-flex align-items-center text-muted">
              <div className="position-relative">
            <FaInfoCircle 
              className="me-2" 
              data-bs-toggle="tooltip" 
              data-bs-placement="top" 
              title={department.responsibilities}
            />
              </div>
              <small style={{ 
            maxWidth: "200px", 
            whiteSpace: "nowrap", 
            overflow: "hidden", 
            textOverflow: "ellipsis" 
              }}>
            Responsibilities: {department.responsibilities}
              </small>
            </div>
          </div>
        )}
      </div>
      <button
        className="btn btn-danger btn-sm rounded-circle h-25"
        onClick={() => onDeleteDepartment(department.id)}
      >
        <FaTrash />
      </button>
    </div>

    <TeamList
      department={department}
      onDeleteTeam={onDeleteTeam}
      onAddMember={onAddMember}
      users={users}
    />
  </div>
);

export default DepartmentItem;
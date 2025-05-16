import { FaTrash } from "react-icons/fa";
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
  <div className="mb-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <h4 className="mb-0">
        {department.name}
        <span className="badge bg-secondary ms-2">{department.teams.length} teams</span>
      </h4>
      <button
        className="btn btn-danger btn-sm rounded-circle"
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
import DepartmentItem from "./department-item";
import { Department, User } from "../../../types/department-team.types";

interface DepartmentListProps {
  departments: Department[];
  onDeleteDepartment: (id: string) => void;
  onDeleteTeam: (deptId: string, teamId: string) => void;
  onAddMember: (deptId: string, teamId: string, user: User) => void;
  users: User[];
}

const DepartmentList = ({
  departments,
  onDeleteDepartment,
  onDeleteTeam,
  onAddMember,
  users
}: DepartmentListProps) => (
  <>
    {departments.length === 0 ? (
      <div className="text-center py-5">
        <h4 className="text-muted">No departments created yet</h4>
      </div>
    ) : (
      departments.map((dept) => (
        <DepartmentItem
          key={dept.id}
          department={dept}
          onDeleteDepartment={onDeleteDepartment}
          onDeleteTeam={onDeleteTeam}
          onAddMember={onAddMember}
          users={users}
        />
      ))
    )}
  </>
);

export default DepartmentList;
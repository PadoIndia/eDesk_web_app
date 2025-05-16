import TeamItem from "./team-items";
import { Department, User } from "../../../types/department-team.types";

interface TeamListProps {
  department: Department;
  onDeleteTeam: (deptId: string, teamId: string) => void;
  onAddMember: (deptId: string, teamId: string, user: User) => void;
  users: User[];
}

const TeamList = ({ department, onDeleteTeam, onAddMember, users }: TeamListProps) => (
  <div className="row row-cols-1 row-cols-md-3 g-4">
    {department.teams.map((team) => (
      <TeamItem
        key={team.id}
        department={department}
        team={team}
        onDeleteTeam={onDeleteTeam}
        onAddMember={onAddMember}
        users={users}
      />
    ))}
  </div>
);

export default TeamList;
import { Department} from "../../../types/department-team.types";
import TeamItem from "./team-items";

interface TeamListProps {
  department: Department;
}

const TeamList = ({ 
  department,
   }: TeamListProps) => {
  const teams = department.teams || [];

  return (
    <div className="row row-cols-1 row-cols-md-3 g-4 mx-4">
      {teams.map((team) => (
        <TeamItem
          key={team.id}
          department={department}
          team={team}
        />
      ))}
    </div>
  );
};

export default TeamList;
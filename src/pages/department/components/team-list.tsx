// // components/team-list.tsx
// import { Department, User } from "../../../types/department-team.types";
// import TeamItem from "./team-items";

// interface TeamListProps {
//   department: Department;
//   onDeleteTeam: (deptId: string, teamId: string) => void;
//   onAddMember: (deptId: string, teamId: string, user: User) => void;
//   users: User[];
// }

// const TeamList = ({ department, onDeleteTeam, onAddMember, users }: TeamListProps) => {
//   return (
//     <div className="row row-cols-1 row-cols-md-3 g-4 mx-4">
//       {department.teams.map((team) => (
//         <TeamItem
//           key={team.id}
//           department={department}
//           team={team}
//           onDeleteTeam={onDeleteTeam}
//           onAddMember={onAddMember}
//           users={users}
//         />
//       ))}
//     </div>
//   );
// };

// export default TeamList;



// components/team-list.tsx
import { Department, User } from "../../../types/department-team.types";
import TeamItem from "./team-items";

interface TeamListProps {
  department: Department;
  onDeleteTeam: (deptId: string, teamId: string) => void;
  onAddMember: (deptId: string, teamId: string, user: User) => void;
  users: User[];
}

const TeamList = ({ department, onDeleteTeam, onAddMember, users }: TeamListProps) => {
  // Add null check for teams array
  const teams = department.teams || [];

  return (
    <div className="row row-cols-1 row-cols-md-3 g-4 mx-4">
      {teams.map((team) => (
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
};

export default TeamList;
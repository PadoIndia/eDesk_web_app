import { useState } from "react";
import { FaPlus, FaTrash } from "react-icons/fa";
import AddMemberModal from "./add-member-modal";
import { Department, Team, User } from "../../../types/department-team.types";

interface TeamItemProps {
  department: Department;
  team: Team;
  onDeleteTeam: (deptId: string, teamId: string) => void;
  onAddMember: (deptId: string, teamId: string, user: User) => void;
  users: User[];
}

const TeamItem = ({ department, team, onDeleteTeam, onAddMember, users }: TeamItemProps) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <div className="col">
      <div className="card h-100">
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="card-title mb-0">{team.name}</h5>
            <button
              className="btn btn-danger btn-sm rounded-circle"
              onClick={() => onDeleteTeam(department.id, team.id)}
            >
              <FaTrash />
            </button>
          </div>
          <div className="mt-2">
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-muted">{team.members.length} members</span>
              <button
                className="btn btn-sm btn-primary"
                onClick={() => setShowModal(true)}
              >
                <FaPlus /> Add Member
              </button>
            </div>
            {team.members.length > 0 && (
              <ul className="list-group mt-2">
                {team.members.map((member) => (
                  <li key={member.id} className="list-group-item py-2">
                    <div>{member.name}</div>
                    <small className="text-muted">{member.email}</small>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>

      {showModal && (
        <AddMemberModal
          departmentId={department.id}
          teamId={team.id}
          users={users}
          onClose={() => setShowModal(false)}
          onAddMember={onAddMember}
        />
      )}
    </div>
  );
};

export default TeamItem;
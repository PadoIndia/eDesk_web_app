import { useState } from "react";
import { FaInfoCircle, FaPlus, FaTrash } from "react-icons/fa";
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
    <div className="col mb-4">
      <div className="card h-100 shadow-sm border-0">
        <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
          <div className="d-flex flex-column">
            <h5 className="mb-0 fw-semibold text-primary">{team.name}</h5>
            {team.responsibilities && (
              <div className="mt-1 d-flex align-items-center">
                <div className="position-relative" title={team.responsibilities}>
                  <FaInfoCircle className="text-muted me-1 fs-6" />
                </div>
                <small className="text-muted" style={{ 
                  maxWidth: "100px", 
                  overflow: "hidden", 
                  textOverflow: "ellipsis", 
                  whiteSpace: "nowrap" 
                }}>
                  {team.responsibilities}
                </small>
              </div>
            )}
          </div>
          <button
            className="btn btn-sm rounded-circle badge-rejected"
            onClick={() => onDeleteTeam(department.id, team.id)}
          >
            <FaTrash />
          </button>
        </div>

        <div className="card-body pb-2">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <span className="badge bg-primary bg-opacity-10 text-primary">
              {team.members.length} member{team.members.length !== 1 ? 's' : ''}
            </span>
            <button
              className="btn btn-sm btn-outline-primary d-flex align-items-center"
              onClick={() => setShowModal(true)}
            >
              <FaPlus className="me-1" /> Add Member
            </button>
          </div>

          {team.members.length > 0 && (
            <div className="border-top pt-3">
              <div className="list-group list-group-flush">
                {team.members.map((member) => (
                  <div 
                    key={member.id} 
                    className="list-group-item border-0 px-0 py-2 d-flex justify-content-between align-items-center hover-bg"
                  >
                    <div>
                      <div className="fw-medium text-dark">{member.name}</div>
                      <small className="text-muted">{member.email}</small>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { User } from "../../../types/department-team.types";

interface AddMemberModalProps {
  departmentId: string;
  teamId: string;
  users: User[];
  onClose: () => void;
  onAddMember: (deptId: string, teamId: string, user: User) => void;
}

const AddMemberModal = ({
  departmentId,
  teamId,
  users,
  onClose,
  onAddMember
}: AddMemberModalProps) => {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="modal show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Add Team Member</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="input-group mb-3">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="list-group">
              {filteredUsers.map((user) => (
                <button
                  key={user.id}
                  className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                  onClick={() => {
                    onAddMember(departmentId, teamId, user);
                    onClose();
                  }}
                >
                  <div>
                    <div>{user.name}</div>
                    <small className="text-muted">{user.email}</small>
                  </div>
                  <FaPlus className="text-primary" />
                </button>
              ))}
              {filteredUsers.length === 0 && (
                <div className="text-center py-3 text-muted">No users found</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddMemberModal;
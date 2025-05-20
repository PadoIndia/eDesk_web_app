import React from "react";
import { AttendanceUser } from "../../../types/attendance.types";

interface AdminControlsProps {
  currentUser: AttendanceUser;
  users: AttendanceUser[];
  setCurrentUser: (user: AttendanceUser) => void;
}

const AdminControls: React.FC<AdminControlsProps> = ({
  currentUser,
  users,
  setCurrentUser
}) => {
  const handleUserChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const user = users.find((u) => u.id === parseInt(e.target.value));
    if (user) setCurrentUser(user);
  };

  return (
    <div className="card mt-4">
      <div className="card-header bg-secondary text-white">
        <h5 className="mb-0">Admin Controls</h5>
      </div>
      <div className="card-body">
        <div className="mb-3">
          <label className="form-label">Switch User View</label>
          <select
            className="form-select"
            value={currentUser.id}
            onChange={handleUserChange}
          >
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name} ({user.department})
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

export default AdminControls;
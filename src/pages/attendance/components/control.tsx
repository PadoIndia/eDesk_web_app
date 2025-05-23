import React from "react";
import { FaPlus } from "react-icons/fa";
import { AttendanceUser } from "../../../types/attendance.types";

interface DashboardControlsProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  filterDepartment: string;
  setFilterDepartment: (department: string) => void;
  users: AttendanceUser[];
  currentUser: AttendanceUser;
   handleMissPunchRequest: (date: string) => void;
}

const DashboardControls: React.FC<DashboardControlsProps> = ({
  searchTerm,
  setSearchTerm,
  filterDepartment,
  setFilterDepartment,
  users,
  currentUser,
  handleMissPunchRequest
}) => {
  // Extract unique departments for filter dropdown
  const departments = Array.from(new Set(users.map((user) => user.department)));
  
  // Check if current user needs miss punch button
  const showMissPunchButton = currentUser && 
    !currentUser.isAdmin && 
    currentUser.punchData.length % 2 !== 0;
    
  return (
    <div className="row g-3 mb-4 align-items-end">
      <div className="col-md-4">
        <label className="form-label">Search Employee</label>
        <input
          type="text"
          className="form-control"
          placeholder="Search by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="col-md-4">
        <label className="form-label">Department</label>
        <select
          className="form-select"
          value={filterDepartment}
          onChange={(e) => setFilterDepartment(e.target.value)}
        >
          <option value="All">All Departments</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>
      
      {showMissPunchButton && (
        <div className="col-md-4 col-lg-3 ms-auto">
          <button
            className="btn btn-primary w-100"
            onClick={() => handleMissPunchRequest(new Date().toISOString())}
          >
            <FaPlus className="me-2" /> Request Miss Punch
          </button>
        </div>
      )}
    </div>
  );
};

export default DashboardControls;




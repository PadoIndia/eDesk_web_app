import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Department } from "../../../types/department-team.types";

interface TeamFormProps {
  departments: Department[];
  onAddTeam: (departmentId: string, teamName: string, responsibilities: string) => void;
}

const TeamForm = ({ departments, onAddTeam }: TeamFormProps) => {
  const [selectedDept, setSelectedDept] = useState("");
  const [teamName, setTeamName] = useState("");
  const [responsibilities, setResponsibilities] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDept && teamName.trim()) {
      onAddTeam(selectedDept, teamName, responsibilities);
      setTeamName("");
      setResponsibilities("");
    }
  };

  return (
    <div className="mb-4">
      <h6>Add Team to Department</h6>
      <div className="mb-3">
        <select
          className="form-select"
          value={selectedDept}
          onChange={(e) => setSelectedDept(e.target.value)}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Team name"
            value={teamName}
            onChange={(e) => setTeamName(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Team Responsibilities"
            value={responsibilities}
            onChange={(e) => setResponsibilities(e.target.value)}
          />
          <p className="form-text text-muted mt-1">
            Separate responsibilities with commas
          </p>
        </div>

        <button 
          className="btn btn-primary w-100" 
          type="submit" 
          disabled={!selectedDept}
        >
          <FaPlus className="me-2" />
          Add Team
        </button>
      </form>
    </div>
  );
};

export default TeamForm;
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { Department } from "../../../types/department-team.types";

interface TeamFormProps {
  departments: Department[];
  onAddTeam: (departmentId: string, teamName: string) => void;
}

const TeamForm = ({ departments, onAddTeam }: TeamFormProps) => {
  const [selectedDept, setSelectedDept] = useState("");
  const [teamName, setTeamName] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedDept && teamName.trim()) {
      onAddTeam(selectedDept, teamName);
      setTeamName("");
    }
  };

  return (
    <div className="mb-4">
      <h6>Add Team to Department</h6>
      <select
        className="form-select mb-2"
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
      <form onSubmit={handleSubmit} className="input-group">
        <input
          type="text"
          className="form-control"
          placeholder="Team name"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
        />
        <button className="btn btn-primary" type="submit" disabled={!selectedDept}>
          <FaPlus />
        </button>
      </form>
    </div>
  );
};

export default TeamForm;
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import teamService from "../../../services/api-services/team.service";
import departmentTeamService from "../../../services/api-services/department-team.service";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { setDepartments } from "../../../features/department.slice";

const TeamForm = () => {
  const departments =
    useSelector((state: RootState) => state.department.departments) || [];
  const [selectedDept, setSelectedDept] = useState<number | "">("");
  const [teamName, setTeamName] = useState("");
  const [responsibilities, setResponsibilities] = useState("");

  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (selectedDept && teamName.trim()) {
      try {
        const teamResponse = await teamService.createTeam({
          name: teamName,
          responsibilities,
          slug: teamName.toLowerCase().replace(/\s+/g, "-"),
        });
        await departmentTeamService.linkTeamToDepartment(
          Number(selectedDept),
          teamResponse.data.id
        );

        const updatedDepartments = departments.map((dept) => {
          if (dept.id === Number(selectedDept)) {
            return {
              ...dept,
              teams: [...(dept.teams || []), teamResponse.data],
            };
          }
          return dept;
        });

        dispatch(setDepartments(updatedDepartments));

        setTeamName("");
        setResponsibilities("");
        setSelectedDept("");
      } catch (error) {
        console.error("Failed to create team:", error);
      }
    }
  };

  return (
    <div className="mb-4">
      <h6>Add Team to Department</h6>
      <div className="mb-3">
        <select
          className="form-select"
          value={selectedDept}
          onChange={(e) =>
            setSelectedDept(e.target.value === "" ? "" : Number(e.target.value))
          }
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
            required
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

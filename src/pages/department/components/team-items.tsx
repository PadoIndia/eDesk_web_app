import { useState } from "react";
import { FaTrash, FaInfoCircle, FaPlus } from "react-icons/fa";
import { Department, Team } from "../../../types/department-team.types";
import TeamMemberModal from "./add-member-modal";
import departmentTeamService from "../../../services/api-services/department-team.service";
import teamService from "../../../services/api-services/team.service";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../store/store";
import { setDepartments } from "../../../features/department.slice";

interface TeamItemProps {
  department: Department;
  team: Team;
}

const TeamItem = ({ department, team }: TeamItemProps) => {
  const [showModal, setShowModal] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const departments = useSelector(
    (state: RootState) => state.department.departments
  );

  const handleDelete = async () => {
    const departmentId = Number(department.id);
    const teamId = Number(team.id);
    try {
      const teamsResponse = await departmentTeamService.getTeamsByDepartment(
        departmentId
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const link = teamsResponse.data.find((dt: any) => dt.teamId === teamId);

      if (link) {
        await departmentTeamService.unlinkTeam(link.id);

        await teamService.deleteTeam(teamId);

        const updatedDepartments = departments.map((dept) => {
          if (dept.id === departmentId) {
            return {
              ...dept,
              teams: (dept.teams || []).filter((t) => t.id !== teamId),
            };
          }
          return dept;
        });

        dispatch(setDepartments(updatedDepartments));

        console.log("Team deleted and unlinked successfully");
      } else {
        console.error("Team link not found");
      }
    } catch (error) {
      console.error("Failed to delete team:", error);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  return (
    <>
      <div className="col mb-4">
        <div className="card h-100 shadow-sm border-0">
          <div className="card-header bg-light d-flex justify-content-between align-items-center py-3">
            <div className="d-flex flex-column">
              <h5 className="mb-0 fw-semibold text-primary">{team.name}</h5>
              {team.responsibilities && (
                <div className="mt-1 d-flex align-items-center">
                  <div
                    className="position-relative"
                    title={team.responsibilities}
                  >
                    <FaInfoCircle className="text-muted me-1 fs-6" />
                  </div>
                  <small
                    className="text-muted"
                    style={{
                      maxWidth: "100px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                    title={team.responsibilities}
                  >
                    {team.responsibilities}
                  </small>
                </div>
              )}
            </div>
            <button
              className="btn btn-sm rounded-circle badge-rejected"
              onClick={handleDelete}
              title="Delete Team"
            >
              <FaTrash />
            </button>
          </div>

          <div className="card-body pb-2">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <button
                className="btn btn-sm btn-outline-primary d-flex align-items-center"
                title="Manage team members"
                onClick={handleOpenModal}
              >
                <FaPlus className="me-1" /> Manage Members
              </button>
            </div>
          </div>
        </div>
      </div>

      <TeamMemberModal
        department={department}
        team={team}
        isOpen={showModal}
        onClose={handleCloseModal}
      />
    </>
  );
};

export default TeamItem;

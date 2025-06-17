import { FaInfoCircle } from "react-icons/fa";
import TeamList from "./team-list";
import { DepartmentResponse } from "../../../types/department-team.types";

interface DepartmentItemProps {
  department: DepartmentResponse;
}

const DepartmentItem = ({ department }: DepartmentItemProps) => (
  <div className="mb-4 border-bottom pb-4 m-4">
    <div className="d-flex justify-content-between align-items-center mb-3">
      <div>
        <h4 className="mb-1">
          {department.name}
          <span className="badge bg-secondary ms-2">
            {department.teams?.length || 0} teams
          </span>
        </h4>
        {department.responsibilities && (
          <div className="mt-2 mx-5">
            <div className="d-flex align-items-center text-muted">
              <div className="position-relative">
                <FaInfoCircle
                  className="me-2"
                  data-bs-toggle="tooltip"
                  data-bs-placement="top"
                  title={department.responsibilities}
                />
              </div>
              <small
                style={{
                  maxWidth: "200px",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                Responsibilities: {department.responsibilities}
              </small>
            </div>
          </div>
        )}
      </div>
    </div>

    {department.teams && department.teams.length > 0 && (
      <TeamList department={department} />
    )}
  </div>
);

export default DepartmentItem;

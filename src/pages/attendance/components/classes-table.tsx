import { FC } from "react";
import { ClassData } from "../../../types/attendance-dashboard.types";
import { FaChalkboardTeacher } from "react-icons/fa";

type Props = {
  classes: ClassData[];
};

const ClassesTable: FC<Props> = ({ classes }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr className="bg-light">
            <th>Date</th>
            <th>Class Type</th>
            <th>Scheduled Time</th>
            <th>Actual Time</th>
            <th className="text-center">Status</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {classes.length > 0 ? (
            classes.map((cls) => (
              <tr key={cls.id}>
                <td>
                  <div className="fw-bold">{cls.date}</div>
                  <small className="text-muted">
                    {new Date(
                      cls.year,
                      cls.month - 1,
                      cls.date
                    ).toLocaleDateString("en-US", { weekday: "short" })}
                  </small>
                </td>
                <td>
                  <span className="badge bg-info rounded-pill px-3">
                    {cls.classType}
                  </span>
                </td>
                <td>
                  {new Date(cls.startTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}{" "}
                  -
                  {new Date(cls.endTime).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </td>
                <td>
                  {cls.actualStartTime && cls.actualEndTime ? (
                    <>
                      {new Date(cls.actualStartTime).toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit" }
                      )}{" "}
                      -
                      {new Date(cls.actualEndTime).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td className="text-center">
                  <span
                    className={`badge rounded-pill px-3 ${
                      cls.classStatus === "COMPLETED"
                        ? "bg-success"
                        : cls.classStatus === "IN_PROGRESS"
                        ? "bg-warning text-dark"
                        : cls.classStatus.includes("CANCELLED")
                        ? "bg-danger"
                        : "bg-secondary"
                    }`}
                  >
                    {cls.classStatus.replace(/_/g, " ")}
                  </span>
                </td>
                <td>{cls.comment || "—"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-8">
                <div className="text-muted">
                  <FaChalkboardTeacher className="mb-2" size={48} />
                  <p>No class data available</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClassesTable;

import {
  FaCheckCircle,
  FaClipboardList,
  FaExclamationCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { FC } from "react";
import { formatTime } from "../../../utils/helper";
import { PunchData } from "../../../types/attendance-dashboard.types";

type Props = {
  missPunches: PunchData[];
};

const MissPunchesTable: FC<Props> = ({ missPunches }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr className="bg-light">
            <th>Date</th>
            <th>Time</th>
            <th>Reason</th>
            <th className="text-center">Status</th>
            <th>Approved By</th>
            <th>Approved On</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {missPunches.length > 0 ? (
            missPunches
              .sort((a, b) => {
                const dateA = new Date(a.year, a.month - 1, a.date);
                const dateB = new Date(b.year, b.month - 1, b.date);
                return dateB.getTime() - dateA.getTime();
              })
              .map((punch) => (
                <tr key={punch.id}>
                  <td>
                    <div className="fw-bold">{punch.date}</div>
                    <small className="text-muted">
                      {new Date(
                        punch.year,
                        punch.month - 1,
                        punch.date
                      ).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        year: "numeric",
                      })}
                    </small>
                  </td>
                  <td>
                    <span className="badge bg-secondary rounded-pill px-3">
                      {formatTime(punch.hh, punch.mm)}
                    </span>
                  </td>
                  <td>{punch.missPunchReason || "—"}</td>
                  <td className="text-center">
                    {punch.approvedBy ? (
                      punch.isApproved === true ? (
                        <span className="badge bg-success rounded-pill px-3 d-flex align-items-center justify-content-center gap-1">
                          <FaCheckCircle size={12} />
                          Approved
                        </span>
                      ) : (
                        <span className="badge bg-danger rounded-pill px-3 d-flex align-items-center justify-content-center gap-1">
                          <FaTimesCircle size={12} />
                          Rejected
                        </span>
                      )
                    ) : (
                      <span className="badge bg-warning text-dark rounded-pill px-3 d-flex align-items-center justify-content-center gap-1">
                        <FaExclamationCircle size={12} />
                        Pending
                      </span>
                    )}
                  </td>
                  <td>
                    {punch.approvedBy ? (
                      <span className="text-muted">
                        User #{punch.approvedBy}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>
                    {punch.approvedOn ? (
                      <small className="text-muted">
                        {new Date(punch.approvedOn).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </small>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td>{punch.comment || "—"}</td>
                </tr>
              ))
          ) : (
            <tr>
              <td colSpan={7} className="text-center py-8">
                <div className="text-muted">
                  <FaClipboardList className="mb-2" size={48} />
                  <p>No punch requests found</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default MissPunchesTable;

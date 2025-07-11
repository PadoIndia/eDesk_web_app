import { FaPhone } from "react-icons/fa";
import { CallData } from "../../../types/attendance-dashboard.types";
import { FC } from "react";

type Props = {
  calls: CallData[];
};

const CallsTable: FC<Props> = ({ calls }) => {
  return (
    <div className="table-responsive">
      <table className="table table-hover align-middle">
        <thead>
          <tr className="bg-light">
            <th>Date</th>
            <th className="text-center">Incoming Calls</th>
            <th className="text-center">Outgoing Calls</th>
            <th className="text-center">Missed Calls</th>
            <th className="text-center">Total Duration</th>
            <th>Comment</th>
          </tr>
        </thead>
        <tbody>
          {calls.length > 0 ? (
            calls.map((call) => (
              <tr key={call.id}>
                <td>
                  <div className="fw-bold">{call.date}</div>
                  <small className="text-muted">
                    {new Date(
                      call.year,
                      call.month - 1,
                      call.date
                    ).toLocaleDateString("en-US", { weekday: "short" })}
                  </small>
                </td>
                <td className="text-center">
                  <span className="badge bg-success rounded-pill px-3">
                    {call.incomingCalls}
                  </span>
                </td>
                <td className="text-center">
                  <span className="badge bg-primary rounded-pill px-3">
                    {call.outgoingCalls}
                  </span>
                </td>
                <td className="text-center">
                  <span className="badge bg-danger rounded-pill px-3">
                    {call.missedCalls}
                  </span>
                </td>
                <td className="text-center">
                  <span className="fw-semibold">
                    {Math.floor(call.callDuration / 60)}h{" "}
                    {call.callDuration % 60}m
                  </span>
                </td>
                <td>{call.comment || "—"}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="text-center py-8">
                <div className="text-muted">
                  <FaPhone className="mb-2" size={48} />
                  <p>No call data available</p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default CallsTable;

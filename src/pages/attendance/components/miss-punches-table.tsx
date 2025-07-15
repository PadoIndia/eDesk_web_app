import { FaClipboardList } from "react-icons/fa";
import { FC } from "react";
import { formatTime, getLeaveStatusBadge } from "../../../utils/helper";
import { PunchResponse } from "../../../types/punch-data.types";
import { LeaveRequestStatus } from "../../../types/leave.types";
import { Table } from "../../../components/ui/table";

type Props = {
  missPunches: PunchResponse[];
};

const MissPunchesTable: FC<Props> = ({ missPunches }) => {
  return (
    <Table.Container>
      <Table>
        <Table.Head className="bg-light">
          <Table.Row>
            <Table.Header>Date</Table.Header>
            <Table.Header>Time</Table.Header>
            <Table.Header>Reason</Table.Header>
            <Table.Header>Status</Table.Header>
            <Table.Header>Approved By</Table.Header>
            <Table.Header>Approved On</Table.Header>
            <Table.Header>Comment</Table.Header>
          </Table.Row>
        </Table.Head>
        <Table.Body>
          {missPunches.length > 0 ? (
            missPunches
              .sort((a, b) => {
                const dateA = new Date(a.year, a.month - 1, a.date);
                const dateB = new Date(b.year, b.month - 1, b.date);
                return dateB.getTime() - dateA.getTime();
              })
              .map((punch) => (
                <Table.Row key={punch.id}>
                  <Table.Cell>
                    <small className="text-muted">
                      {new Date(
                        punch.year,
                        punch.month - 1,
                        punch.date
                      ).toLocaleDateString("en-GB", {
                        weekday: "short",
                        day: "2-digit",
                        month: "long",
                        year: "numeric",
                      })}
                    </small>
                  </Table.Cell>
                  <Table.Cell>
                    <span className="badge bg-secondary-subtle text-secondary">
                      {formatTime(punch.hh, punch.mm)}
                    </span>
                  </Table.Cell>
                  <Table.Cell>{punch.missPunchReason || "—"}</Table.Cell>
                  <Table.Cell className="text-center">
                    {punch.approvedBy
                      ? punch.isApproved === true
                        ? getLeaveStatusBadge(LeaveRequestStatus.APPROVED)
                        : getLeaveStatusBadge(LeaveRequestStatus.REJECTED)
                      : getLeaveStatusBadge(LeaveRequestStatus.PENDING)}
                  </Table.Cell>
                  <Table.Cell>
                    {punch.approverUser ? (
                      <span className="text-muted">
                        {punch.approverUser.name}
                      </span>
                    ) : (
                      "—"
                    )}
                  </Table.Cell>
                  <Table.Cell>
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
                  </Table.Cell>
                  <Table.Cell>{punch.comment || "—"}</Table.Cell>
                </Table.Row>
              ))
          ) : (
            <Table.Row>
              <Table.Cell colSpan={7} className="text-center py-8">
                <div className="text-muted">
                  <FaClipboardList className="mb-2" size={48} />
                  <p>No punch requests found</p>
                </div>
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table>
    </Table.Container>
  );
};

export default MissPunchesTable;

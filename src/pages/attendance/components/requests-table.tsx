import React from "react";
import { FaClipboardList, FaCheck, FaTimes } from "react-icons/fa";
import { PunchResponse } from "../../../types/punch-data.types";
import { Table } from "../../../components/ui/table";
import { getLeaveStatusBadge } from "../../../utils/helper";
import { LeaveRequestStatus } from "../../../types/leave.types";
import Avatar from "../../../components/avatar";
import { Colors } from "../../../utils/constants";

interface Props {
  filteredRequests: PunchResponse[];
  handleApproveReject: (
    request: PunchResponse,
    action: "approve" | "reject"
  ) => void;
  isAdmin: boolean;
}

const RequestsTable: React.FC<Props> = ({
  filteredRequests,
  handleApproveReject,
  isAdmin,
}) => {
  const formatTime = (hh: number, mm: number) => {
    return `${hh.toString().padStart(2, "0")}:${mm
      .toString()
      .padStart(2, "0")}`;
  };

  return (
    <div
      className="card rounded-lg bg-white"
      style={{ border: "1px solid #f1f1f1" }}
    >
      <div className="card-body px-4">
        <Table.Container>
          <Table className="mb-0">
            <Table.Head className="table-light">
              <Table.Row>
                <Table.Header>EMPLOYEE</Table.Header>
                <Table.Header>DEPARTMENT</Table.Header>
                <Table.Header>DATE</Table.Header>
                <Table.Header>TIME</Table.Header>
                <Table.Header>REASON</Table.Header>
                {isAdmin && <Table.Header>ACTIONS</Table.Header>}
              </Table.Row>
            </Table.Head>
            <Table.Body>
              {filteredRequests.length > 0 ? (
                filteredRequests.map((request, index) => {
                  const requestDate = new Date(
                    request.year,
                    request.month - 1,
                    request.date
                  );
                  const isWeekend =
                    requestDate.getDay() === 0 || requestDate.getDay() === 6;

                  return (
                    <Table.Row
                      key={request.id}
                      className={
                        index % 2 === 0 ? "" : "bg-light bg-opacity-50"
                      }
                    >
                      <Table.Cell className="py-2 ">
                        <div className="d-flex align-items-center py-2">
                          <div>
                            <Avatar
                              fontSize={14}
                              bgColor={Colors.BGColorList[5]}
                              title={request.user.name || ""}
                              imageUrl={request.user.profileImg?.url}
                            />
                          </div>
                          <div className="ms-3">
                            <div className="fw-semibold text-dark">
                              {request.user.name}
                            </div>
                            <small className="text-muted">
                              ID: {request.userId}
                            </small>
                          </div>
                        </div>
                      </Table.Cell>
                      <Table.Cell className="py-2">
                        <span className="badge bg-primary-ultralight text-primary rounded-pill px-3 py-1">
                          {request.department?.name || "Unknown"}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="py-2">
                        <small
                          className={`${
                            isWeekend ? "text-danger fw-semibold" : "text-muted"
                          }`}
                        >
                          {requestDate.toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "2-digit",
                            month: "long",
                            year: "numeric",
                          })}
                        </small>
                      </Table.Cell>
                      <Table.Cell className="py-2">
                        <span className="badge bg-secondary-ultralight text-secondary rounded-pill px-3 py-2">
                          {formatTime(request.hh || 0, request.mm || 0)}
                        </span>
                      </Table.Cell>
                      <Table.Cell className="py-2">
                        <div
                          className="text-truncate"
                          style={{ maxWidth: "250px" }}
                          title={
                            request.missPunchReason || "No reason provided"
                          }
                        >
                          {request.missPunchReason ? (
                            <span>{request.missPunchReason}</span>
                          ) : (
                            <span className="text-muted fst-italic">
                              No reason provided
                            </span>
                          )}
                        </div>
                      </Table.Cell>
                      {isAdmin && (
                        <Table.Cell className="py-2">
                          {request.approvedBy === null ? (
                            <div className="d-flex gap-2">
                              <button
                                className="btn btn-sm btn-success rounded-md d-flex align-items-center gap-1"
                                onClick={() =>
                                  handleApproveReject(request, "approve")
                                }
                                title="Approve"
                              >
                                <FaCheck />
                                Approve
                              </button>
                              <button
                                className="btn btn-sm btn-danger text-light rounded-md d-flex align-items-center gap-1"
                                onClick={() =>
                                  handleApproveReject(request, "reject")
                                }
                                title="Reject"
                              >
                                <FaTimes />
                                Reject
                              </button>
                            </div>
                          ) : request.isApproved ? (
                            getLeaveStatusBadge(LeaveRequestStatus.APPROVED)
                          ) : (
                            getLeaveStatusBadge(LeaveRequestStatus.REJECTED)
                          )}
                        </Table.Cell>
                      )}
                    </Table.Row>
                  );
                })
              ) : (
                <Table.Row>
                  <Table.Cell
                    colSpan={isAdmin ? 7 : 6}
                    className="text-center py-5"
                  >
                    <div className="text-muted">
                      <FaClipboardList className="mb-3 opacity-50" size={48} />
                      <p className="mb-0 fs-5">No punch requests found</p>
                      <small>
                        All requests have been processed or there are no new
                        requests
                      </small>
                    </div>
                  </Table.Cell>
                </Table.Row>
              )}
            </Table.Body>
          </Table>
        </Table.Container>
      </div>
    </div>
  );
};

export default RequestsTable;

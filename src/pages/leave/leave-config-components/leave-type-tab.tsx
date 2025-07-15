import React from "react";
import { FaPlus, FaTrash, FaInfoCircle } from "react-icons/fa";
import { LeaveTypeResponse } from "../../../types/leave.types";
import { Table } from "../../../components/ui/table";
import { FaPencil } from "react-icons/fa6";
import { IoCheckmarkCircle } from "react-icons/io5";
import { RiCloseCircleFill } from "react-icons/ri";

interface Props {
  leaveTypes: LeaveTypeResponse[];
  loading: boolean;
  onAddType: () => void;
  onEditType: (type: LeaveTypeResponse) => void;
  onDeleteType: (id: number) => void;
}

const LeaveTypesTab: React.FC<Props> = ({
  leaveTypes,
  loading,
  onAddType,
  onEditType,
  onDeleteType,
}) => {
  return (
    <div className="tab-pane fade show active">
      <div className="card border-0">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Leave Types</h2>
          <button className="btn btn-primary btn-sm" onClick={onAddType}>
            <FaPlus className="me-1" /> Add Leave Type
          </button>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : leaveTypes.length === 0 ? (
            <div className="text-center p-5 text-muted">
              <FaInfoCircle size={48} className="mb-3" />
              <h4>No leave types configured</h4>
              <p>Click the "Add Leave Type" button to get started</p>
            </div>
          ) : (
            <Table.Container>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>NAME</Table.Header>
                    <Table.Header>TYPE</Table.Header>
                    <Table.Header>DESCRIPTION</Table.Header>
                    <Table.Header>ACTIONS</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {leaveTypes.map((type) => (
                    <Table.Row key={type.id}>
                      <Table.Cell>{type.name}</Table.Cell>
                      <Table.Cell>
                        {type.isPaid ? (
                          <span
                            style={{ width: "60px" }}
                            className="ms-2 badge bg-success-ultralight text-dark d-flex align-items-center gap-1"
                          >
                            <div>
                              <IoCheckmarkCircle
                                size={14}
                                className="text-success opacity-75"
                              />
                            </div>
                            Paid
                          </span>
                        ) : (
                          <span
                            style={{ width: "70px" }}
                            className="ms-2 badge bg-danger-ultralight text-dark d-flex align-items-center gap-1"
                          >
                            <div>
                              <RiCloseCircleFill
                                size={14}
                                className="text-danger opacity-75"
                              />
                            </div>
                            Unpaid
                          </span>
                        )}
                      </Table.Cell>
                      <Table.Cell>
                        <small className="text-muted">
                          {type.description || "N/A"}
                        </small>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => onEditType(type)}
                            className="btn btn-sm btn-outline-primary border-primary px-3 rounded-md d-flex align-items-center"
                          >
                            <FaPencil className="me-2" />
                            Edit
                          </button>

                          <button
                            onClick={() => onDeleteType(type.id)}
                            className="btn btn-sm btn-outline-danger border-danger px-3 rounded-md d-flex align-items-center"
                          >
                            <FaTrash className="me-2" />
                            Edit
                          </button>
                        </div>
                      </Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
            </Table.Container>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveTypesTab;

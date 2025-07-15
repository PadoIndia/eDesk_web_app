import React from "react";
import { FaPlus, FaTrash, FaInfoCircle, FaCog } from "react-icons/fa";
import { LeaveScheme } from "../../../types/leave.types";
import { FaPencil } from "react-icons/fa6";
import { Table } from "../../../components/ui/table";

interface Props {
  schemes: LeaveScheme[];
  loading: boolean;
  onAddScheme: () => void;
  onEditScheme: (scheme: LeaveScheme) => void;
  onDeleteScheme: (id: number) => void;
  onConfigureScheme: (schemeId: number) => void;
}

const LeaveSchemesTab: React.FC<Props> = ({
  schemes,
  loading,
  onAddScheme,
  onEditScheme,
  onDeleteScheme,
  onConfigureScheme,
}) => {
  return (
    <div className="tab-pane fade show active">
      <div className="card border-0">
        <div className="card-header bg-white d-flex justify-content-between align-items-center">
          <h2 className="mb-0">Leave Schemes</h2>
          <button className="btn btn-primary btn-sm" onClick={onAddScheme}>
            <FaPlus className="me-1" /> Add Scheme
          </button>
        </div>

        <div className="card-body">
          {loading ? (
            <div className="d-flex justify-content-center p-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : schemes.length === 0 ? (
            <div className="text-center p-5 text-muted">
              <FaInfoCircle size={48} className="mb-3" />
              <h4>No leave schemes configured</h4>
              <p>Click the "Add Scheme" button to get started</p>
            </div>
          ) : (
            <Table.Container>
              <Table>
                <Table.Head>
                  <Table.Row>
                    <Table.Header>NAME</Table.Header>
                    <Table.Header>DESCRIPTION</Table.Header>
                    <Table.Header>SLUG</Table.Header>
                    <Table.Header>LEAVE TYPES</Table.Header>
                    <Table.Header>USERS</Table.Header>
                    <Table.Header>ACTIONS</Table.Header>
                  </Table.Row>
                </Table.Head>
                <Table.Body>
                  {schemes.map((scheme) => (
                    <Table.Row key={scheme.id}>
                      <Table.Cell>{scheme.name}</Table.Cell>
                      <Table.Cell>
                        <small className="text-muted">
                          {scheme.description || "N/A"}
                        </small>
                      </Table.Cell>
                      <Table.Cell>
                        <code>{scheme.slug}</code>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="badge bg-light text-dark">
                          {scheme.leaveTypesCount}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <span className="badge bg-light text-dark">
                          {scheme.usersCount}
                        </span>
                      </Table.Cell>
                      <Table.Cell>
                        <div className="d-flex gap-2">
                          <button
                            onClick={() => onEditScheme(scheme)}
                            className="btn btn-sm btn-outline-primary border-primary px-3 rounded-md d-flex align-items-center"
                          >
                            <FaPencil className="me-2" />
                            Edit
                          </button>

                          <button
                            onClick={() => onDeleteScheme(scheme.id)}
                            className="btn btn-sm btn-outline-danger border-danger px-3 rounded-md d-flex align-items-center"
                          >
                            <FaTrash className="me-2" />
                            Delete
                          </button>
                          <button
                            onClick={() => onConfigureScheme(scheme.id)}
                            className="btn btn-sm btn-outline-info border-info px-3 rounded-md d-flex align-items-center"
                          >
                            <FaCog className="me-2" />
                            Configure
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

export default LeaveSchemesTab;

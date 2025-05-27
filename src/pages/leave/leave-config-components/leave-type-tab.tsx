import React from "react";
import { FaPlus, FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import { LeaveType } from "../../../types/leave.types";
import Badge from "../../../components/badge";

interface LeaveTypesTabProps {
  leaveTypes: LeaveType[];
  loading: boolean;
  onAddType: () => void;
  onEditType: (type: LeaveType) => void;
  onDeleteType: (id: number) => void;
}

const LeaveTypesTab: React.FC<LeaveTypesTabProps> = ({
  leaveTypes,
  loading,
  onAddType,
  onEditType,
  onDeleteType,
}) => {
  return (
    <div className="tab-pane fade show active">
      <div className="card">
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
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Description</th>
                    <th>Schemes</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveTypes.map((type) => (
                    <tr key={type.id}>
                      <td>{type.name}</td>
                      <td>
                        <Badge
                          label={type.isPaid ? "Paid" : "Unpaid"}
                          status={type.isPaid ? "SUCCESS" : "DANGER"}
                        />
                      </td>
                      <td>
                        <small className="text-muted">
                          {type.description || "N/A"}
                        </small>
                      </td>
                      <td>
                        <Badge
                          label={(type.schemesCount || 0).toString()}
                          status="INFO"
                          className="ms-2"
                        />
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEditType(type)}
                            aria-label={`Edit ${type.name}`}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDeleteType(type.id)}
                            aria-label={`Delete ${type.name}`}
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeaveTypesTab;

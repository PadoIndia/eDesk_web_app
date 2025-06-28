import React from "react";
import { FaPlus, FaEdit, FaTrash, FaInfoCircle } from "react-icons/fa";
import { LeaveScheme } from "../../../types/leave.types";

interface LeaveSchemesTabProps {
  schemes: LeaveScheme[];
  loading: boolean;
  onAddScheme: () => void;
  onEditScheme: (scheme: LeaveScheme) => void;
  onDeleteScheme: (id: number) => void;
  onConfigureScheme: (schemeId: number) => void;
}

const LeaveSchemesTab: React.FC<LeaveSchemesTabProps> = ({
  schemes,
  loading,
  onAddScheme,
  onEditScheme,
  onDeleteScheme,
  onConfigureScheme,
}) => {
  return (
    <div className="tab-pane fade show active">
      <div className="card">
        <div className="card-header bg-light d-flex justify-content-between align-items-center">
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
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Slug</th>
                    <th>Leave Types</th>
                    <th>Users</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {schemes.map((scheme) => (
                    <tr key={scheme.id}>
                      <td>{scheme.name}</td>
                      <td>
                        <small className="text-muted">
                          {scheme.description || "N/A"}
                        </small>
                      </td>
                      <td>
                        <code>{scheme.slug}</code>
                      </td>
                      <td>
                        <span>{scheme.leaveTypesCount}</span>
                      </td>
                      <td>
                        <span>{scheme.usersCount}</span>
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => onEditScheme(scheme)}
                            aria-label={`Edit ${scheme.name}`}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => onDeleteScheme(scheme.id)}
                            aria-label={`Delete ${scheme.name}`}
                          >
                            <FaTrash />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => onConfigureScheme(scheme.id)}
                            aria-label={`Configure ${scheme.name}`}
                          >
                            Configure
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

export default LeaveSchemesTab;

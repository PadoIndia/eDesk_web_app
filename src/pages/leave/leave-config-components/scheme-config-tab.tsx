import React from "react";
import { FaSave, FaPlus, FaTrash, FaLink } from "react-icons/fa";
import {
  LeaveScheme,
  LeaveTypeResponse,
  LeaveTypeScheme,
  IsEarned,
} from "../../../types/leave.types";
import Badge from "../../../components/badge";

interface SchemeConfigurationTabProps {
  schemes: LeaveScheme[];
  schemeId: number | null;
  currentConfigs: LeaveTypeScheme[];
  availableLeaveTypes: LeaveTypeResponse[];
  showAddForm: boolean;
  newConfig: {
    leaveTypeId: number;
    maxCarryForward: number;
    allowedAfterMonths: number;
    isEarned: IsEarned;
  };
  loading: boolean;
  onSelectScheme: (schemeId: number) => void;
  onSaveAll: () => void;
  onShowAddForm: () => void;
  onHideAddForm: () => void;
  onAddConfig: () => void;
  onRemoveConfig: (id: number) => void;
  onUpdateConfigCarryForward: (
    configId: number,
    maxCarryForward: number
  ) => void;
  onUpdateConfigAllowedAfterMonths: (
    configId: number,
    allowedAfterMonths?: number
  ) => void;
  onUpdateConfigIsEarned: (configId: number, isEarned: IsEarned) => void;
  onUpdateNewConfig: (config: {
    leaveTypeId: number;
    maxCarryForward: number;
    allowedAfterMonths: number;
    isEarned: IsEarned;
  }) => void;
}

const SchemeConfigurationTab: React.FC<SchemeConfigurationTabProps> = ({
  schemes,
  schemeId,
  currentConfigs,
  availableLeaveTypes,
  showAddForm,
  newConfig,
  loading,
  onSelectScheme,
  onSaveAll,
  onShowAddForm,
  onHideAddForm,
  onAddConfig,
  onRemoveConfig,
  onUpdateConfigCarryForward,
  onUpdateConfigAllowedAfterMonths,
  onUpdateConfigIsEarned,
  onUpdateNewConfig,
}) => {
  const currentSchemeConfig = schemes.find((s) => s.id === schemeId);

  // Handle empty states and loading
  if (loading) {
    return (
      <div className="d-flex justify-content-center p-5">
        <div className="d-flex justify-content-center p-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-pane fade show active">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Leave Scheme Configuration</h2>
          {currentSchemeConfig && (
            <p className="text-muted mb-0">
              Configuring: {currentSchemeConfig.name}
            </p>
          )}
        </div>
        <button
          className="btn btn-primary"
          onClick={onSaveAll}
          disabled={!currentConfigs.length}
        >
          <FaSave className="me-1" /> Save Configuration
        </button>
      </div>

      <div className="row">
        <div className="col-md-3 mb-3 mb-md-0">
          <div className="card">
            <div className="card-header bg-light">Available Schemes</div>
            <div className="list-group list-group-flush">
              {schemes.map((scheme) => (
                <button
                  key={scheme.id}
                  className={`list-group-item list-group-item-action d-flex justify-content-between ${
                    schemeId === scheme.id ? "active" : ""
                  }`}
                  onClick={() => onSelectScheme(scheme.id)}
                >
                  <span className="fw-medium">{scheme.name}</span>
                  <Badge
                    label={scheme.leaveTypesCount?.toString() || "0"}
                    status="INFO"
                    className="ms-2"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="col-md-9">
          <div className="card h-100">
            <div className="card-body">
              {!currentSchemeConfig ? (
                <div className="text-center p-4">
                  <p className="text-muted">
                    Please select a leave scheme from the list
                  </p>
                </div>
              ) : (
                <>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h4 className="mb-0">Configured Leave Types</h4>
                    {!showAddForm && availableLeaveTypes.length > 0 && (
                      <button
                        className="btn btn-outline-primary btn-sm"
                        onClick={onShowAddForm}
                      >
                        <FaPlus className="me-1" /> Add Leave Type
                      </button>
                    )}
                  </div>

                  {currentConfigs.length === 0 ? (
                    <div className="alert alert-info mb-0">
                      No leave types configured for this scheme
                    </div>
                  ) : (
                    <div className="table-responsive">
                      <table className="table table-hover align-middle">
                        <thead className="table-light">
                          <tr>
                            <th>Leave Type</th>
                            <th>Type</th>
                            <th>Max Carry Forward</th>
                            <th>Allowed After (Months)</th>
                            <th>Is Earned</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentConfigs.map((config) => (
                            <tr key={config.id}>
                              <td>{config.leaveType?.name || "Unknown"}</td>
                              <td>
                                <Badge
                                  label={
                                    config.leaveType?.isPaid ? "Paid" : "Unpaid"
                                  }
                                  status={
                                    config.leaveType?.isPaid
                                      ? "SUCCESS"
                                      : "DANGER"
                                  }
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={config.maxCarryForward}
                                  onChange={(e) =>
                                    onUpdateConfigCarryForward(
                                      config.id,
                                      Number(e.target.value)
                                    )
                                  }
                                  min="0"
                                  step="0.5"
                                  aria-label="Max carry forward"
                                />
                              </td>
                              <td>
                                <input
                                  type="number"
                                  className="form-control form-control-sm"
                                  value={config.allowedAfterMonths || ""}
                                  onChange={(e) =>
                                    onUpdateConfigAllowedAfterMonths(
                                      config.id,
                                      e.target.value
                                        ? Number(e.target.value)
                                        : undefined
                                    )
                                  }
                                  min="0"
                                  placeholder="N/A"
                                  aria-label="Allowed after months"
                                />
                              </td>
                              <td>
                                <select
                                  className="form-select form-select-sm"
                                  value={config.isEarned}
                                  onChange={(e) =>
                                    onUpdateConfigIsEarned(
                                      config.id,
                                      e.target.value as IsEarned
                                    )
                                  }
                                  aria-label="Is earned"
                                >
                                  <option value={IsEarned.YES}>Yes</option>
                                  <option value={IsEarned.NO}>No</option>
                                </select>
                              </td>
                              <td>
                                <button
                                  className="btn btn-sm btn-outline-danger"
                                  onClick={() => onRemoveConfig(config.id)}
                                  aria-label="Remove configuration"
                                >
                                  <FaTrash />
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}

                  {showAddForm && (
                    <div className="mt-4 pt-4 border-top">
                      <h5 className="mb-3">Add New Leave Type Configuration</h5>
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">Leave Type</label>
                          <select
                            className="form-select"
                            value={newConfig.leaveTypeId}
                            onChange={(e) =>
                              onUpdateNewConfig({
                                ...newConfig,
                                leaveTypeId: Number(e.target.value),
                              })
                            }
                            aria-label="Select leave type"
                          >
                            <option value="">Select leave type</option>
                            {availableLeaveTypes.map((lt) => (
                              <option key={lt.id} value={lt.id}>
                                {lt.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="col-md-3">
                          <label className="form-label">
                            Max Carry Forward
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={newConfig.maxCarryForward}
                            onChange={(e) =>
                              onUpdateNewConfig({
                                ...newConfig,
                                maxCarryForward: Number(e.target.value),
                              })
                            }
                            min="0"
                            step="0.5"
                            aria-label="Max carry forward"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label">
                            Allowed After (Months)
                          </label>
                          <input
                            type="number"
                            className="form-control"
                            value={newConfig.allowedAfterMonths || ""}
                            onChange={(e) =>
                              onUpdateNewConfig({
                                ...newConfig,
                                allowedAfterMonths: e.target.value
                                  ? Number(e.target.value)
                                  : 0,
                              })
                            }
                            min="0"
                            placeholder="Optional"
                            aria-label="Allowed after months"
                          />
                        </div>

                        <div className="col-md-2">
                          <label className="form-label">Is Earned</label>
                          <select
                            className="form-select"
                            value={newConfig.isEarned}
                            onChange={(e) =>
                              onUpdateNewConfig({
                                ...newConfig,
                                isEarned: e.target.value as IsEarned,
                              })
                            }
                            aria-label="Is earned"
                          >
                            <option value={IsEarned.YES}>Yes</option>
                            <option value={IsEarned.NO}>No</option>
                          </select>
                        </div>

                        <div className="col-12 d-flex gap-2 justify-content-end">
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={onAddConfig}
                            disabled={!newConfig.leaveTypeId}
                          >
                            <FaLink className="me-1" /> Add Configuration
                          </button>
                          <button
                            type="button"
                            className="btn btn-outline-secondary"
                            onClick={onHideAddForm}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SchemeConfigurationTab;

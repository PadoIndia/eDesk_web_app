import React, { useState, useEffect } from "react";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaInfoCircle,
  FaLink,
  FaSave,
  FaUnlink,
} from "react-icons/fa";
import "../../App.css";
import Badge from "../../components/badge";

// Define interfaces for all our data types
interface LeaveType {
  id: number;
  name: string;
  isPaid: boolean;
  description: string;
  schemesCount: number;
}

interface LeaveScheme {
  id: number;
  name: string;
  description: string;
  slug: string;
  leaveTypesCount: number;
  usersCount: number;
}

interface LeaveTypeScheme {
  id: number;
  leaveSchemeId: number;
  leaveTypeId: number;
  maxCarryForward: number;
  leaveType: LeaveType;
}

const LeaveConfiguration = () => {
  // State for LeaveTypes component
  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [showTypeModal, setShowTypeModal] = useState(false);
  const [currentType, setCurrentType] = useState<LeaveType | null>(null);

  // State for LeaveSchemes component
  const [schemes, setSchemes] = useState<LeaveScheme[]>([]);
  const [showSchemeModal, setShowSchemeModal] = useState(false);
  const [currentScheme, setCurrentScheme] = useState<LeaveScheme | null>(null);

  // State for SchemeConfiguration component
  const [schemeId, setSchemeId] = useState<number | null>(null);
  const [configurations, setConfigurations] = useState<LeaveTypeScheme[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newConfig, setNewConfig] = useState({
    leaveTypeId: 0,
    maxCarryForward: 0,
  });

  // Shared state
  const [loading, setLoading] = useState(true);

  // Mock data - replace with API calls in a real app
  useEffect(() => {
    const mockLeaveTypes: LeaveType[] = [
      {
        id: 1,
        name: "Annual Leave",
        isPaid: true,
        description: "Paid time off for vacations and personal matters",
        schemesCount: 3,
      },
      {
        id: 2,
        name: "Sick Leave",
        isPaid: true,
        description: "Leave for medical reasons and illness recovery",
        schemesCount: 2,
      },
      {
        id: 3,
        name: "Maternity Leave",
        isPaid: true,
        description: "Leave for expecting mothers before and after childbirth",
        schemesCount: 1,
      },
      {
        id: 4,
        name: "Unpaid Leave",
        isPaid: false,
        description: "Leave without pay for special circumstances",
        schemesCount: 2,
      },
    ];

    const mockSchemes: LeaveScheme[] = [
      {
        id: 1,
        name: "Standard Employee Scheme",
        description: "Standard leave scheme for regular employees",
        slug: "standard-employee",
        leaveTypesCount: 4,
        usersCount: 45,
      },
      {
        id: 2,
        name: "Executive Scheme",
        description: "Enhanced leave scheme for executives",
        slug: "executive",
        leaveTypesCount: 5,
        usersCount: 12,
      },
    ];

    const mockConfigurations: LeaveTypeScheme[] = [
      {
        id: 1,
        leaveSchemeId: 1,
        leaveTypeId: 1,
        maxCarryForward: 10,
        leaveType: mockLeaveTypes[0],
      },
      {
        id: 2,
        leaveSchemeId: 1,
        leaveTypeId: 2,
        maxCarryForward: 5,
        leaveType: mockLeaveTypes[1],
      },
      {
        id: 3,
        leaveSchemeId: 2,
        leaveTypeId: 1,
        maxCarryForward: 15,
        leaveType: mockLeaveTypes[0],
      },
    ];

    setTimeout(() => {
      setLeaveTypes(mockLeaveTypes);
      setSchemes(mockSchemes);
      setConfigurations(mockConfigurations);
      setSchemeId(1); // Default to first scheme
      setLoading(false);
    }, 800);
  }, []);

  // LeaveTypes component handlers
  const handleAddType = () => {
    setCurrentType(null);
    setShowTypeModal(true);
  };

  const handleEditType = (type: LeaveType) => {
    setCurrentType(type);
    setShowTypeModal(true);
  };

  const handleDeleteType = (id: number) => {
    if (window.confirm("Are you sure you want to delete this leave type?")) {
      setLeaveTypes(leaveTypes.filter((type) => type.id !== id));
      // In a real app, you would call an API here
    }
  };

  const handleSaveType = (type: LeaveType) => {
    if (type.id) {
      // Update existing
      setLeaveTypes(leaveTypes.map((t) => (t.id === type.id ? type : t)));
    } else {
      // Add new
      const newId = Math.max(...leaveTypes.map((t) => t.id), 0) + 1;
      setLeaveTypes([...leaveTypes, { ...type, id: newId, schemesCount: 0 }]);
    }
    setShowTypeModal(false);
  };

  // LeaveSchemes component handlers
  const handleAddScheme = () => {
    setCurrentScheme(null);
    setShowSchemeModal(true);
  };

  const handleEditScheme = (scheme: LeaveScheme) => {
    setCurrentScheme(scheme);
    setShowSchemeModal(true);
  };

  const handleDeleteScheme = (id: number) => {
    if (window.confirm("Are you sure you want to delete this leave scheme?")) {
      setSchemes(schemes.filter((scheme) => scheme.id !== id));
      // In a real app, you would call an API here
    }
  };

  const handleSaveScheme = (scheme: LeaveScheme) => {
    if (scheme.id) {
      // Update existing
      setSchemes(schemes.map((s) => (s.id === scheme.id ? scheme : s)));
    } else {
      // Add new
      const newId = Math.max(...schemes.map((s) => s.id), 0) + 1;
      setSchemes([
        ...schemes,
        {
          ...scheme,
          id: newId,
          leaveTypesCount: 0,
          usersCount: 0,
        },
      ]);
    }
    setShowSchemeModal(false);
  };

  // SchemeConfiguration component handlers
  const currentSchemeConfig = schemes.find((s) => s.id === schemeId);
  const currentConfigs = configurations.filter(
    (c) => c.leaveSchemeId === schemeId
  );

  const availableLeaveTypes = leaveTypes.filter(
    (lt) => !currentConfigs.some((c) => c.leaveTypeId === lt.id)
  );

  const handleAddConfig = () => {
    if (!newConfig.leaveTypeId) {
      alert("Please select a leave type");
      return;
    }

    const selectedType = leaveTypes.find(
      (lt) => lt.id === newConfig.leaveTypeId
    );

    if (!selectedType) {
      alert("Invalid leave type selected");
      return;
    }

    const newId = Math.max(...configurations.map((c) => c.id), 0) + 1;

    setConfigurations([
      ...configurations,
      {
        id: newId,
        leaveSchemeId: schemeId || 0,
        leaveTypeId: newConfig.leaveTypeId,
        maxCarryForward: newConfig.maxCarryForward,
        leaveType: selectedType,
      },
    ]);

    setNewConfig({
      leaveTypeId: 0,
      maxCarryForward: 0,
    });

    setShowAddForm(false);
  };

  const handleRemoveConfig = (id: number) => {
    if (
      window.confirm(
        "Are you sure you want to remove this leave type from the scheme?"
      )
    ) {
      setConfigurations(configurations.filter((c) => c.id !== id));
    }
  };

  const handleSaveAll = () => {
    // In a real app, you would send the updated configurations to your API
    alert("Configuration saved successfully!");
  };

  return (
    <div className="container py-4">
      <h1 className="mb-4">Leave Configuration</h1>

      <ul className="nav nav-tabs" id="leaveConfigTabs" role="tablist">
        <li className="nav-item" role="presentation">
          <button
            className="nav-link active"
            id="leave-types-tab"
            data-bs-toggle="tab"
            data-bs-target="#leave-types"
            type="button"
            role="tab"
            aria-controls="leave-types"
            aria-selected="true"
          >
            Leave Types
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="leave-schemes-tab"
            data-bs-toggle="tab"
            data-bs-target="#leave-schemes"
            type="button"
            role="tab"
            aria-controls="leave-schemes"
            aria-selected="false"
          >
            Leave Schemes
          </button>
        </li>
        <li className="nav-item" role="presentation">
          <button
            className="nav-link"
            id="scheme-config-tab"
            data-bs-toggle="tab"
            data-bs-target="#scheme-config"
            type="button"
            role="tab"
            aria-controls="scheme-config"
            aria-selected="false"
          >
            Scheme Configuration
          </button>
        </li>
      </ul>

      <div
        className="tab-content p-3 border border-top-0 rounded-bottom"
        id="leaveConfigTabsContent"
      >
        {/* Leave Types Tab */}
        <div
          className="tab-pane fade show active"
          id="leave-types"
          role="tabpanel"
          aria-labelledby="leave-types-tab"
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Leave Types</h2>
            <button className="btn btn-primary" onClick={handleAddType}>
              <FaPlus className="me-1" /> Add Leave Type
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : leaveTypes.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaInfoCircle size={48} className="mb-3" />
              <h4>No leave types configured</h4>
              <p>Click the "Add Leave Type" button to get started</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
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
                        <Badge label={type.isPaid?"Paid":"Unpaid"} status={type.isPaid?"SUCCESS":"DANGER"} />
                      </td>
                      <td>
                        <small className="text-muted">{type.description}</small>
                      </td>
                      <td>
                        <Badge label={type.schemesCount.toString()} status="INFO" className="Badge mx-3 px-3"  />
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditType(type)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteType(type.id)}
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

        {/* Leave Schemes Tab */}
        <div
          className="tab-pane fade"
          id="leave-schemes"
          role="tabpanel"
          aria-labelledby="leave-schemes-tab"
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Leave Schemes</h2>
            <button className="btn btn-primary" onClick={handleAddScheme}>
              <FaPlus className="me-1" /> Add Scheme
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : schemes.length === 0 ? (
            <div className="text-center py-5 text-muted">
              <FaInfoCircle size={48} className="mb-3" />
              <h4>No leave schemes configured</h4>
              <p>Click the "Add Scheme" button to get started</p>
            </div>
          ) : (
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
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
                          {scheme.description}
                        </small>
                      </td>
                      <td>
                        <code>{scheme.slug}</code>
                      </td>
                      <td>
                        <Badge  label={scheme.leaveTypesCount.toString()} status="INFO" className="Badge mx-3 px-3"  />
                      </td>
                      <td>
                        <Badge label={scheme.usersCount.toString()} status="WARNING" className="mx-2 px-2" />
                      </td>
                      <td>
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-primary"
                            onClick={() => handleEditScheme(scheme)}
                          >
                            <FaEdit />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            title="Configure Leave Types"
                            onClick={() => setSchemeId(scheme.id)}
                          >
                            <FaLink />
                          </button>
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteScheme(scheme.id)}
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

        {/* Scheme Configuration Tab */}
        <div
          className="tab-pane fade"
          id="scheme-config"
          role="tabpanel"
          aria-labelledby="scheme-config-tab"
        >
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2>Leave Scheme Configuration</h2>
            <button className="btn btn-primary" onClick={handleSaveAll}>
              <FaSave className="me-1" /> Save Configuration
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : (
            <div className="row">
              {/* Sidebar Column */}
              <div className="col-md-3 mb-3 mb-md-0">
                <div className="list-group sticky-top" style={{ top: "1rem" }}>
                  {schemes.map((scheme) => {
                    const isActive = schemeId === scheme.id;
                    return (
                      <button
                        key={scheme.id}
                        className={`list-group-item list-group-item-action ${
                          isActive ? "badge-cancelled" : ""
                        }`}
                        onClick={() => setSchemeId(scheme.id)}
                      >
                        {scheme.name}
                        <small className="d-block text-truncate">
                          {scheme.slug}
                        </small>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Content Column */}
              <div className="col-md-9">
                <div className="ps-md-3">
                  {currentSchemeConfig ? (
                    <>
                      <h3>{currentSchemeConfig.name} Configuration</h3>
                      <p className="text-muted">
                        Configure which leave types are available in this scheme
                      </p>

                      {currentConfigs.length > 0 ? (
                        <div className="table-responsive">
                          <table className="table table-hover">
                            <thead>
                              <tr>
                                <th>Leave Type</th>
                                <th>Type</th>
                                <th>Max Carry Forward</th>
                                <th>Actions</th>
                              </tr>
                            </thead>
                            <tbody>
                              {currentConfigs.map((config) => (
                                <tr key={config.id}>
                                  <td>{config.leaveType.name}</td>
                                  <td>
                                    <Badge label={config.leaveType.isPaid?"Paid":"Unpaid"} status={config.leaveType.isPaid?"SUCCESS":"DANGER"} />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      className="form-control form-control-sm"
                                      value={config.maxCarryForward}
                                      onChange={(e) => {
                                        const updated = configurations.map(
                                          (c) =>
                                            c.id === config.id
                                              ? {
                                                  ...c,
                                                  maxCarryForward: Number(
                                                    e.target.value
                                                  ),
                                                }
                                              : c
                                        );
                                        setConfigurations(updated);
                                      }}
                                      min="0"
                                      step="0.5"
                                    />
                                  </td>
                                  <td>
                                    <button
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() =>
                                        handleRemoveConfig(config.id)
                                      }
                                    >
                                      <FaTrash />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      ) : (
                        <div className="alert alert-info">
                          No leave types configured for this scheme
                        </div>
                      )}

                      {showAddForm ? (
                        <div className="card mt-4">
                          <div className="card-body">
                            <h5 className="card-title">
                              Add Leave Type to Scheme
                            </h5>

                            <div className="row g-3">
                              <div className="col-md-6">
                                <label className="form-label">Leave Type</label>
                                <select
                                  className="form-select"
                                  value={newConfig.leaveTypeId}
                                  onChange={(e) =>
                                    setNewConfig({
                                      ...newConfig,
                                      leaveTypeId: Number(e.target.value),
                                    })
                                  }
                                >
                                  <option value="0">Select leave type</option>
                                  {availableLeaveTypes.map((lt) => (
                                    <option key={lt.id} value={lt.id}>
                                      {lt.name}
                                    </option>
                                  ))}
                                </select>
                              </div>

                              <div className="col-md-4">
                                <label className="form-label">
                                  Max Carry Forward (Days)
                                </label>
                                <input
                                  type="number"
                                  className="form-control"
                                  value={newConfig.maxCarryForward}
                                  onChange={(e) =>
                                    setNewConfig({
                                      ...newConfig,
                                      maxCarryForward: Number(e.target.value),
                                    })
                                  }
                                  min="0"
                                  step="0.5"
                                />
                              </div>

                              <div className="col-md-2 d-flex align-items-end gap-2">
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  onClick={handleAddConfig}
                                >
                                  <FaLink /> Add
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-outline-secondary"
                                  onClick={() => setShowAddForm(false)}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ) : availableLeaveTypes.length > 0 ? (
                        <button
                          className="btn btn-outline-primary mt-3"
                          onClick={() => setShowAddForm(true)}
                        >
                          <FaPlus className="me-1" /> Add Leave Type
                        </button>
                      ) : (
                        <div className="alert alert-warning mt-3">
                          All available leave types have been added to this
                          scheme
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="alert alert-info">
                      Please select a leave scheme from the list
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modals remain the same */}
      {showTypeModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentType ? "Edit Leave Type" : "Add New Leave Type"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowTypeModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <LeaveTypeForm
                  type={currentType}
                  onSave={handleSaveType}
                  onCancel={() => setShowTypeModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {showSchemeModal && (
        <div
          className="modal fade show"
          style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {currentScheme ? "Edit Leave Scheme" : "Add New Leave Scheme"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSchemeModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <LeaveSchemeForm
                  scheme={currentScheme}
                  onSave={handleSaveScheme}
                  onCancel={() => setShowSchemeModal(false)}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Leave Type Form Component
interface LeaveTypeFormProps {
  type: LeaveType | null;
  onSave: (type: LeaveType) => void;
  onCancel: () => void;
}

const LeaveTypeForm: React.FC<LeaveTypeFormProps> = ({
  type,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(type?.name || "");
  const [isPaid, setIsPaid] = useState<boolean>(type?.isPaid || true);
  const [description, setDescription] = useState(type?.description || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Leave type name is required");
      return;
    }

    const updatedType: LeaveType = {
      id: type?.id || 0,
      name,
      isPaid,
      description,
      schemesCount: type?.schemesCount || 0,
    };

    onSave(updatedType);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Leave Type Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Leave Type</label>
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            id="paidLeave"
            checked={isPaid}
            onChange={() => setIsPaid(true)}
          />
          <label className="form-check-label" htmlFor="paidLeave">
            Paid Leave
          </label>
        </div>
        <div className="form-check">
          <input
            type="radio"
            className="form-check-input"
            id="unpaidLeave"
            checked={!isPaid}
            onChange={() => setIsPaid(false)}
          />
          <label className="form-check-label" htmlFor="unpaidLeave">
            Unpaid Leave
          </label>
        </div>
      </div>

      <div className="mb-4">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
};

// Leave Scheme Form Component
interface LeaveSchemeFormProps {
  scheme: LeaveScheme | null;
  onSave: (scheme: LeaveScheme) => void;
  onCancel: () => void;
}

const LeaveSchemeForm: React.FC<LeaveSchemeFormProps> = ({
  scheme,
  onSave,
  onCancel,
}) => {
  const [name, setName] = useState(scheme?.name || "");
  const [description, setDescription] = useState(scheme?.description || "");
  const [slug, setSlug] = useState(scheme?.slug || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      alert("Scheme name is required");
      return;
    }

    if (!slug.trim()) {
      alert("Slug is required");
      return;
    }

    const updatedScheme: LeaveScheme = {
      id: scheme?.id || 0,
      name,
      description,
      slug: slug.toLowerCase().replace(/\s+/g, "-"),
      leaveTypesCount: scheme?.leaveTypesCount || 0,
      usersCount: scheme?.usersCount || 0,
    };

    onSave(updatedScheme);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Scheme Name</label>
        <input
          type="text"
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Slug (URL Identifier)</label>
        <input
          type="text"
          className="form-control"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="e.g., standard-employee"
          required
        />
        <small className="text-muted">
          This will be used in URLs and must be unique
        </small>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default LeaveConfiguration;

// <div className="container py-4">
//   <h1 className="mb-4">Leave Configuration</h1>
//   <div className="row g-4">
//     {/* Leave Types Card */}
//     <div className="col-12">
//       <div className="card">
//         <div className="card-header bg-light d-flex justify-content-between align-items-center">
//           <h2 className="mb-0">Leave Types</h2>
//           <button className="btn btn-primary" onClick={handleAddType}>
//             <FaPlus className="me-1" /> Add Leave Type
//           </button>
//         </div>

//         <div className="card-body">
//           {loading ? (
//             <div className="text-center py-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : leaveTypes.length === 0 ? (
//             <div className="text-center py-5 text-muted">
//               <FaInfoCircle size={48} className="mb-3" />
//               <h4>No leave types configured</h4>
//               <p>Click the "Add Leave Type" button to get started</p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-hover">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Type</th>
//                     <th>Description</th>
//                     <th>Schemes</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {leaveTypes.map((type) => (
//                     <tr key={type.id}>
//                       <td>{type.name}</td>
//                       <td>
//                         <span
//                           className={`badge ${
//                             type.isPaid
//                               ? "badge-approved"
//                               : "badge-rejected"
//                           }`}
//                         >
//                           {type.isPaid ? "Paid" : "Unpaid"}
//                         </span>
//                       </td>
//                       <td>
//                         <small className="text-muted">
//                           {type.description}
//                         </small>
//                       </td>
//                       <td>
//                         <span className="badge badge-default">
//                           {type.schemesCount}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="d-flex gap-2">
//                           <button
//                             className="btn btn-sm btn-outline-primary"
//                             onClick={() => handleEditType(type)}
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             className="btn btn-sm btn-outline-danger"
//                             onClick={() => handleDeleteType(type.id)}
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* Leave Schemes Card */}
//     <div className="col-12">
//       <div className="card">
//         <div className="card-header bg-light d-flex justify-content-between align-items-center">
//           <h2 className="mb-0">Leave Schemes</h2>
//           <button className="btn btn-primary" onClick={handleAddScheme}>
//             <FaPlus className="me-1" /> Add Scheme
//           </button>
//         </div>

//         <div className="card-body">
//           {loading ? (
//             <div className="text-center py-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : schemes.length === 0 ? (
//             <div className="text-center py-5 text-muted">
//               <FaInfoCircle size={48} className="mb-3" />
//               <h4>No leave schemes configured</h4>
//               <p>Click the "Add Scheme" button to get started</p>
//             </div>
//           ) : (
//             <div className="table-responsive">
//               <table className="table table-hover">
//                 <thead>
//                   <tr>
//                     <th>Name</th>
//                     <th>Description</th>
//                     <th>Slug</th>
//                     <th>Leave Types</th>
//                     <th>Users</th>
//                     <th>Actions</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {schemes.map((scheme) => (
//                     <tr key={scheme.id}>
//                       <td>{scheme.name}</td>
//                       <td>
//                         <small className="text-muted">
//                           {scheme.description}
//                         </small>
//                       </td>
//                       <td>
//                         <code>{scheme.slug}</code>
//                       </td>
//                       <td>
//                         <span className="badge badge-default">
//                           {scheme.leaveTypesCount}
//                         </span>
//                       </td>
//                       <td>
//                         <span className="badge badge-cancelled">
//                           {scheme.usersCount}
//                         </span>
//                       </td>
//                       <td>
//                         <div className="d-flex gap-2">
//                           <button
//                             className="btn btn-sm btn-outline-primary"
//                             onClick={() => handleEditScheme(scheme)}
//                           >
//                             <FaEdit />
//                           </button>
//                           <button
//                             className="btn btn-sm btn-outline-secondary"
//                             title="Configure Leave Types"
//                             onClick={() => setSchemeId(scheme.id)}
//                           >
//                             <FaLink />
//                           </button>
//                           <button
//                             className="btn btn-sm btn-outline-danger"
//                             onClick={() => handleDeleteScheme(scheme.id)}
//                           >
//                             <FaTrash />
//                           </button>
//                         </div>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>

//     {/* Scheme Configuration Card */}
//     <div className="col-12">
//       <div className="card">
//         <div className="card-header bg-light d-flex justify-content-between align-items-center">
//           <h2 className="mb-0">Leave Scheme Configuration</h2>
//           <div>
//             <button className="btn btn-primary" onClick={handleSaveAll}>
//               <FaSave className="me-1" /> Save Configuration
//             </button>
//           </div>
//         </div>

//         <div className="card-body">
//           {loading ? (
//             <div className="text-center py-5">
//               <div className="spinner-border text-primary" role="status">
//                 <span className="visually-hidden">Loading...</span>
//               </div>
//             </div>
//           ) : (
//             <div className="row">
//               {/* Sidebar Column - FIXED: added appropriate padding and margin */}
//               <div className="col-md-3 mb-3 mb-md-0">
//                 <div
//                   className="list-group sticky-top"
//                   style={{ top: "1rem" }}
//                 >
//                   {schemes.map((scheme) => {
//                     const isActive = schemeId === scheme.id;
//                     return (
//                       <button
//                         key={scheme.id}
//                         className={`list-group-item list-group-item-action ${
//                           isActive ? "badge-cancelled" : ""
//                         }`}
//                         onClick={() => setSchemeId(scheme.id)}
//                       >
//                         {scheme.name}
//                         <small className="d-block text-truncate">
//                           {scheme.slug}
//                         </small>
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Content Column - FIXED: added proper padding */}
//               <div className="col-md-9">
//                 <div className="ps-md-3">
//                   {" "}
//                   {/* Added padding to create space */}
//                   {currentSchemeConfig ? (
//                     <>
//                       <h3>{currentSchemeConfig.name} Configuration</h3>
//                       <p className="text-muted">
//                         Configure which leave types are available in this
//                         scheme
//                       </p>

//                       {currentConfigs.length > 0 ? (
//                         <div className="table-responsive">
//                           <table className="table table-hover">
//                             <thead>
//                               <tr>
//                                 <th>Leave Type</th>
//                                 <th>Type</th>
//                                 <th>Max Carry Forward</th>
//                                 <th>Actions</th>
//                               </tr>
//                             </thead>
//                             <tbody>
//                               {currentConfigs.map((config) => (
//                                 <tr key={config.id}>
//                                   <td>{config.leaveType.name}</td>
//                                   <td>
//                                     <span
//                                       className={`badge ${
//                                         config.leaveType.isPaid
//                                           ? "badge-approved"
//                                           : "badge-rejected"
//                                       }`}
//                                     >
//                                       {config.leaveType.isPaid
//                                         ? "Paid"
//                                         : "Unpaid"}
//                                     </span>
//                                   </td>
//                                   <td>
//                                     <input
//                                       type="number"
//                                       className="form-control form-control-sm"
//                                       value={config.maxCarryForward}
//                                       onChange={(e) => {
//                                         const updated = configurations.map(
//                                           (c) =>
//                                             c.id === config.id
//                                               ? {
//                                                   ...c,
//                                                   maxCarryForward: Number(
//                                                     e.target.value
//                                                   ),
//                                                 }
//                                               : c
//                                         );
//                                         setConfigurations(updated);
//                                       }}
//                                       min="0"
//                                       step="0.5"
//                                     />
//                                   </td>
//                                   <td>
//                                     <button
//                                       className="btn btn-sm btn-outline-danger"
//                                       onClick={() =>
//                                         handleRemoveConfig(config.id)
//                                       }
//                                     >
//                                       <FaTrash />
//                                     </button>
//                                   </td>
//                                 </tr>
//                               ))}
//                             </tbody>
//                           </table>
//                         </div>
//                       ) : (
//                         <div className="alert alert-info">
//                           No leave types configured for this scheme
//                         </div>
//                       )}

//                       {showAddForm ? (
//                         <div className="card mt-4">
//                           <div className="card-body">
//                             <h5 className="card-title">
//                               Add Leave Type to Scheme
//                             </h5>

//                             <div className="row g-3">
//                               <div className="col-md-6">
//                                 <label className="form-label">
//                                   Leave Type
//                                 </label>
//                                 <select
//                                   className="form-select"
//                                   value={newConfig.leaveTypeId}
//                                   onChange={(e) =>
//                                     setNewConfig({
//                                       ...newConfig,
//                                       leaveTypeId: Number(e.target.value),
//                                     })
//                                   }
//                                 >
//                                   <option value="0">
//                                     Select leave type
//                                   </option>
//                                   {availableLeaveTypes.map((lt) => (
//                                     <option key={lt.id} value={lt.id}>
//                                       {lt.name}
//                                     </option>
//                                   ))}
//                                 </select>
//                               </div>

//                               <div className="col-md-4">
//                                 <label className="form-label">
//                                   Max Carry Forward (Days)
//                                 </label>
//                                 <input
//                                   type="number"
//                                   className="form-control"
//                                   value={newConfig.maxCarryForward}
//                                   onChange={(e) =>
//                                     setNewConfig({
//                                       ...newConfig,
//                                       maxCarryForward: Number(
//                                         e.target.value
//                                       ),
//                                     })
//                                   }
//                                   min="0"
//                                   step="0.5"
//                                 />
//                               </div>

//                               <div className="col-md-2 d-flex align-items-end gap-2">
//                                 <button
//                                   type="button"
//                                   className="btn btn-primary"
//                                   onClick={handleAddConfig}
//                                 >
//                                   <FaLink /> Add
//                                 </button>
//                                 <button
//                                   type="button"
//                                   className="btn btn-outline-secondary"
//                                   onClick={() => setShowAddForm(false)}
//                                 >
//                                   Cancel
//                                 </button>
//                               </div>
//                             </div>
//                           </div>
//                         </div>
//                       ) : availableLeaveTypes.length > 0 ? (
//                         <button
//                           className="btn btn-outline-primary mt-3"
//                           onClick={() => setShowAddForm(true)}
//                         >
//                           <FaPlus className="me-1" /> Add Leave Type
//                         </button>
//                       ) : (
//                         <div className="alert alert-warning mt-3">
//                           All available leave types have been added to this
//                           scheme
//                         </div>
//                       )}
//                     </>
//                   ) : (
//                     <div className="alert alert-info">
//                       Please select a leave scheme from the list
//                     </div>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   </div>

//   {/* Leave Type Modal */}
//   {showTypeModal && (
//     <div
//       className="modal fade show"
//       style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
//     >
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">
//               {currentType ? "Edit Leave Type" : "Add New Leave Type"}
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               onClick={() => setShowTypeModal(false)}
//             ></button>
//           </div>
//           <div className="modal-body">
//             <LeaveTypeForm
//               type={currentType}
//               onSave={handleSaveType}
//               onCancel={() => setShowTypeModal(false)}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )}

//   {/* Leave Scheme Modal */}
//   {showSchemeModal && (
//     <div
//       className="modal fade show"
//       style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}
//     >
//       <div className="modal-dialog modal-dialog-centered">
//         <div className="modal-content">
//           <div className="modal-header">
//             <h5 className="modal-title">
//               {currentScheme ? "Edit Leave Scheme" : "Add New Leave Scheme"}
//             </h5>
//             <button
//               type="button"
//               className="btn-close"
//               onClick={() => setShowSchemeModal(false)}
//             ></button>
//           </div>
//           <div className="modal-body">
//             <LeaveSchemeForm
//               scheme={currentScheme}
//               onSave={handleSaveScheme}
//               onCancel={() => setShowSchemeModal(false)}
//             />
//           </div>
//         </div>
//       </div>
//     </div>
//   )}
// </div>

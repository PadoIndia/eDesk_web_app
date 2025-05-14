import { useState } from "react";
import { FaUsers, FaPlus, FaTrash, FaSearch } from "react-icons/fa";

interface User {
  id: string;
  name: string;
  email: string;
}

interface Department {
  id: string;
  name: string;
  teams: Team[];
}

interface Team {
  id: string;
  name: string;
  members: User[];
}

const DepartmentManagement = () => {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<string>("");
  const [newDepartment, setNewDepartment] = useState("");
  const [newTeam, setNewTeam] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [users] = useState<User[]>([
    { id: "1", name: "John Doe", email: "john@example.com" },
    { id: "2", name: "Jane Smith", email: "jane@example.com" },
    { id: "3", name: "Bob Johnson", email: "bob@example.com" },
  ]);
  const [selectedTeam, setSelectedTeam] = useState<{
    deptId: string;
    teamId: string;
  } | null>(null);

  const handleAddDepartment = () => {
    if (
      newDepartment.trim() &&
      !departments.some((d) => d.name === newDepartment)
    ) {
      setDepartments([
        ...departments,
        {
          id: Date.now().toString(),
          name: newDepartment,
          teams: [],
        },
      ]);
      setNewDepartment("");
    }
  };

  const handleAddTeam = () => {
    if (selectedDepartment && newTeam.trim()) {
      setDepartments(
        departments.map((dept) => {
          if (dept.id === selectedDepartment) {
            return {
              ...dept,
              teams: [
                ...dept.teams,
                {
                  id: Date.now().toString(),
                  name: newTeam,
                  members: [],
                },
              ],
            };
          }
          return dept;
        })
      );
      setNewTeam("");
    }
  };

  const handleDeleteDepartment = (id: string) => {
    setDepartments(departments.filter((d) => d.id !== id));
  };

  const handleDeleteTeam = (deptId: string, teamId: string) => {
    setDepartments(
      departments.map((dept) => {
        if (dept.id === deptId) {
          return {
            ...dept,
            teams: dept.teams.filter((t) => t.id !== teamId),
          };
        }
        return dept;
      })
    );
  };
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddToTeam = (user: User) => {
    if (!selectedTeam) return;

    setDepartments(
      departments.map((dept) => {
        if (dept.id === selectedTeam.deptId) {
          return {
            ...dept,
            teams: dept.teams.map((team) => {
              if (
                team.id === selectedTeam.teamId &&
                !team.members.some((m) => m.id === user.id)
              ) {
                return {
                  ...team,
                  members: [...team.members, user],
                };
              }
              return team;
            }),
          };
        }
        return dept;
      })
    );
    setSearchTerm("");
    setSelectedTeam(null);
  };
  return (
    <div className="container p-4">
      <div className="row">
        {/* Sidebar */}
        <div className="col-md-3">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <FaUsers className="me-2" />
                Organization Structure
              </h5>
            </div>
            <div className="card-body">
              <div className="mb-4">
                <h6>Create New Department</h6>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Department name"
                    value={newDepartment}
                    onChange={(e) => setNewDepartment(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleAddDepartment}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>

              <div className="mb-4">
                <h6>Add Team to Department</h6>
                <select
                  className="form-select mb-2"
                  value={selectedDepartment}
                  onChange={(e) => setSelectedDepartment(e.target.value)}
                >
                  <option value="">Select Department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>
                      {dept.name}
                    </option>
                  ))}
                </select>
                <div className="input-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Team name"
                    value={newTeam}
                    onChange={(e) => setNewTeam(e.target.value)}
                  />
                  <button
                    className="btn btn-primary"
                    onClick={handleAddTeam}
                    disabled={!selectedDepartment}
                  >
                    <FaPlus />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="col-md-9">
          <div className="card shadow">
            <div className="card-header bg-primary text-white">
              <h5 className="mb-0">
                <FaUsers className="me-2" />
                Departments & Teams
              </h5>
            </div>
            <div className="card-body">
              {departments.length === 0 ? (
                <div className="text-center py-5">
                  <h4 className="text-muted">No departments created yet</h4>
                </div>
              ) : (
                departments.map((dept) => (
                  <div key={dept.id} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h4 className="mb-0">
                        {dept.name}
                        <span className="badge bg-secondary ms-2">
                          {dept.teams.length} teams
                        </span>
                      </h4>
                      <button
                        className="btn badge-rejected btn-sm rounded-circle"
                        onClick={() => handleDeleteDepartment(dept.id)}
                      >
                        <FaTrash />
                      </button>
                    </div>
                    {selectedTeam && (
                      <div
                        className="modal show d-block"
                        style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
                      >
                        <div className="modal-dialog modal-dialog-centered">
                          <div className="modal-content">
                            <div className="modal-header">
                              <h5 className="modal-title">Add Team Member</h5>
                              <button
                                type="button"
                                className="btn-close"
                                onClick={() => setSelectedTeam(null)}
                              ></button>
                            </div>
                            <div className="modal-body">
                              <div className="input-group mb-3">
                                <span className="input-group-text">
                                  <FaSearch />
                                </span>
                                <input
                                  type="text"
                                  className="form-control"
                                  placeholder="Search users..."
                                  value={searchTerm}
                                  onChange={handleSearch}
                                />
                              </div>
                              <div className="list-group">
                                {filteredUsers.map((user) => (
                                  <button
                                    key={user.id}
                                    className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                                    onClick={() => handleAddToTeam(user)}
                                  >
                                    <div>
                                      <div>{user.name}</div>
                                      <small className="text-muted">
                                        {user.email}
                                      </small>
                                    </div>
                                    <FaPlus className="text-primary" />
                                  </button>
                                ))}
                                {filteredUsers.length === 0 && (
                                  <div className="text-center py-3 text-muted">
                                    No users found
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="row row-cols-1 row-cols-md-3 g-4">
                      {dept.teams.map((team) => (
                        <div key={team.id} className="col">
                          <div className="card h-100">
                            <div className="card-body">
                              <div className="d-flex justify-content-between align-items-center">
                                <h5 className="card-title mb-0">{team.name}</h5>
                                <button
                                  className="btn btn-sm badge-rejected rounded-circle" 
                                  onClick={() =>
                                    handleDeleteTeam(dept.id, team.id)
                                  }
                                >
                                  <FaTrash />
                                </button>
                              </div>
                              <div className="mt-2">
                                <div className="d-flex justify-content-between align-items-center">
                                  <span className="text-muted">
                                    {team.members.length} members
                                  </span>
                                  <button
                                    className="btn btn-sm btn-primary"
                                    onClick={() =>
                                      setSelectedTeam({
                                        deptId: dept.id,
                                        teamId: team.id,
                                      })
                                    }
                                  >
                                    <FaPlus /> Add Member
                                  </button>
                                </div>
                                {team.members.length > 0 && (
                                  <ul className="list-group mt-2">
                                    {team.members.map((member) => (
                                      <li
                                        key={member.id}
                                        className="list-group-item py-2"
                                      >
                                        <div>{member.name}</div>
                                        <small className="text-muted">
                                          {member.email}
                                        </small>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentManagement;

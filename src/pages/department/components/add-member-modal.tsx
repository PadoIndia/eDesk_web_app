import React, { useState, useEffect } from "react";
import {
  FaTimes,
  FaUserPlus,
  FaUsers,
  FaUserShield,
  FaUserMinus,
  FaSearch,
  FaCrown,
  FaUser,
} from "react-icons/fa";
import teamService from "../../../services/api-services/team.service";
import { Department, Team } from "../../../types/department-team.types";
import departmentService from "../../../services/api-services/department.service";

interface User {
  id: number;
  name: string;
  email?: string;
  username?: string;
  contact?: string;
  empCode?: string;
  isAdmin?: boolean;
  isDeptAdmin?: boolean;
  teamMemberId?: number;
}

interface DepartmentUserResponse {
  isAdmin: boolean;
  userId: number;
  user: {
    id: number;
    name: string;
    username: string;
    contact: string;
    empCode: string;
    createdOn: string;
    isActive: boolean;
    lastSeen: string | null;
    password: string;
    profileImgId: string | null;
    status: string | null;
    updatedOn: string;
  };
}

interface TeamMemberResponse {
  id: number;
  isAdmin: boolean;
  teamId: number;
  userId: number;
  createdOn: string;
  updatedOn: string;
  user: {
    id: number;
    name: string;
    username: string;
    contact: string;
    empCode: string;
    createdOn: string;
    isActive: boolean;
    lastSeen: string | null;
    password: string;
    profileImgId: string | null;
    status: string | null;
    updatedOn: string;
  };
}

interface TeamMemberModalProps {
  department: Department;
  team: Team;
  isOpen: boolean;
  onClose: () => void;
}

const TeamMemberModal: React.FC<TeamMemberModalProps> = ({
  department,
  team,
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<"add" | "manage">("add");
  const [departmentUsers, setDepartmentUsers] = useState<User[]>([]);
  const [teamMembers, setTeamMembers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch department users and team members
  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, department.id, team.id]);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch department users
      const deptResponse = await departmentService.getDepartmentById(
        Number(department.id)
      );

      // Transform department users data to match our interface
      const transformedDeptUsers: User[] = (deptResponse.data || []).map(
        (item: DepartmentUserResponse) => ({
          id: item.user.id,
          name: item.user.name,
          email: item.user.username, // Using username as email
          username: item.user.username,
          contact: item.user.contact,
          empCode: item.user.empCode,
          isDeptAdmin: item.isAdmin, // Department admin status
        })
      );

      setDepartmentUsers(transformedDeptUsers);

      // Fetch current team members
      const teamResponse = await teamService.getTeamById(Number(team.id));

      // Transform team members data to match our interface
      const transformedTeamMembers: User[] = (
        teamResponse.data?.users || []
      ).map((item: TeamMemberResponse) => ({
        id: item.user.id,
        name: item.user.name,
        email: item.user.username, // Using username as email
        username: item.user.username,
        contact: item.user.contact,
        empCode: item.user.empCode,
        isAdmin: item.isAdmin, // Team admin status
        teamMemberId: item.id, // Store the team membership ID for removal
      }));

      setTeamMembers(transformedTeamMembers);
    } catch (err) {
      setError("Failed to load data. Please try again.");
      console.error("Error fetching data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMember = async (userId: number, isAdmin: boolean = false) => {
    try {
      setLoading(true);
      await teamService.addUserToTeam(Number(team.id), { userId, isAdmin });

      // Refresh team members after adding
      const teamResponse = await teamService.getTeamById(Number(team.id));
      const transformedTeamMembers: User[] = (
        teamResponse.data?.users || []
      ).map((item: TeamMemberResponse) => ({
        id: item.user.id,
        name: item.user.name,
        email: item.user.username,
        username: item.user.username,
        contact: item.user.contact,
        empCode: item.user.empCode,
        isAdmin: item.isAdmin,
        teamMemberId: item.id,
      }));
      setTeamMembers(transformedTeamMembers);

      setError(null);
    } catch (err) {
      setError("Failed to add member. Please try again.");
      console.error("Error adding member:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveMember = async (userId: number) => {
    try {
      setLoading(true);
      await teamService.removeUserFromTeam(userId, Number(team.id));

      // Remove from local state
      setTeamMembers((prev) => prev.filter((member) => member.id !== userId));

      setError(null);
    } catch (err) {
      setError("Failed to remove member. Please try again.");
      console.error("Error removing member:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAdmin = async (userId: number, currentIsAdmin: boolean) => {
    try {
      setLoading(true);
      // Remove and re-add with different admin status
      await teamService.removeUserFromTeam(userId, Number(team.id));
      await teamService.addUserToTeam(Number(team.id), {
        userId,
        isAdmin: !currentIsAdmin,
      });

      // Update local state after toggling admin
      const teamResponse = await teamService.getTeamById(Number(team.id));
      const transformedTeamMembers: User[] = (
        teamResponse.data?.users || []
      ).map((item: TeamMemberResponse) => ({
        id: item.user.id,
        name: item.user.name,
        email: item.user.username,
        username: item.user.username,
        contact: item.user.contact,
        empCode: item.user.empCode,
        isAdmin: item.isAdmin,
        teamMemberId: item.id,
      }));
      setTeamMembers(transformedTeamMembers);

      setError(null);
    } catch (err) {
      setError("Failed to update admin status. Please try again.");
      console.error("Error updating admin status:", err);
    } finally {
      setLoading(false);
    }
  };

  // Filter available users (department users not already in team)
  const availableUsers = departmentUsers.filter(
    (user) =>
      !teamMembers.some((member) => member.id === user.id) &&
      user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filter current team members based on search
  const filteredTeamMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!isOpen) return null;

  return (
    <div
      className="modal fade show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg">
        <div className="modal-content">
          <div className="modal-header bg-primary text-white">
            <h5 className="modal-title d-flex align-items-center">
              <FaUsers className="me-2" />
              Manage Team: {team.name}
            </h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
              disabled={loading}
            ></button>
          </div>

          <div className="modal-body p-0">
            {error && (
              <div className="alert alert-danger m-3 mb-0" role="alert">
                {error}
              </div>
            )}

            {/* Tab Navigation */}
            <div className="border-bottom">
              <nav className="nav nav-tabs" role="tablist">
                <button
                  className={`nav-link ${activeTab === "add" ? "active" : ""}`}
                  onClick={() => setActiveTab("add")}
                  disabled={loading}
                >
                  <FaUserPlus className="me-2" />
                  Add Members ({availableUsers.length})
                </button>
                <button
                  className={`nav-link ${
                    activeTab === "manage" ? "active" : ""
                  }`}
                  onClick={() => setActiveTab("manage")}
                  disabled={loading}
                >
                  <FaUsers className="me-2" />
                  Current Members ({teamMembers.length})
                </button>
              </nav>
            </div>

            {/* Search Bar */}
            <div className="p-3 border-bottom">
              <div className="input-group">
                <span className="input-group-text">
                  <FaSearch />
                </span>
                <input
                  type="text"
                  className="form-control"
                  placeholder={`Search ${
                    activeTab === "add" ? "available users" : "team members"
                  }...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  disabled={loading}
                />
              </div>
            </div>

            {/* Tab Content */}
            <div
              className="tab-content"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {loading ? (
                <div className="text-center p-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <>
                  {/* Add Members Tab */}
                  {activeTab === "add" && (
                    <div className="p-3">
                      {availableUsers.length === 0 ? (
                        <div className="text-center text-muted py-4">
                          <FaUser size={48} className="mb-3 opacity-50" />
                          <p className="mb-0">
                            {searchTerm
                              ? "No users found matching your search."
                              : "All department members are already in this team."}
                          </p>
                        </div>
                      ) : (
                        <div className="row g-3">
                          {availableUsers.map((user) => (
                            <div key={user.id} className="col-12">
                              <div className="card border-0 shadow-sm">
                                <div className="card-body p-3">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div>
                                      <div className="d-flex align-items-center">
                                        <h6 className="mb-1">{user.name}</h6>
                                        {user.isDeptAdmin && (
                                          <span className="badge bg-info text-white ms-2">
                                            <FaCrown className="me-1" />
                                            Dept Admin
                                          </span>
                                        )}
                                      </div>
                                      <div className="d-flex flex-column">
                                        <small className="text-muted">
                                          {user.username}
                                        </small>
                                        {user.contact && (
                                          <small className="text-muted">
                                            {user.contact}
                                          </small>
                                        )}
                                        {user.empCode && (
                                          <small className="text-muted">
                                            ID: {user.empCode}
                                          </small>
                                        )}
                                      </div>
                                    </div>
                                    <div className="btn-group">
                                      <button
                                        className="btn btn-sm btn-outline-primary"
                                        onClick={() =>
                                          handleAddMember(user.id, false)
                                        }
                                        disabled={loading}
                                        title="Add as Member"
                                      >
                                        <FaUser className="me-1" />
                                        Member
                                      </button>
                                      <button
                                        className="btn btn-sm btn-outline-warning"
                                        onClick={() =>
                                          handleAddMember(user.id, true)
                                        }
                                        disabled={loading}
                                        title="Add as Admin"
                                      >
                                        <FaCrown className="me-1" />
                                        Admin
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Manage Members Tab */}
                  {activeTab === "manage" && (
                    <div className="p-3">
                      {filteredTeamMembers.length === 0 ? (
                        <div className="text-center text-muted py-4">
                          <FaUsers size={48} className="mb-3 opacity-50" />
                          <p className="mb-0">
                            {searchTerm
                              ? "No team members found matching your search."
                              : "No members in this team yet."}
                          </p>
                        </div>
                      ) : (
                        <div className="row g-3">
                          {filteredTeamMembers.map((member) => (
                            <div key={member.id} className="col-12">
                              <div className="card border-0 shadow-sm">
                                <div className="card-body p-3">
                                  <div className="d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center">
                                      <div>
                                        <div className="d-flex align-items-center">
                                          <h6 className="mb-1">
                                            {member.name}
                                          </h6>
                                          {member.isAdmin && (
                                            <span className="badge bg-warning text-dark ms-2">
                                              <FaCrown className="me-1" />
                                              Admin
                                            </span>
                                          )}
                                        </div>
                                        <div className="d-flex flex-column">
                                          <small className="text-muted">
                                            {member.username}
                                          </small>
                                          {member.contact && (
                                            <small className="text-muted">
                                              {member.contact}
                                            </small>
                                          )}
                                          {member.empCode && (
                                            <small className="text-muted">
                                              ID: {member.empCode}
                                            </small>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                    <div className="btn-group">
                                      <button
                                        className={`btn btn-sm ${
                                          member.isAdmin
                                            ? "btn-warning"
                                            : "btn-outline-warning"
                                        }`}
                                        onClick={() =>
                                          handleToggleAdmin(
                                            member.id,
                                            member.isAdmin || false
                                          )
                                        }
                                        disabled={loading}
                                        title={
                                          member.isAdmin
                                            ? "Remove Admin"
                                            : "Make Admin"
                                        }
                                      >
                                        <FaUserShield />
                                      </button>
                                      <button
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() =>
                                          handleRemoveMember(member.id)
                                        }
                                        disabled={loading}
                                        title="Remove from Team"
                                      >
                                        <FaUserMinus />
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className="modal-footer bg-light">
            <div className="d-flex justify-content-between w-100 align-items-center">
              <small className="text-muted">
                Department: {department.name}
              </small>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
                disabled={loading}
              >
                <FaTimes className="me-1" />
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamMemberModal;

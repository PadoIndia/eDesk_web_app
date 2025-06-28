import { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { toast } from "react-toastify";
import userService from "../../../services/api-services/user.service";
import departmentService from "../../../services/api-services/department.service";
import teamService from "../../../services/api-services/team.service";
import leaveSchemeService from "../../../services/api-services/leave-scheme.service";
import { DepartmentResponse, Team } from "../../../types/department-team.types";
import { GENDERS, WEEK_DAYS } from "../../../utils/constants";
import {
  UserDetails,
  UserInfo,
  CreateUserPayload,
  UpdateUserPayload,
  UserDepartmentResp,
  UserTeamResp,
} from "../../../types/user.types";
import { BsShieldCheck } from "react-icons/bs";
import { useAppSelector } from "../../../store/store";

interface UserFormProps {
  id: number | null;
  onSuccess: () => void;
}

type LeaveScheme = {
  id: number;
  name: string;
};

const CreateEditUser: React.FC<UserFormProps> = ({ id, onSuccess }) => {
  const [activeTab, setActiveTab] = useState<"details" | "assignments">(
    "details"
  );
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [leaveSchemes, setLeaveSchemes] = useState<LeaveScheme[]>([]);
  const [userDepartments, setUserDepartments] = useState<UserDepartmentResp[]>(
    []
  );
  const [userTeams, setUserTeams] = useState<UserTeamResp[]>([]);
  const [loading, setLoading] = useState(false);
  const [assignmentLoading, setAssignmentLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);

  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [joiningDateValue, setJoiningDateValue] = useState<Date | null>(null);
  const currentUserId = useAppSelector((s) => s.auth.userData?.user.id);
  const [userDetails, setUserDetails] = useState<UserDetails>({
    gender: "MALE",
    dob: "",
    joiningDate: "",
    leaveSchemeId: null,
    weekoff: "",
  });

  const [formData, setFormData] = useState<UserInfo>({
    name: "",
    username: "",
    contact: "91",
    password: "",
    empCode: "",
    isActive: true,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [deptResp, leaveResp] = await Promise.all([
          departmentService.getDepartments({ userId: currentUserId }),
          leaveSchemeService.getLeaveSchemes(),
        ]);

        if (deptResp.status === "success") {
          setDepartments(deptResp.data);
        }
        setLeaveSchemes(leaveResp.data);
      } catch (error) {
        console.error("Error fetching initial data:", error);
        toast.error("Failed to load form data");
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (id) {
      fetchUserData();
    }
  }, [id]);

  const fetchUserData = async () => {
    if (!id) return;

    setInitialLoading(true);
    try {
      const userResp = await userService.getUserById(id);
      if (userResp.status === "success") {
        const userData = userResp.data;
        setFormData({
          name: userData.name,
          username: userData.username,
          contact: userData.contact,
          password: userData.password,
          empCode: userData.empCode || null,
          isActive: userData.isActive,
        });

        if (userData.userDetails) {
          setUserDetails(userData.userDetails);
          if (userData.userDetails.dob) {
            setDobDate(new Date(userData.userDetails.dob));
          }
          if (userData.userDetails.joiningDate) {
            setJoiningDateValue(new Date(userData.userDetails.joiningDate));
          }
        }
        if (userData.userDepartment) {
          setUserDepartments(userData.userDepartment);
        }
        if (userData.userTeam) {
          setUserTeams(userData.userTeam);
        }
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      toast.error("Failed to load user data");
    } finally {
      setInitialLoading(false);
    }
  };

  const handleDateChange = (
    field: "dob" | "joiningDate",
    date: Date | null
  ) => {
    if (field === "dob") {
      setDobDate(date);
      setUserDetails((prev) => ({
        ...prev,
        dob: date ? date.toISOString() : "",
      }));
    } else {
      setJoiningDateValue(date);
      setUserDetails((prev) => ({
        ...prev,
        joiningDate: date ? date.toISOString() : "",
      }));
    }
  };

  const handleDepartmentToggle = async (dept: DepartmentResponse) => {
    if (!id) {
      setUserDepartments((prev) => {
        const exists = prev.find((d) => d.departmentId === dept.id);
        if (exists) {
          const departmentTeamIds = dept.teams?.map((t) => t.id) || [];

          setUserTeams((prevTeams) =>
            prevTeams.filter((ut) => !departmentTeamIds.includes(ut.teamId))
          );

          return prev.filter((d) => d.departmentId !== dept.id);
        } else {
          return [
            ...prev,
            {
              departmentId: dept.id,
              isAdmin: false,
              department: { name: dept.name, slug: dept.slug },
            },
          ];
        }
      });
      return;
    }

    const isCurrentlySelected = userDepartments.some(
      (d) => d.departmentId === dept.id
    );

    try {
      if (isCurrentlySelected) {
        const response = await departmentService.removeUserFromDepartment(
          dept.id,
          id
        );
        if (response.status === "success") {
          const departmentTeamIds = dept.teams?.map((t) => t.id) || [];

          setUserTeams((prevTeams) =>
            prevTeams.filter((ut) => !departmentTeamIds.includes(ut.teamId))
          );

          setUserDepartments((prev) =>
            prev.filter((d) => d.departmentId !== dept.id)
          );
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } else {
        const response = await departmentService.addUserToDepartment(dept.id, {
          userId: id,
          isAdmin: false,
        });
        if (response.status === "success") {
          setUserDepartments((prev) => [
            ...prev,
            {
              departmentId: dept.id,
              isAdmin: false,
              department: { name: dept.name, slug: dept.slug },
            },
          ]);
          toast.success(`Added to ${dept.name} department`);
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error("Error updating department assignment:", error);
      toast.error("An error occurred while updating department assignment");
    }
  };

  const handleAdminToggle = async (departmentId: number) => {
    if (!id) {
      setUserDepartments((prev) =>
        prev.map((d) =>
          d.departmentId === departmentId ? { ...d, isAdmin: !d.isAdmin } : d
        )
      );
      return;
    }

    const currentDepartment = userDepartments.find(
      (d) => d.departmentId === departmentId
    );
    if (!currentDepartment) return;

    const newAdminStatus = !currentDepartment.isAdmin;

    try {
      const response = await departmentService.updateDepartmentUser(
        departmentId,
        id,
        newAdminStatus
      );
      if (response.status === "success") {
        setUserDepartments((prev) =>
          prev.map((d) =>
            d.departmentId === departmentId
              ? { ...d, isAdmin: newAdminStatus }
              : d
          )
        );
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error updating department admin status:", error);
      toast.error("An error occurred while updating department admin status");
    }
  };

  const handleTeamToggle = async (team: Team) => {
    if (!id) {
      // For new users, just update state
      setUserTeams((prev) => {
        const exists = prev.find((t) => t.teamId === team.id);
        if (exists) {
          return prev.filter((t) => t.teamId !== team.id);
        } else {
          return [
            ...prev,
            {
              teamId: team.id,
              isAdmin: false,
              team: { name: team.name, slug: team.slug },
            },
          ];
        }
      });
      return;
    }

    // For existing users, make API calls
    const isCurrentlySelected = userTeams.some((t) => t.teamId === team.id);

    try {
      if (isCurrentlySelected) {
        // Remove user from team
        const response = await teamService.removeUserFromTeam(id, team.id);
        if (response.status === "success") {
          setUserTeams((prev) => prev.filter((t) => t.teamId !== team.id));
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      } else {
        // Add user to team
        const response = await teamService.addUserToTeam(team.id, {
          userId: id,
          isAdmin: false,
        });
        if (response.status === "success") {
          setUserTeams((prev) => [
            ...prev,
            {
              teamId: team.id,
              isAdmin: false,
              team: { name: team.name, slug: team.slug },
            },
          ]);
          toast.success(response.message);
        } else {
          toast.error(response.message);
        }
      }
    } catch (error) {
      console.error("Error updating team assignment:", error);
      toast.error("An error occurred while updating team assignment");
    }
  };

  const handleTeamAdminToggle = async (teamId: number) => {
    if (!id) {
      setUserTeams((prev) =>
        prev.map((t) =>
          t.teamId === teamId ? { ...t, isAdmin: !t.isAdmin } : t
        )
      );
      return;
    }

    const currentTeam = userTeams.find((t) => t.teamId === teamId);
    if (!currentTeam) return;

    const newAdminStatus = !currentTeam.isAdmin;

    try {
      const response = await teamService.updateTeamUser(
        id,
        teamId,
        newAdminStatus
      );
      if (response.status === "success") {
        setUserTeams((prev) =>
          prev.map((t) =>
            t.teamId === teamId ? { ...t, isAdmin: newAdminStatus } : t
          )
        );
        toast.success(`Team admin status updated`);
      } else {
        toast.error("Failed to update team admin status");
      }
    } catch (error) {
      console.error("Error updating team admin status:", error);
      toast.error("An error occurred while updating team admin status");
    }
  };

  const isDepartmentSelected = (departmentId: number) => {
    return userDepartments.some((d) => d.departmentId === departmentId);
  };

  const isAdmin = (departmentId: number) => {
    const dept = userDepartments.find((d) => d.departmentId === departmentId);
    return dept?.isAdmin || false;
  };

  const isTeamSelected = (teamId: number) => {
    return userTeams.some((t) => t.teamId === teamId);
  };

  const isTeamAdmin = (teamId: number) => {
    const team = userTeams.find((t) => t.teamId === teamId);
    return team?.isAdmin || false;
  };

  const validateUserDetails = (): boolean => {
    if (!formData.name || !formData.username || !formData.contact) {
      toast.error("Please fill all required basic fields");
      return false;
    }

    if (!id && !formData.password) {
      toast.error("Password is required for new users");
      return false;
    }

    if (!id) {
      if (!userDetails.gender || !userDetails.joiningDate) {
        toast.error("Please fill all required personal details");
        return false;
      }
    }

    return true;
  };

  const validateAssignments = (): boolean => {
    if (!id && userDepartments.length === 0) {
      toast.error("Please assign at least one department for new users");
      return false;
    }
    return true;
  };

  const handleUserDetailsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateUserDetails()) return;

    setLoading(true);
    try {
      if (id) {
        const updateData: UpdateUserPayload = {
          name: formData.name,
          username: formData.username,
          contact: formData.contact,
          empCode: formData.empCode || null,
          isActive: formData.isActive,
          password: formData.password,
          userDetails: {
            gender: userDetails.gender,
            ...(!!userDetails.leaveSchemeId && {
              leaveSchemeId: userDetails.leaveSchemeId,
            }),
            ...(!!userDetails.joiningDate && {
              joiningDate: userDetails.joiningDate,
            }),
            ...(!!userDetails.weekoff && { weekoff: userDetails.weekoff }),
            ...(!!userDetails.dob && { dob: userDetails.dob }),
          } as UserDetails,
        };

        if (formData.password) {
          updateData.password = formData.password;
        }

        const resp = await userService.updateUser(id, updateData);

        if (resp.status === "success") {
          toast.success("User details updated successfully");
          setActiveTab("assignments");
        } else {
          toast.error(resp.message || "Failed to update user details");
        }
      } else {
        setActiveTab("assignments");
        toast.success(
          "User details validated. Please assign departments and teams."
        );
      }
    } catch (error) {
      console.error("Error saving user details:", error);
      toast.error("An error occurred while saving user details");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignmentsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateAssignments()) return;

    setAssignmentLoading(true);
    try {
      if (id) {
        // For existing users, departments and teams are already handled in real-time
        // This submission is just for completion
        toast.success("Assignments updated successfully");
        onSuccess();
      } else {
        // For new users, create the user with all data
        const selectedDeptIds = userDepartments.map((d) => d.departmentId);
        const validTeams = userTeams.filter((team) => {
          const teamDepartment = departments.find((dept) =>
            dept.teams?.some((t) => t.id === team.teamId)
          );
          return teamDepartment && selectedDeptIds.includes(teamDepartment.id);
        });

        const createData: CreateUserPayload = {
          name: formData.name,
          username: formData.username,
          contact: formData.contact,
          password: formData.password,
          empCode: formData.empCode || null,
          isActive: formData.isActive,
          userDetails: userDetails,
          departments: userDepartments.map((d) => ({
            departmentId: d.departmentId,
            isAdmin: d.isAdmin,
          })),
          teams: validTeams.map((t) => ({
            teamId: t.teamId,
            isAdmin: t.isAdmin,
          })),
        };

        const resp = await userService.createUser(createData);

        if (resp.status === "success") {
          toast.success("User created successfully");
          onSuccess();
        } else {
          toast.error(resp.message || "Failed to create user");
        }
      }
    } catch (error) {
      console.error("Error saving assignments:", error);
      toast.error("An error occurred while saving assignments");
    } finally {
      setAssignmentLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="text-center p-4">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Tab Navigation */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "details" ? "active" : ""}`}
            onClick={() => setActiveTab("details")}
          >
            User Details
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${
              activeTab === "assignments" ? "active" : ""
            }`}
            onClick={() => setActiveTab("assignments")}
          >
            Departments & Teams
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      {activeTab === "details" && (
        <form onSubmit={handleUserDetailsSubmit}>
          <div className="row">
            {/* Basic User Information */}
            <div className="col-md-6">
              <h6 className="text-primary mb-3">Basic Information</h6>
              <div className="mb-3">
                <label className="form-label">
                  Name <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Username (Email) <span className="text-danger">*</span>
                </label>
                <input
                  type="email"
                  className="form-control"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Contact <span className="text-danger">*</span>
                </label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.contact}
                  onChange={(e) =>
                    setFormData({ ...formData, contact: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Password {!id && <span className="text-danger">*</span>}
                </label>
                <input
                  type="password"
                  className="form-control"
                  value={formData.password || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, password: e.target.value })
                  }
                  placeholder={
                    id ? "Leave blank to keep unchanged" : "Enter password"
                  }
                  required={!id}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Employee Code</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData.empCode || ""}
                  onChange={(e) =>
                    setFormData({ ...formData, empCode: e.target.value })
                  }
                />
              </div>
              <div className="mb-3 form-check form-switch">
                <input
                  type="checkbox"
                  className="form-check-input"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) =>
                    setFormData({ ...formData, isActive: e.target.checked })
                  }
                />
                <label className="form-check-label" htmlFor="isActiveToggle">
                  Active User
                </label>
              </div>
            </div>

            {/* User Details */}
            <div className="col-md-6">
              <h6 className="text-primary mb-3">Personal Details</h6>
              <div className="mb-3">
                <label className="form-label">
                  Gender <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={userDetails.gender}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      gender: e.target.value as "MALE" | "FEMALE" | "OTHER",
                    })
                  }
                  required
                >
                  <option value="">Select Gender</option>
                  {GENDERS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3 d-flex flex-column">
                <label className="form-label">
                  Date of Birth <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={dobDate}
                  onChange={(date) => handleDateChange("dob", date)}
                  className="form-control"
                  placeholderText="Select date of birth"
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                />
              </div>
              <div className="mb-3 d-flex flex-column">
                <label className="form-label">
                  Joining Date <span className="text-danger">*</span>
                </label>
                <DatePicker
                  selected={joiningDateValue}
                  onChange={(date) => handleDateChange("joiningDate", date)}
                  className="form-control"
                  placeholderText="Select joining date"
                  dateFormat="yyyy-MM-dd"
                  maxDate={new Date()}
                  showYearDropdown
                  showMonthDropdown
                  dropdownMode="select"
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label">
                  Week Off <span className="text-danger">*</span>
                </label>
                <select
                  className="form-select"
                  value={userDetails.weekoff}
                  onChange={(e) =>
                    setUserDetails({ ...userDetails, weekoff: e.target.value })
                  }
                  required
                >
                  <option value="">Select Week Off</option>
                  {WEEK_DAYS.map((day) => (
                    <option key={day} value={day}>
                      {day.charAt(0) + day.slice(1).toLowerCase()}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Leave Scheme</label>
                <select
                  className="form-select"
                  value={userDetails.leaveSchemeId || ""}
                  onChange={(e) =>
                    setUserDetails({
                      ...userDetails,
                      leaveSchemeId: e.target.value
                        ? parseInt(e.target.value)
                        : null,
                    })
                  }
                >
                  <option value="">Select Leave Scheme (Optional)</option>
                  {leaveSchemes.map((scheme) => (
                    <option key={scheme.id} value={scheme.id}>
                      {scheme.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <button
              type="submit"
              className="btn btn-primary me-2"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {id ? "Updating..." : "Validating..."}
                </>
              ) : id ? (
                "Update User Details"
              ) : (
                "Next: Assign Departments & Teams"
              )}
            </button>
            {!id && (
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setActiveTab("assignments")}
              >
                Skip to Assignments
              </button>
            )}
          </div>
        </form>
      )}

      {activeTab === "assignments" && (
        <form onSubmit={handleAssignmentsSubmit}>
          <div className="row">
            <div className="col-12">
              <h6 className="text-primary mb-3">
                Department & Team Assignments{" "}
                {!id && <span className="text-danger">*</span>}
              </h6>
              <div
                className="border rounded p-2"
                style={{
                  maxHeight: "500px",
                  overflowY: "auto",
                  backgroundColor: "#f8f9fa",
                }}
              >
                {departments.length === 0 ? (
                  <p className="text-muted mb-0">No departments available</p>
                ) : (
                  departments.map((dept) => (
                    <div
                      key={dept.id}
                      className="mb-2 p-3 border rounded bg-white"
                    >
                      <div className="">
                        {/* Department Checkbox */}
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`dept-${dept.id}`}
                            checked={isDepartmentSelected(dept.id)}
                            onChange={() => handleDepartmentToggle(dept)}
                          />
                          <label
                            className="form-check-label fw-bold"
                            htmlFor={`dept-${dept.id}`}
                          >
                            {dept.name}
                          </label>
                        </div>

                        {/* Department Admin Toggle */}
                        {isDepartmentSelected(dept.id) && (
                          <div className="form-check form-switch ms-4 mt-1">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`admin-${dept.id}`}
                              checked={isAdmin(dept.id)}
                              onChange={() => handleAdminToggle(dept.id)}
                            />
                            <label
                              className="form-check-label text-primary"
                              htmlFor={`admin-${dept.id}`}
                            >
                              <BsShieldCheck size={15} className="me-1" />
                              Department Admin
                            </label>
                          </div>
                        )}

                        {/* Teams Section - Only show if department is selected */}
                        {isDepartmentSelected(dept.id) &&
                          dept.teams &&
                          dept.teams.length > 0 && (
                            <div className="ms-4 mt-2 p-2 bg-light rounded">
                              <div className="fw-semibold text-secondary mb-2">
                                Teams:
                              </div>
                              {dept.teams.map((team) => (
                                <div key={team.id} className="mb-1">
                                  {/* Team Checkbox */}
                                  <div className="form-check">
                                    <input
                                      className="form-check-input"
                                      type="checkbox"
                                      id={`team-${team.id}`}
                                      checked={isTeamSelected(team.id)}
                                      onChange={() => handleTeamToggle(team)}
                                    />
                                    <label
                                      className="form-check-label"
                                      htmlFor={`team-${team.id}`}
                                    >
                                      {team.name}
                                    </label>
                                  </div>

                                  {/* Team Admin Toggle */}
                                  {isTeamSelected(team.id) && (
                                    <div className="form-check form-switch ms-4">
                                      <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id={`team-admin-${team.id}`}
                                        checked={isTeamAdmin(team.id)}
                                        onChange={() =>
                                          handleTeamAdminToggle(team.id)
                                        }
                                      />
                                      <label
                                        className="form-check-label text-info"
                                        htmlFor={`team-admin-${team.id}`}
                                      >
                                        <BsShieldCheck
                                          size={14}
                                          className="me-1"
                                        />
                                        Team Admin
                                      </label>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                      </div>
                    </div>
                  ))
                )}
              </div>
              {(userDepartments.length > 0 || userTeams.length > 0) && (
                <div className="mt-2">
                  <small className="text-muted">
                    Selected: {userDepartments.length} department(s)
                    {userDepartments.filter((d) => d.isAdmin).length > 0 &&
                      ` (${
                        userDepartments.filter((d) => d.isAdmin).length
                      } admin)`}
                    {userTeams.length > 0 && `, ${userTeams.length} team(s)`}
                    {userTeams.filter((t) => t.isAdmin).length > 0 &&
                      ` (${userTeams.filter((t) => t.isAdmin).length} admin)`}
                  </small>
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <button
              type="button"
              className="btn btn-outline-secondary me-2"
              onClick={() => setActiveTab("details")}
            >
              Back to User Details
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={assignmentLoading}
            >
              {assignmentLoading ? (
                <>
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  {id ? "Updating..." : "Creating..."}
                </>
              ) : id ? (
                "Update Assignments"
              ) : (
                "Create User"
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default CreateEditUser;

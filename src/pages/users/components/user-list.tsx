import { useEffect, useState } from "react";
import userService from "../../../services/api-services/user.service";
import { toast } from "react-toastify";
import { User } from "../../../types/user.types";
// import { Department } from "../../../types/department-team.types";
import departmentService from "../../../services/api-services/department.service";
import userDepartmentService from "../../../services/api-services/user-department.service";
import leaveSchemeService from "../../../services/api-services/leave-scheme.service";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { setDepartments } from "../../../features/department.slice";
import { AppDispatch, RootState } from "../../../store/store";
import { useDispatch, useSelector } from "react-redux";

interface UserDepartmentAssignment {
  departmentId: number;
  isAdmin: boolean;
}

type LeaveScheme = {
  id: number;
  name: string;
};

type CreateUserDetails = {
  gender: string;
  dob: string;
  joiningDate: string;
  leaveSchemeId?: number;
  weekoff: string;
};

const UsersList = () => {
  const dispatch = useDispatch<AppDispatch>();
  const departments = useSelector(
    (state: RootState) => state.department.departments
  );

  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  // const [departments, setDepartments] = useState<Department[]>([]);
  const [leaveSchemes, setLeaveSchemes] = useState<LeaveScheme[]>([]);
  const [userDepartments, setUserDepartments] = useState<
    Record<number, UserDepartmentAssignment[]>
  >({});
  const [loading, setLoading] = useState(false);

  // Date states
  const [dobDate, setDobDate] = useState<Date | null>(null);
  const [joiningDateValue, setJoiningDateValue] = useState<Date | null>(null);


  const [formData, setFormData] = useState({
    name: "",
    username: "",
    contact: "91",
    password: "",
    empCode: "",
    isActive: true,
    departmentAssignments: [] as UserDepartmentAssignment[],
    // User details fields
    gender: "",
    dob: "",
    joiningDate: "",
    leaveSchemeId: undefined as number | undefined,
    weekoff: "",
  });

  const genderOptions = [
    { value: "MALE", label: "Male" },
    { value: "FEMALE", label: "Female" },
    { value: "OTHER", label: "Other" },
  ];

  const weekDays = [
    "MONDAY",
    "TUESDAY",
    "WEDNESDAY",
    "THURSDAY",
    "FRIDAY",
    "SATURDAY",
    "SUNDAY",
  ];

  const getUsers = async () => {
    try {
      const resp = await userService.getAllUsers();
      if (resp.status === "success") {
        setUsers(resp.data);
        await fetchUserDepartments(resp.data);
      } else {
        toast.error(resp.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while fetching users.");
    }
  };

  const fetchUserDepartments = async (usersList: User[]) => {
    try {
      const departmentPromises = usersList.map(async (user) => {
        try {
          const resp = await userDepartmentService.getUserDepartmentByUserId(
            user.id
          );
          return {
            userId: user.id,
            departments: resp.data.map((dept: any) => ({
              departmentId: dept.departmentId,
              isAdmin: dept.isAdmin,
            })),
          };
        } catch (error) {
          console.log("errors", error);
          return { userId: user.id, departments: [] };
        }
      });

      const results = await Promise.all(departmentPromises);
      const userDeptMap = results.reduce((acc, curr) => {
        acc[curr.userId] = curr.departments;
        return acc;
      }, {} as Record<number, UserDepartmentAssignment[]>);

      setUserDepartments(userDeptMap);
    } catch (error) {
      console.error("Error fetching user departments:", error);
    }
  };

  const getDepartments = async () => {
    try {
      const resp = await departmentService.getDepartments();
      dispatch(setDepartments(resp.data));
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching departments.");
    }
  };

  const fetchLeaveSchemes = async () => {
    try {
      const response = await leaveSchemeService.getLeaveSchemes();
      setLeaveSchemes(response.data);
    } catch (error) {
      console.error("Failed to fetch leave schemes:", error);
    }
  };

  useEffect(() => {
    getUsers();
    getDepartments();
    fetchLeaveSchemes();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      contact: "91",
      password: "",
      empCode: "",
      departmentAssignments: [],
      gender: "",
      dob: "",
      joiningDate: "",
      leaveSchemeId: undefined,
      weekoff: "",
      isActive: true,
    });
    setEditingUserId(null);
    setDobDate(null);
    setJoiningDateValue(null);
  };

  const handleOpenAddUser = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    const existingAssignments = userDepartments[user.id] || [];
    setFormData({
      name: user.name || "",
      username: user.username,
      contact: user.contact,
      password: "",
      empCode: user.empCode || "",
      isActive: user.isActive,
      departmentAssignments: existingAssignments,
      // For editing, we don't load user details as they should already exist
      gender: "",
      dob: "",
      joiningDate: "",
      leaveSchemeId: undefined,
      weekoff: "",
    });
    setShowModal(true);
  };


  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleDepartmentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentId = parseInt(e.target.value);
    if (
      departmentId &&
      !formData.departmentAssignments.some(
        (dept) => dept.departmentId === departmentId
      )
    ) {
      setFormData((prev) => ({
        ...prev,
        departmentAssignments: [
          ...prev.departmentAssignments,
          { departmentId, isAdmin: false },
        ],
      }));
    }
  };

  const handleRemoveDepartment = (departmentId: number) => {
    setFormData((prev) => ({
      ...prev,
      departmentAssignments: prev.departmentAssignments.filter(
        (dept) => dept.departmentId !== departmentId
      ),
    }));
  };

  const handleAdminToggle = (departmentId: number) => {
    setFormData((prev) => ({
      ...prev,
      departmentAssignments: prev.departmentAssignments.map((dept) =>
        dept.departmentId === departmentId
          ? { ...dept, isAdmin: !dept.isAdmin }
          : dept
      ),
    }));
  };

  const handleDateChange = (
    field: "dob" | "joiningDate",
    date: Date | null
  ) => {
    if (field === "dob") {
      setDobDate(date);
      setFormData((prev) => ({
        ...prev,
        dob: date ? date.toISOString() : "",
      }));
    } else {
      setJoiningDateValue(date);
      setFormData((prev) => ({
        ...prev,
        joiningDate: date ? date.toISOString() : "",
      }));
    }
  };

  const handleSaveUser = async () => {
    try {
      setLoading(true);

      // Validation for new users
      if (!editingUserId) {
        if (
          !formData.name ||
          !formData.username ||
          !formData.contact ||
          !formData.password
        ) {
          toast.error("Please fill all basic user fields");
          return;
        }

        if (formData.departmentAssignments.length === 0) {
          toast.error("Please assign at least one department");
          return;
        }

        if (
          !formData.gender ||
          !formData.dob ||
          !formData.joiningDate ||
          !formData.weekoff
        ) {
          toast.error("Please fill all user details fields");
          return;
        }
      }

      let userId = editingUserId;

      // First, create or update the user
      if (editingUserId) {
        // For updates, exclude password field
        const userData = {
          ...(formData.name && { name: formData.name }),
          ...(formData.username && { username: formData.username }),
          ...(formData.contact && { contact: formData.contact }),
          ...(formData.empCode && { empCode: formData.empCode }),
          isActive: formData.isActive,
        };

        const resp = await userService.updateUser(editingUserId, userData);

        if (resp.status === "success") {
          setUsers((prev) =>
            prev.map((u) =>
              u.id === editingUserId ? { ...u, ...resp.data } : u
            )
          );
        } else {
          toast.error(resp.message);
          return;
        }
      } else {
        // Create new user
        const resp = await userService.createUser({
          name: formData.name,
          username: formData.username,
          contact: formData.contact,
          password: formData.password,
          empCode: formData.empCode,
          isActive: formData.isActive,
        });

        if (resp.status === "success") {
          setUsers((prev) => [...prev, resp.data]);
          userId = resp.data.id;
        } else {
          toast.error(resp.message);
          return;
        }
      }

      // Handle department assignments (only for new users or when editing departments)
      if (userId && formData.departmentAssignments.length > 0) {
        try {
          const existingAssignments = userDepartments[userId] || [];

          const assignmentsToAdd = formData.departmentAssignments.filter(
            (newAssignment) =>
              !existingAssignments.some(
                (existing) =>
                  existing.departmentId === newAssignment.departmentId
              )
          );

          const assignmentsToUpdate = formData.departmentAssignments.filter(
            (newAssignment) =>
              existingAssignments.some(
                (existing) =>
                  existing.departmentId === newAssignment.departmentId &&
                  existing.isAdmin !== newAssignment.isAdmin
              )
          );

          const assignmentsToRemove = existingAssignments.filter(
            (existing) =>
              !formData.departmentAssignments.some(
                (newAssignment) =>
                  newAssignment.departmentId === existing.departmentId
              )
          );

          const promises = [
            ...assignmentsToAdd.map((assignment) =>
              userDepartmentService.createUserDepartment({
                userId,
                departmentId: assignment.departmentId,
                isAdmin: assignment.isAdmin,
              })
            ),
            ...assignmentsToUpdate.map((assignment) =>
              userDepartmentService.updateUserDepartment(
                userId,
                assignment.departmentId,
                assignment.isAdmin
              )
            ),
            ...assignmentsToRemove.map((assignment) =>
              userDepartmentService.deleteUserDepartment(
                userId,
                assignment.departmentId
              )
            ),
          ];

          if (promises.length > 0) {
            await Promise.all(promises);
          }

          setUserDepartments((prev) => ({
            ...prev,
            [userId]: formData.departmentAssignments,
          }));
        } catch (deptError) {
          console.error("Error updating department assignments:", deptError);
          toast.error("User saved but failed to update department assignments");
        }
      }

      // Create user details (only for new users)
      if (!editingUserId && userId) {
        try {
          const userDetailsData: CreateUserDetails = {
            gender: formData.gender,
            dob: formData.dob,
            joiningDate: formData.joiningDate,
            weekoff: formData.weekoff,
            ...(formData.leaveSchemeId && {
              leaveSchemeId: Number(formData.leaveSchemeId),
            }),
          };

          await userService.createUserDetails(userDetailsData);
        } catch (detailsError) {
          console.error("Error creating user details:", detailsError);
          toast.error("User created but failed to save user details");
        }
      }

      toast.success(
        editingUserId
          ? "User updated successfully"
          : "New user created successfully with all details"
      );
      handleCloseModal();
    } catch (err) {
      console.error(err);
      toast.error("Error while saving user");
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentNames = (userId: number) => {
    const assignments = userDepartments[userId] || [];
    return assignments
      .map((assignment) => {
        const dept = departments.find((d) => d.id === assignment.departmentId);
        return dept
          ? `${dept.name}${assignment.isAdmin ? " (Admin)" : ""}`
          : "";
      })
      .filter(Boolean)
      .join(", ");
  };

  const getAvailableDepartments = () => {
    return departments.filter(
      (dept) =>
        !formData.departmentAssignments.some(
          (assignment) => assignment.departmentId === dept.id
        )
    );
  };

  return (
    <div className="p-4">
      <h4>Users</h4>
      <button
        className="btn btn-primary btn-sm mb-3"
        onClick={handleOpenAddUser}
      >
        Add User
      </button>

      <table className="table table-striped table-bordered table-hover mt-3 rounded">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Username</th>
            <th>Contact</th>
            <th>Departments</th>
            <th>Status</th>
            <th style={{ width: "120px" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.name || "N/A"}</td>
              <td>{user.username}</td>
              <td>{user.contact}</td>
              <td>
                <small className="text-muted">
                  {getDepartmentNames(user.id) || "No departments assigned"}
                </small>
              </td>
             <td>{user.isActive ? "Active" : "Inactive"}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleEditUser(user)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <>
          <div className="modal show d-block" tabIndex={-1} role="dialog">
            <div className="modal-dialog modal-xl" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingUserId ? "Edit User" : "Add New User"}
                  </h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={handleCloseModal}
                  ></button>
                </div>
                <div className="modal-body">
                  <form>
                    <div className="row">
                      {/* Basic User Information */}
                      <div className="col-md-4">
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
                            Username (Email){" "}
                            <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control"
                            value={formData.username}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                username: e.target.value,
                              })
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
                              setFormData({
                                ...formData,
                                contact: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        {!editingUserId && (
                          <div className="mb-3">
                            <label className="form-label">
                              Password <span className="text-danger">*</span>
                            </label>
                            <input
                              type="password"
                              className="form-control"
                              value={formData.password}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  password: e.target.value,
                                })
                              }
                              required
                            />
                          </div>
                        )}
                        <div className="mb-3">
                          <label className="form-label">Employee Code</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.empCode}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                empCode: e.target.value,
                              })
                            }
                          />
                        </div>
                        {/* Add after Employee Code field */}
                        <div className="mb-3 form-check form-switch">
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id="isActiveToggle"
                            checked={formData.isActive}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                isActive: e.target.checked,
                              })
                            }
                          />
                          <label
                            className="form-check-label"
                            htmlFor="isActiveToggle"
                          >
                            Active User
                          </label>
                        </div>
                      </div>

                      {/* User Details (only for new users) */}
                      {!editingUserId && (
                        <div className="col-md-4">
                          <h6 className="text-primary mb-3">
                            Personal Details
                          </h6>
                          <div className="mb-3">
                            <label className="form-label">
                              Gender <span className="text-danger">*</span>
                            </label>
                            <select
                              className="form-select"
                              value={formData.gender}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  gender: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">Select Gender</option>
                              {genderOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              Date of Birth{" "}
                              <span className="text-danger">*</span>
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
                              required
                            />
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              Joining Date{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <DatePicker
                              selected={joiningDateValue}
                              onChange={(date) =>
                                handleDateChange("joiningDate", date)
                              }
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
                              value={formData.weekoff}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  weekoff: e.target.value,
                                })
                              }
                              required
                            >
                              <option value="">Select Week Off</option>
                              {weekDays.map((day) => (
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
                              value={formData.leaveSchemeId || ""}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  leaveSchemeId: e.target.value
                                    ? parseInt(e.target.value)
                                    : undefined,
                                })
                              }
                            >
                              <option value="">
                                Select Leave Scheme (Optional)
                              </option>
                              {leaveSchemes.map((scheme) => (
                                <option key={scheme.id} value={scheme.id}>
                                  {scheme.name}
                                </option>
                              ))}
                            </select>
                          </div>
                        </div>
                      )}

                      {/* Department Assignments */}
                      <div className={editingUserId ? "col-md-8" : "col-md-4"}>
                        <h6 className="text-primary mb-3">
                          Department Assignments{" "}
                          {!editingUserId && (
                            <span className="text-danger">*</span>
                          )}
                        </h6>

                        <div className="mb-3">
                          <select
                            className="form-select"
                            onChange={handleDepartmentSelect}
                            value=""
                          >
                            <option value="">Select a department to add</option>
                            {getAvailableDepartments().map((dept) => (
                              <option key={dept.id} value={dept.id}>
                                {dept.name}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div
                          className="border p-3 rounded"
                          style={{ maxHeight: "300px", overflowY: "auto" }}
                        >
                          {formData.departmentAssignments.length === 0 ? (
                            <small className="text-muted">
                              No departments selected
                            </small>
                          ) : (
                            formData.departmentAssignments.map((assignment) => {
                              const dept = departments.find(
                                (d) => d.id === assignment.departmentId
                              );
                              return (
                                <div
                                  key={assignment.departmentId}
                                  className="d-flex align-items-center justify-content-between mb-2 p-2 border rounded bg-light"
                                >
                                  <span>{dept?.name}</span>
                                  <div className="d-flex align-items-center gap-2">
                                    <div className="form-check">
                                      <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={assignment.isAdmin}
                                        onChange={() =>
                                          handleAdminToggle(
                                            assignment.departmentId
                                          )
                                        }
                                      />
                                      <label className="form-check-label">
                                        Admin
                                      </label>
                                    </div>
                                    <button
                                      type="button"
                                      className="btn btn-sm btn-outline-danger"
                                      onClick={() =>
                                        handleRemoveDepartment(
                                          assignment.departmentId
                                        )
                                      }
                                    >
                                      Remove
                                    </button>
                                  </div>
                                </div>
                              );
                            })
                          )}
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                    disabled={loading}
                  >
                    Cancel
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveUser}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span
                          className="spinner-border spinner-border-sm me-2"
                          role="status"
                          aria-hidden="true"
                        ></span>
                        {editingUserId ? "Updating..." : "Creating..."}
                      </>
                    ) : editingUserId ? (
                      "Update User"
                    ) : (
                      "Create User"
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default UsersList;

import { useEffect, useState } from "react";
import userService from "../../../services/api-services/user.service";
import { toast } from "react-toastify";
import { User } from "../../../types/user.types";
import { Department } from "../../../types/department-team.types";
import departmentService from "../../../services/api-services/department.service";
import userDepartmentService from "../../../services/api-services/user-department.service";

interface UserDepartmentAssignment {
  departmentId: number;
  isAdmin: boolean;
}

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [userDepartments, setUserDepartments] = useState<
    Record<number, UserDepartmentAssignment[]>
  >({});

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    contact: "91",
    password: "",
    empCode: "",
    departmentAssignments: [] as UserDepartmentAssignment[],
  });

  const getUsers = async () => {
    try {
      const resp = await userService.getAllUsers();
      if (resp.status === "success") {
        setUsers(resp.data);
        // Fetch department assignments for each user
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
      setDepartments(resp.data);
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while fetching departments.");
    }
  };

  useEffect(() => {
    getUsers();
    getDepartments();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      contact: "91",
      password: "",
      empCode: "",
      departmentAssignments: [],
    });
    setEditingUserId(null);
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
      password: "", // Keep empty for editing
      empCode: user.empCode || "",
      departmentAssignments: existingAssignments,
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleDepartmentSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const departmentId = parseInt(e.target.value);
    if (departmentId && !formData.departmentAssignments.some(dept => dept.departmentId === departmentId)) {
      setFormData(prev => ({
        ...prev,
        departmentAssignments: [
          ...prev.departmentAssignments,
          { departmentId, isAdmin: false }
        ]
      }));
    }
  };

  const handleRemoveDepartment = (departmentId: number) => {
    setFormData(prev => ({
      ...prev,
      departmentAssignments: prev.departmentAssignments.filter(
        dept => dept.departmentId !== departmentId
      )
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

  const handleSaveUser = async () => {
    try {
      let userId = editingUserId;

      // First, create or update the user
      if (editingUserId) {
        // For updates, exclude password field
        const userData = {
          ...(formData.name && { name: formData.name }),
          ...(formData.username && { username: formData.username }),
          ...(formData.contact && { contact: formData.contact }),
          ...(formData.empCode && { empCode: formData.empCode }),
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
        const resp = await userService.createUser({
          name: formData.name,
          username: formData.username,
          contact: formData.contact,
          password: formData.password, // Only include password for new users
          empCode: formData.empCode,
        });

        if (resp.status === "success") {
          setUsers((prev) => [...prev, resp.data]);
          userId = resp.data.id;
        } else {
          toast.error(resp.message);
          return;
        }
      }

      // Then handle department assignments
      if (userId && formData.departmentAssignments.length > 0) {
        try {
          // Get existing assignments for this user
          const existingAssignments = userDepartments[userId] || [];

          // Determine which assignments to add, update, or remove
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

          // Update local state
          setUserDepartments((prev) => ({
            ...prev,
            [userId]: formData.departmentAssignments,
          }));
        } catch (deptError) {
          console.error("Error updating department assignments:", deptError);
          toast.error("User saved but failed to update department assignments");
        }
      }

      toast.success(
        editingUserId
          ? "User updated successfully"
          : "New user added successfully"
      );
      handleCloseModal();
    } catch (err) {
      console.error(err);
      toast.error("Error while saving user");
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
      dept => !formData.departmentAssignments.some(
        assignment => assignment.departmentId === dept.id
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
            <div className="modal-dialog modal-lg" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {editingUserId ? "Edit User" : "Add User"}
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
                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">Name</label>
                          <input
                            type="text"
                            className="form-control"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Username</label>
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
                          />
                        </div>
                        <div className="mb-3">
                          <label className="form-label">Contact</label>
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
                          />
                        </div>
                        {/* Only show password field for new users */}
                        {!editingUserId && (
                          <div className="mb-3">
                            <label className="form-label">Password</label>
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
                      </div>

                      <div className="col-md-6">
                        <div className="mb-3">
                          <label className="form-label">
                            Department Assignments
                          </label>
                          
                          {/* Dropdown to add departments */}
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

                          {/* List of assigned departments */}
                          <div 
                            className="border p-3 rounded"
                            style={{ maxHeight: "250px", overflowY: "auto" }}
                          >
                            {formData.departmentAssignments.length === 0 ? (
                              <small className="text-muted">
                                No departments selected
                              </small>
                            ) : (
                              formData.departmentAssignments.map((assignment) => {
                                const dept = departments.find(d => d.id === assignment.departmentId);
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
                                          onChange={() => handleAdminToggle(assignment.departmentId)}
                                        />
                                        <label className="form-check-label">
                                          Admin
                                        </label>
                                      </div>
                                      <button
                                        type="button"
                                        className="btn btn-sm btn-outline-danger"
                                        onClick={() => handleRemoveDepartment(assignment.departmentId)}
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
                    </div>
                  </form>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleCloseModal}
                  >
                    Close
                  </button>
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleSaveUser}
                  >
                    {editingUserId ? "Update User" : "Add User"}
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
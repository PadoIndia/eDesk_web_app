import { useEffect, useState } from "react";
import userService from "../../../services/api-services/user.service";
import { toast } from "react-toastify";
import { User } from "../../../types/user.types";

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    contact: "91",
    password: "",
    empCode: "",
  });

  const getUsers = async () => {
    try {
      const resp = await userService.getAllUsers();
      if (resp.status === "success") {
        setUsers(resp.data);
      } else {
        toast.error(resp.message || "Failed to fetch users");
      }
    } catch (err) {
      console.error(err);
      toast.error("An error occurred while fetching users.");
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  const resetForm = () => {
    setFormData({
      name: "",
      username: "",
      contact: "91",
      password: "",
      empCode: "",
    });
    setEditingUserId(null);
  };

  const handleOpenAddUser = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEditUser = (user: User) => {
    setEditingUserId(user.id);
    setFormData({
      name: user.name || "",
      username: user.username,
      contact: user.contact,
      password: "",
      empCode: user.empCode || "",
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    resetForm();
  };

  const handleSaveUser = async () => {
    try {
      if (editingUserId) {
        const data = {
          ...(formData.name && { name: formData.name }),
          ...(formData.username && { username: formData.username }),
          ...(formData.contact && { contact: formData.contact }),
          ...(formData.password && { password: formData.password }),
          ...(formData.empCode && { empCode: formData.empCode }),
        };

        const resp = await userService.updateUser(editingUserId, data);

        if (resp.status === "success") {
          toast.success("User updated successfully");
          setUsers((prev) =>
            prev.map((u) =>
              u.id === editingUserId ? { ...u, ...resp.data } : u
            )
          );
          handleCloseModal();
        } else {
          toast.error(resp.message);
        }
      } else {
        const resp = await userService.createUser(formData);
        if (resp.status === "success") {
          setUsers((prev) => [...prev, resp.data]);
          toast.success("New user added successfully");
          handleCloseModal();
        } else {
          toast.error(resp.message);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Error while saving user");
    }
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
            <div className="modal-dialog" role="document">
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
                          setFormData({ ...formData, username: e.target.value })
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
                          setFormData({ ...formData, contact: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        {editingUserId ? "Change Password" : "Password"}
                      </label>
                      <input
                        type="password"
                        className="form-control"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        {editingUserId ? "Change empCode" : "empCode"}
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.empCode}
                        onChange={(e) =>
                          setFormData({ ...formData, empCode: e.target.value })
                        }
                      />
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

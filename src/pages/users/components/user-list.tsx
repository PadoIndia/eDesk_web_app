import React, { useEffect, useState } from "react";
import userService from "../../../services/api-services/user.service";
import { toast } from "react-toastify";
import { User } from "../../../types/user.types";
import Modal from "../../../components/ui/modals";

const CreateEditUser = React.lazy(() => import("./create-edit-user"));

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

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

  const handleOpenAddUser = () => {
    setEditingUserId(null);
    setShowModal(true);
  };

  const handleEditUser = (id: number) => {
    setEditingUserId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingUserId(null);
  };

  const handleSuccess = () => {
    getUsers();
    handleCloseModal();
  };

  return (
    <div className="p-4">
      <Modal
        isOpen={showModal}
        onClose={handleCloseModal}
        title={`${editingUserId ? "Update" : "Create"} user`}
      >
        <CreateEditUser id={editingUserId} onSuccess={handleSuccess} />
      </Modal>
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
                  onClick={() => handleEditUser(user.id)}
                >
                  Edit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersList;

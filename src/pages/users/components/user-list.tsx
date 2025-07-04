import React, { useEffect, useState } from "react";
import userService from "../../../services/api-services/user.service";
import { toast } from "react-toastify";
import { User } from "../../../types/user.types";
import Modal from "../../../components/ui/modals";
import { FaPlusCircle, FaChevronUp, FaChevronDown } from "react-icons/fa";
import Avatar from "../../../components/avatar";
import { Colors } from "../../../utils/constants";
import { FaPencil } from "react-icons/fa6";

const CreateEditUser = React.lazy(() => import("./create-edit-user"));

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

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

  const handleIdSort = () => {
    if (sortOrder === null || sortOrder === "desc") {
      setSortOrder("asc");
    } else {
      setSortOrder("desc");
    }
  };

  const filteredUsers = users.filter((u) => {
    const query = search.toLowerCase();
    if (u.name?.toLowerCase().includes(query)) return true;
    if (u.contact?.toLowerCase().includes(query)) return true;
    if (u.username?.toLowerCase().includes(query)) return true;
    return false;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    if (sortOrder === "asc") {
      return a.id - b.id;
    } else if (sortOrder === "desc") {
      return b.id - a.id;
    }
    return 0;
  });

  return (
    <div className="p-4">
      <Modal
        showCloseIcon
        closeOnOverlayClick={false}
        isOpen={showModal}
        onClose={handleCloseModal}
        title={`${editingUserId ? "Update" : "Create"} user`}
      >
        <CreateEditUser id={editingUserId} onSuccess={handleSuccess} />
      </Modal>
      <div className="rounded-lg mx-2 bg-white">
        <div className="p-4 d-flex align-items-center justify-content-between">
          <div>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              name="Search"
              placeholder="Search users..."
              className="form-control"
            />
          </div>
          <button
            className="btn btn-primary  d-flex gap-2 align-items-center shadow rounded-pill"
            onClick={handleOpenAddUser}
          >
            <FaPlusCircle />
            Add User
          </button>
        </div>
        <div className="table-responsive rounded-lg px-1">
          <table
            className="table table-hover align-middle"
            style={{ padding: "10px" }}
          >
            <thead className="">
              <tr className="">
                <th
                  className="bg-light py-3 text-center text-muted position-relative"
                  style={{
                    width: "60px",
                    fontSize: "13px",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={handleIdSort}
                >
                  <div className="d-flex align-items-center justify-content-center gap-1">
                    <span>ID</span>
                    <div className="d-flex flex-column sort-chevrons">
                      <FaChevronUp
                        size={8}
                        className={`sort-chevron ${
                          sortOrder === "asc" ? "text-primary" : "text-muted"
                        }`}
                        style={{ marginBottom: "-2px" }}
                      />
                      <FaChevronDown
                        size={8}
                        className={`sort-chevron ${
                          sortOrder === "desc" ? "text-primary" : "text-muted"
                        }`}
                      />
                    </div>
                  </div>
                </th>
                <th
                  className="bg-light py-3 text-muted"
                  style={{ fontSize: "13px" }}
                >
                  Name
                </th>
                <th
                  className="bg-light py-3 text-muted"
                  style={{ fontSize: "13px" }}
                >
                  Contact
                </th>
                <th
                  className="bg-light py-3 text-muted"
                  style={{ fontSize: "13px" }}
                >
                  Departments
                </th>
                <th
                  className="bg-light py-3 text-muted"
                  style={{ fontSize: "13px" }}
                >
                  Teams
                </th>
                <th
                  className="bg-light py-3 text-muted"
                  style={{ fontSize: "13px" }}
                >
                  Status
                </th>
                <th
                  className="bg-light py-3 text-muted"
                  style={{ fontSize: "13px" }}
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="">
              {sortedUsers.map((user) => (
                <tr className="hover-shadow-sm" key={user.id}>
                  <td className="text-center">{user.id}</td>
                  <td className="py-3">
                    <div className="d-flex gap-3">
                      <div>
                        <Avatar
                          bgColor={Colors.BGColorList[3]}
                          fontSize={12}
                          title={user.name || ""}
                          imageUrl={user.profileImg.url}
                        />
                      </div>
                      <div className="d-flex flex-column gap-0">
                        <span className="fw-semibold">
                          {user.name || "N/A"}
                        </span>
                        <small className="">{user.username}</small>
                      </div>
                    </div>
                  </td>
                  <td>{user.contact}</td>
                  <td className="flex-wrap">
                    {user.userDepartment.map((i) => (
                      <span className="badge bg-success-subtle text-success me-1">
                        {i.department.name}
                      </span>
                    ))}
                  </td>

                  <td>
                    {user.userTeam.map((i) => (
                      <span className="badge bg-danger-subtle text-danger me-1">
                        {i.team.name}
                      </span>
                    ))}
                  </td>
                  <td>
                    {user.isActive ? (
                      <span className="badge bg-primary-subtle text-primary">
                        Active
                      </span>
                    ) : (
                      <span className="badge bg-danger-subtle text-danger">
                        Inactive
                      </span>
                    )}
                  </td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary border-primary px-3 rounded-md d-flex align-items-center"
                      onClick={() => handleEditUser(user.id)}
                    >
                      <FaPencil className="me-2" />
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UsersList;

import { FC, lazy, useCallback, useEffect, useState } from "react";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { formatDate } from "../../../utils/helper";
import { DepartmentResponse } from "../../../types/department-team.types";
import { toast } from "react-toastify";
import departmentService from "../../../services/api-services/department.service";
import Modal from "../../../components/ui/modals";
import { SearchBox } from "../../../components/ui/search";

const DepartmentForm = lazy(() => import("./department-form"));

type Props = {
  haveAccess: boolean;
};

const DepartmentTable: FC<Props> = ({ haveAccess }) => {
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchDepartments = useCallback(() => {
    departmentService.getDepartments().then((res) => {
      if (res.status == "success") {
        setDepartments(res.data);
      }
    });
  }, []);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleDeleteDepartment = async (deptId: number) => {
    if (!haveAccess) return;
    if (window.confirm("Are you sure you want to delete this Department?")) {
      departmentService.deleteDepartment(deptId).then((res) => {
        if (res.status === "success") {
          setDepartments(departments.filter((dept) => dept.id !== deptId));
          toast.success(res.message);
        } else toast.error(res.message);
      });
    }
  };

  const handleEditClick = (id: number) => {
    setEditId(id);
    setShowForm(true);
  };

  const handleEditClose = () => {
    setEditId(null);
    setShowForm(false);
  };

  const handleEditSave = () => {
    fetchDepartments();
    handleEditClose();
  };

  const filteredDepts = departments.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Modal
        isOpen={showForm && haveAccess}
        onClose={handleEditClose}
        title="Add New Department"
        size="md"
      >
        <DepartmentForm id={editId} onSuccess={handleEditSave} />
      </Modal>
      <div className="p-3 d-flex align-items-center justify-content-between">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search departments..."
        />
        <button
          onClick={() => setShowForm(true)}
          className="ms-auto btn btn-primary text-light d-flex gap-2 align-items-center shadow rounded-pill"
        >
          <FaPlusCircle />
          Add Department
        </button>
      </div>
      <div className="table-responsive rounded-lg px-3">
        <table
          className="table table-hover align-middle"
          style={{ padding: "10px" }}
        >
          <thead className="table-light">
            <tr className="">
              <th className="text-center text-muted position-relative rounded-tl-lg">
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <span style={{ fontSize: "11px" }}>ID</span>
                </div>
              </th>
              <th className="text-muted" style={{ fontSize: "11px" }}>
                NAME
              </th>
              <th className="text-muted" style={{ fontSize: "11px" }}>
                SLUG
              </th>
              <th className="text-muted" style={{ fontSize: "11px" }}>
                TEAMS
              </th>
              <th
                className={`text-muted ${haveAccess ? "" : "rounded-tr-lg"}`}
                style={{ fontSize: "11px" }}
              >
                CREATED ON
              </th>
              {haveAccess && (
                <th
                  className="text-muted rounded-tr-lg"
                  style={{ fontSize: "11px" }}
                >
                  ACTIONS
                </th>
              )}
            </tr>
          </thead>
          <tbody className="">
            {filteredDepts.length > 0 ? (
              filteredDepts.map((dept) => (
                <tr className="hover-shadow-sm" key={dept.id}>
                  <td className="text-center">{dept.id}</td>
                  <td className="py-3">
                    <div className="d-flex flex-column gap-0">{dept.name}</div>
                  </td>
                  <td>
                    <code
                      className=" text-primary"
                      style={{ fontSize: "12px" }}
                    >
                      {dept.slug}
                    </code>
                  </td>
                  <td className="flex-wrap">
                    {dept.teams.length === 0 ? (
                      <span
                        className="text-muted fst-italic"
                        style={{ fontSize: "13px" }}
                      >
                        No teams
                      </span>
                    ) : (
                      dept.teams.map((team) => (
                        <span
                          key={team.id}
                          className="badge bg-success-subtle text-success me-1"
                        >
                          {team.name}
                        </span>
                      ))
                    )}
                  </td>
                  <td>{formatDate(dept.createdOn)}</td>
                  {haveAccess && (
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary border-primary px-3 rounded-md d-flex align-items-center"
                          onClick={() => handleEditClick(dept.id)}
                        >
                          <FaPencil className="me-2" />
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger border-danger px-3 rounded-md d-flex align-items-center"
                          onClick={() => handleDeleteDepartment(dept.id)}
                        >
                          <FaTrash className="me-2" />
                          Delete
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={6}
                  className="text-center py-4 text-muted fst-italic"
                >
                  No departments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default DepartmentTable;

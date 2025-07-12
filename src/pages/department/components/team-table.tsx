import { FC, lazy, useCallback, useEffect, useState } from "react";
import { FaPlusCircle, FaTrash } from "react-icons/fa";
import { FaPencil } from "react-icons/fa6";
import { formatDate } from "../../../utils/helper";
import { TeamResponse } from "../../../types/department-team.types";
import { toast } from "react-toastify";
import Modal from "../../../components/ui/modals";
import teamService from "../../../services/api-services/team.service";
import { SearchBox } from "../../../components/ui/search";

const TeamForm = lazy(() => import("./team-form"));

type Props = {
  haveAccess: boolean;
};

const TeamTable: FC<Props> = ({ haveAccess }) => {
  const [teams, setTeams] = useState<TeamResponse[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [search, setSearch] = useState("");

  const fetchTeams = useCallback(() => {
    teamService.getTeams().then((res) => {
      if (res.status == "success") {
        setTeams(res.data);
      }
    });
  }, []);

  useEffect(() => {
    fetchTeams();
  }, []);

  const handleDeleteTeam = async (teamId: number) => {
    if (!haveAccess) return;
    if (window.confirm("Are you sure you want to delete this Team?")) {
      teamService.deleteTeam(teamId).then((res) => {
        if (res.status === "success") {
          setTeams(teams.filter((team) => team.id !== teamId));
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
    handleEditClose();
    fetchTeams();
  };

  const filteredTeams = teams.filter((t) =>
    t.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Modal
        isOpen={showForm && haveAccess}
        onClose={handleEditClose}
        title="Add New Team"
        size="md"
      >
        <TeamForm id={editId} onSuccess={handleEditSave} />
      </Modal>

      <div className="p-3 d-flex align-items-center justify-content-between">
        <SearchBox
          value={search}
          onChange={setSearch}
          placeholder="Search teams..."
        />
        <button
          onClick={() => setShowForm(true)}
          className="ms-auto btn btn-primary text-light d-flex gap-2 align-items-center shadow rounded-pill"
        >
          <FaPlusCircle />
          Add Team
        </button>
      </div>
      <div className="table-responsive rounded-lg px-3">
        <table
          className="table table-hover align-middle"
          style={{ padding: "10px" }}
        >
          <thead className="table-light">
            <tr className="">
              <th className="py-3 text-center text-muted position-relative rounded-tl-lg">
                <div className="d-flex align-items-center justify-content-center gap-1">
                  <span style={{ fontSize: "13px" }}>ID</span>
                </div>
              </th>
              <th className="py-3 text-muted" style={{ fontSize: "13px" }}>
                Name
              </th>
              <th className="py-3 text-muted" style={{ fontSize: "13px" }}>
                Slug
              </th>
              <th className="py-3 text-muted" style={{ fontSize: "13px" }}>
                Users
              </th>
              <th
                className={`py-3 text-muted ${
                  haveAccess ? "" : "rounded-tr-lg"
                }`}
                style={{ fontSize: "13px" }}
              >
                Created On
              </th>
              {haveAccess && (
                <th
                  className="py-3 text-muted rounded-tr-lg"
                  style={{ fontSize: "13px" }}
                >
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody className="">
            {filteredTeams.length > 0 ? (
              filteredTeams.map((team) => (
                <tr className="hover-shadow-sm" key={team.id}>
                  <td className="text-center">{team.id}</td>
                  <td className="py-3">
                    <div className="d-flex flex-column gap-0">
                      <span className="fw-semibold">{team.name}</span>
                    </div>
                  </td>
                  <td>
                    <code className="text-muted" style={{ fontSize: "12px" }}>
                      {team.slug}
                    </code>
                  </td>
                  <td className="">{team._count.users}</td>
                  <td>{formatDate(team.createdOn)}</td>
                  {haveAccess && (
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary border-primary px-3 rounded-md d-flex align-items-center"
                          onClick={() => handleEditClick(team.id)}
                        >
                          <FaPencil className="me-2" />
                          Edit
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger border-danger px-3 rounded-md d-flex align-items-center"
                          onClick={() => handleDeleteTeam(team.id)}
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
                  No teams found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default TeamTable;

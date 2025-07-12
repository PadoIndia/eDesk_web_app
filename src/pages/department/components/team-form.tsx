import { FC, useEffect, useState } from "react";
import teamService from "../../../services/api-services/team.service";
import {
  DepartmentResponse,
  TeamPayload,
} from "../../../types/department-team.types";
import { toast } from "react-toastify";
import departmentService from "../../../services/api-services/department.service";
import { FaSave } from "react-icons/fa";
import { generateSlug } from "../../../utils/helper";
import { Spinner } from "../../../components/loading";

type Props = {
  id: number | null;
  onSuccess: () => void;
};

const TeamForm: FC<Props> = ({ id, onSuccess }) => {
  const [data, setData] = useState<TeamPayload>({
    name: "",
    responsibilities: "",
    slug: "",
  });
  const [deptId, setDeptId] = useState<number | null>(null);
  const [departments, setDepartments] = useState<DepartmentResponse[]>([]);
  const [saving, setSaving] = useState(false);

  const handleChange = <T extends keyof TeamPayload>(
    key: T,
    value: TeamPayload[T]
  ) => {
    if (key == "name") {
      setData((d) => ({
        ...d,
        name: value,
        slug: generateSlug(value),
      }));
    }
    setData((d) => ({
      ...d,
      [key]: value,
    }));
  };

  useEffect(() => {
    if (id) {
      teamService.getTeamById(id).then((res) => {
        if (res.status === "success") {
          setData({
            name: res.data.name,
            slug: res.data.slug,
            responsibilities: res.data.responsibilities || "",
          });
          setDeptId(res.data.departmentTeams[0].departmentId);
        }
      });
    }
    departmentService.getDepartments().then((res) => {
      if (res.status === "success") setDepartments(res.data);
    });
  }, []);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      if (!deptId) return toast.error("Department is required");
      if (!data.name) return toast.error("Name is required");
      if (!data.slug) return toast.error("slug is required");

      if (id) {
        const resp = await teamService.updateTeam(id, data);
        if (resp.status === "success") {
          toast.success(resp.message);
          onSuccess();
        } else toast.error(resp.message);
      } else {
        const resp = await teamService.createTeam(data);
        if (resp.status === "success") {
          await departmentService.addTeamToDepartment(deptId, resp.data.id);
          toast.success(resp.message);
          onSuccess();
        } else toast.error(resp.message);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error while saving"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <label className="form-label">
          Department <span className="text-danger">*</span>
        </label>
        <select
          className="form-select"
          value={deptId || ""}
          disabled={!!id || saving}
          onChange={(e) => setDeptId(Number(e.target.value))}
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>
      </div>
      <div className="mb-3">
        <label className="form-label">
          Team Name <span className="text-danger">*</span>
        </label>
        <input
          disabled={saving}
          type="text"
          className="form-control"
          placeholder="e.g., Recruitment"
          value={data.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">
          Slug <span className="text-danger">*</span>
        </label>
        <input
          disabled={saving}
          type="text"
          className="form-control"
          placeholder="e.g., recruitment"
          value={data.slug}
          onChange={(e) => handleChange("slug", e.target.value)}
        />
      </div>
      <div className="mb-3">
        <label className="form-label">Responsibilities</label>
        <textarea
          disabled={saving}
          className="form-control"
          placeholder="Team responsibilities"
          value={data.responsibilities}
          onChange={(e) => handleChange("responsibilities", e.target.value)}
          rows={4}
        />
      </div>
      <div className="d-flex gap-2 justify-content-end">
        {saving && <Spinner />}
        <div>
          <button
            disabled={saving}
            className="btn btn-primary"
            onClick={handleSubmit}
          >
            <FaSave className="me-1" /> {id ? "Update " : "Save "} Team
          </button>
        </div>
      </div>
    </div>
  );
};

export default TeamForm;

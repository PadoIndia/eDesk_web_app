import { FC, useEffect, useState } from "react";
import { TeamPayload as DepartmentPayload } from "../../../types/department-team.types";
import { toast } from "react-toastify";
import departmentService from "../../../services/api-services/department.service";
import { FaSave } from "react-icons/fa";
import { generateSlug } from "../../../utils/helper";
import { Spinner } from "../../../components/loading";

type Props = {
  id: number | null;
  onSuccess: () => void;
};

const DepartmentForm: FC<Props> = ({ id, onSuccess }) => {
  const [data, setData] = useState<DepartmentPayload>({
    name: "",
    responsibilities: "",
    slug: "",
  });
  const [saving, setSaving] = useState(false);

  const handleChange = <T extends keyof DepartmentPayload>(
    key: T,
    value: DepartmentPayload[T]
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
      departmentService.getDepartmentById(id).then((res) => {
        if (res.status === "success") {
          setData({
            name: res.data.name,
            slug: res.data.slug,
            responsibilities: res.data.responsibilities || "",
          });
        }
      });
    }
  }, []);

  const handleSubmit = async () => {
    try {
      setSaving(true);
      if (!data.name) return toast.error("Name is required");
      if (!data.slug) return toast.error("slug is required");
      const promise = id
        ? departmentService.updateDepartment(id, data)
        : departmentService.createDepartment(data);

      const resp = await promise;
      if (resp.status === "success") {
        toast.success(resp.message);
        onSuccess();
      } else toast.error(resp.message);
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
          Department Name <span className="text-danger">*</span>
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
          placeholder="Department responsibilities"
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
            <FaSave className="me-1" /> {id ? "Update " : "Save "} Department
          </button>
        </div>
      </div>
    </div>
  );
};

export default DepartmentForm;

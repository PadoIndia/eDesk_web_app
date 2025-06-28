import React, { useState } from "react";
import {
  CreateLeaveSchemeRequest,
  LeaveScheme,
} from "../../../types/leave.types";

interface LeaveSchemeFormProps {
  scheme: LeaveScheme | null;
  onSave: (scheme: LeaveScheme) => void;
  onCancel: () => void;
}

const LeaveSchemeForm: React.FC<LeaveSchemeFormProps> = ({
  scheme,
  onSave,
  onCancel,
}) => {
  const [formData, setFormData] = useState<CreateLeaveSchemeRequest>({
    name: scheme?.name || "",
    description: scheme?.description || "",
    slug: scheme?.slug || "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim()) {
      alert("Scheme name is required");
      return;
    }

    if (!formData.slug.trim()) {
      alert("Slug is required");
      return;
    }

    onSave({
      ...(scheme || { id: 0, leaveTypesCount: 0, usersCount: 0 }),
      ...formData,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Scheme Name *</label>
        <input
          type="text"
          className="form-control"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
          aria-label="Scheme name"
        />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea
          className="form-control"
          rows={3}
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          aria-label="Scheme description"
        />
      </div>

      <div className="mb-4">
        <label className="form-label">Slug (URL Identifier) *</label>
        <input
          type="text"
          className="form-control"
          value={formData.slug}
          onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
          placeholder="e.g., standard-employee"
          required
          pattern="^[a-z0-9-]+$"
          title="Only lowercase letters, numbers, and hyphens allowed"
          aria-label="Scheme slug"
        />
        <small className="text-muted">
          This will be used in URLs and must be unique (lowercase letters,
          numbers, and hyphens only)
        </small>
      </div>

      <div className="d-flex justify-content-end gap-2">
        <button
          type="button"
          className="btn btn-outline-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button type="submit" className="btn btn-primary">
          Save Changes
        </button>
      </div>
    </form>
  );
};

export default LeaveSchemeForm;

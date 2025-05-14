// components/DetailItem.tsx
import React from "react";
import { DetailItemProps } from "../../types/user.types";

export const DetailItem: React.FC<DetailItemProps> = ({
  icon,
  label,
  value,
  editValue,
  onChange,
  isEditing,
  badgeClass,
}) => (
  <div className="col-12 col-md-6 py-1 px-3">
    <div className="d-flex align-items-center gap-3 p-2 bg-light rounded">
      {icon && <span className="text-primary">{icon}</span>}
      <div className="flex-grow-1">
        <div className="text-muted small">{label}</div>
        {isEditing && editValue !== undefined ? (
          <input
            type="text"
            className="form-control"
            value={editValue}
            onChange={(e) => onChange?.(e.target.value)}
          />
        ) : badgeClass ? (
          <span className={`badge ${badgeClass}`}>{value}</span>
        ) : (
          <div className="fw-semibold">{value}</div>
        )}
      </div>
    </div>
  </div>
);
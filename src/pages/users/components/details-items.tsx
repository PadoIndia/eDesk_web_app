import React from "react";
import { DetailItemProps } from "../../../types/user.types";
import DatePicker from "react-datepicker";

interface ExtendedDetailItemProps extends DetailItemProps {
  inputType?:
    | "text"
    | "email"
    | "number"
    | "tel"
    | "date"
    | "time"
    | "url"
    | "password"
    | "color"
    | "select"
    | "textarea";
  inputProps?: React.InputHTMLAttributes<
    HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  >;
  options?: Array<{ value: string; label: string }>;
  rows?: number;
}

export const DetailItem: React.FC<ExtendedDetailItemProps> = ({
  icon,
  label,
  value,
  editValue,
  onChange,
  isEditing,
  badgeClass,
  inputType = "text",
  inputProps = {},
  options = [],
  rows = 3,
}) => {
  const renderInput = () => {
    switch (inputType) {
      case "select":
        return (
          <select
            className="form-control"
            value={editValue}
            onChange={(e) => onChange?.(e.target.value)}
            {...inputProps}
          >
            <option value="">Select {label}</option>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case "textarea":
        return (
          <textarea
            className="form-control"
            value={editValue}
            onChange={(e) => onChange?.(e.target.value)}
            rows={rows}
            {...inputProps}
          />
        );
      case "date":
        return (
          <DatePicker
            selected={editValue ? new Date(editValue) : new Date()}
            onChange={(date) => onChange?.(date?.toISOString() || "")}
            className="form-control"
            placeholderText="Select date of birth"
            dateFormat="yyyy-MM-dd"
            maxDate={new Date()}
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
            required
          />
        );
      default:
        return (
          <input
            type={inputType}
            className="form-control"
            value={editValue}
            onChange={(e) => onChange?.(e.target.value)}
            {...inputProps}
          />
        );
    }
  };

  return (
    <div className="col-12 col-md-6 py-1 px-3">
      <div className="d-flex align-items-center gap-3 p-2 bg-light rounded">
        {icon && <span className="text-primary">{icon}</span>}
        <div className="flex-grow-1">
          <div className="text-muted small">{label}</div>
          {isEditing ? (
            renderInput()
          ) : badgeClass ? (
            <span className={`badge ${badgeClass}`}>{value}</span>
          ) : (
            <div className="fw-semibold">{value}</div>
          )}
        </div>
      </div>
    </div>
  );
};

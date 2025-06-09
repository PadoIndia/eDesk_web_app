import { memo } from "react";
import Avatar from "../../../components/avatar";
import { User } from "../../../types/user.types";
import { FaCheck } from "react-icons/fa";

type Props = {
  item: User;
  isSelected?: boolean;
  toggleSelection: (item: User) => void;
  isGroupSelection: boolean;
  isAdmin?: boolean;
  onToggleAdmin?: (item: User) => void;
};

const ContactTile = ({
  item,
  isSelected = false,
  toggleSelection,
  isGroupSelection,
  isAdmin = false,
  onToggleAdmin,
}: Props) => {
  return (
    <div
      className={`d-flex align-items-center px-3 py-3 border-bottom cursor-pointer contact-tile ${
        isSelected ? "bg-light" : ""
      }`}
      onClick={() => toggleSelection(item)}
      style={{
        cursor: "pointer",
        borderBottomColor: "#E0E0E0",
        backgroundColor: isSelected ? "#f3f3f3" : "transparent",
      }}
    >
      {/* Avatar */}
      <Avatar
        imageUrl={item.profileImg?.url}
        title={item.name || ""}
        size={33}
      />

      {/* Contact Info */}
      <div className="flex-grow-1 ms-3">
        <div
          className="fw-bold text-dark small mb-1"
          style={{ fontSize: "13px", lineHeight: "14px" }}
        >
          {item.name}
        </div>
        <div
          className="text-muted"
          style={{ fontSize: "12px", lineHeight: "13px" }}
        >
          {item.username}
        </div>
      </div>

      {/* Admin Toggle */}
      {isSelected && onToggleAdmin && (
        <div
          className="d-flex align-items-center me-2"
          onClick={(e) => e.stopPropagation()}
        >
          <small className="text-dark me-2">Admin</small>
          <div className="form-check form-switch">
            <input
              className="form-check-input"
              type="checkbox"
              role="switch"
              checked={isAdmin}
              onChange={(e) => {
                e.stopPropagation();
                onToggleAdmin(item);
              }}
              style={{
                backgroundColor: isAdmin ? "#0A8D48" : "#767577",
                borderColor: isAdmin ? "#0A8D48" : "#767577",
              }}
            />
          </div>
        </div>
      )}

      {/* Selection Indicator */}
      {isGroupSelection && (
        <div className="ms-2">
          {isSelected && <FaCheck className="text-success" />}
        </div>
      )}
    </div>
  );
};

export default memo(ContactTile);

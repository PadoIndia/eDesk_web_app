import React from "react";
import {
  TGender,
  UpdateSelfPayload,
  User,
  UserDetails,
} from "../../../types/user.types.ts";
import { DetailItem } from "./details-items.tsx";
import { FaUser, FaEdit, FaSave, FaTimes } from "react-icons/fa";
import { formatDate, getDetailIcon } from "../../../utils/helper.tsx";
import { GENDERS } from "../../../utils/constants.ts";

interface ProfileSectionProps {
  userData: User;
  userDetails: UserDetails;
  isEditing: boolean;
  draft: UpdateSelfPayload;
  onEditToggle: () => void;
  onDraftChange: React.Dispatch<React.SetStateAction<UpdateSelfPayload>>;
  onSave: () => void;
  onCancel: () => void;
}

export const ProfileSection: React.FC<ProfileSectionProps> = ({
  userData,
  userDetails,
  isEditing,
  draft,
  onEditToggle,
  onDraftChange,
  onSave,
  onCancel,
}) => (
  <div className="card shadow mb-4">
    <div className="card-header bg-primary text-white p-3 d-flex justify-content-between align-items-center">
      <h3 className="mb-0 d-flex align-items-center gap-3">
        <FaUser className="me-2" />
        User Details
      </h3>
    </div>

    <div className="card-body p-5">
      <div className="row align-items-center">
        {/* Profile Image Section */}
        <div className="col-12 col-md-4 mb-4 mb-md-0 text-center">
          <div className="text-center">
            {userData.profileImg?.url ? (
              <img
                src={userData.profileImg.url}
                alt="Profile"
                className="rounded-circle mb-3"
                style={{ width: "200px", height: "200px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                style={{
                  width: "200px",
                  height: "200px",
                  backgroundColor: "#FFF3DC",
                  fontSize: "3rem",
                }}
              >
                {(userData.name || "User")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </div>
            )}
          </div>
          <h5 className="text-center">{userData.name}</h5>

          <button
            className="btn btn-primary w-50 mt-2"
            onClick={onEditToggle}
            disabled={isEditing}
          >
            <FaEdit className="me-2" /> Edit Details
          </button>
        </div>

        {/* Details Section */}
        <div className="col-12 col-md-8">
          <div className="row g-3">
            <DetailItem
              icon={getDetailIcon("Name")}
              label="Full Name"
              value={isEditing ? undefined : userData.name || undefined}
              editValue={draft.name}
              onChange={(val) => onDraftChange({ ...draft, name: val || "" })}
              isEditing={isEditing}
            />
            <DetailItem
              icon={getDetailIcon("Date of Birth")}
              label="Date of Birth"
              inputType="date"
              isEditing={isEditing}
              value={formatDate(userDetails?.dob || "")}
              onChange={(e) => onDraftChange((prev) => ({ ...prev, dob: e }))}
            />
            <DetailItem
              icon={getDetailIcon("Gender")}
              label="Gender"
              inputType="select"
              options={Object.create(GENDERS)}
              value={userDetails?.gender}
              onChange={(e) =>
                onDraftChange((prev) => ({ ...prev, gender: e as TGender }))
              }
              isEditing={isEditing}
            />
            <DetailItem
              icon={getDetailIcon("Joining Date")}
              label="Joining Date"
              value={userDetails?.joiningDate}
            />
            <DetailItem
              label="Status"
              value={userData.status || undefined}
              badgeClass={
                userData.status === "Active" ? "bg-success" : "bg-danger"
              }
            />
            <DetailItem label="Weekly Off" value={userDetails?.weekoff} />
            <DetailItem
              label="Leave Scheme"
              value={userDetails?.leaveSchemeId?.toString()}
            />
          </div>

          {isEditing && (
            <div className="mt-4">
              <button className="btn btn-success me-2" onClick={onSave}>
                <FaSave /> Save
              </button>
              <button className="btn btn-secondary" onClick={onCancel}>
                <FaTimes /> Cancel
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  </div>
);

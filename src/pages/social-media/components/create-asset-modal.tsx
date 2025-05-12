"use client";

import type React from "react";

import { useState } from "react";
import { SmAssetPayload } from "../../../types/sm-asset.types";
import Modal from "../../../components/ui/modals";

interface Manager {
  id: number;
  name: string;
}

interface CreateAssetModalProps {
  show: boolean;
  onHide: () => void;
  managers: Manager[];
  loading?: boolean;
  onSave: (data: SmAssetPayload) => void;
}

// Platform options
const platformOptions = [
  "Twitter",
  "Facebook",
  "Instagram",
  "LinkedIn",
  "YouTube",
  "TikTok",
  "Pinterest",
  "Snapchat",
  "Other",
];

export default function CreateAssetModal({
  show,
  onHide,
  managers,
  loading = false,
  onSave,
}: CreateAssetModalProps) {
  const [formData, setFormData] = useState<SmAssetPayload>({
    channelName: "",
    channelUrl: "",
    platform: "",
    managedById: 0,
  });

  const [errors, setErrors] = useState({
    channelName: "",
    channelUrl: "",
    platform: "",
    managedById: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "managedById" ? Number.parseInt(value) : value,
    });

    // Clear error when field is edited
    if (errors[name as keyof typeof errors]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  // Validate form
  const validateForm = () => {
    let valid = true;
    const newErrors = {
      channelName: "",
      channelUrl: "",
      platform: "",
      managedById: "",
    };

    if (!formData.channelName.trim()) {
      newErrors.channelName = "Channel name is required";
      valid = false;
    }

    if (!formData.channelUrl.trim()) {
      newErrors.channelUrl = "Channel URL is required";
      valid = false;
    } else if (!isValidUrl(formData.channelUrl)) {
      newErrors.channelUrl = "Please enter a valid URL";
      valid = false;
    }

    if (!formData.platform.trim()) {
      newErrors.platform = "Platform is required";
      valid = false;
    }

    if (formData.managedById === 0) {
      newErrors.managedById = "Please select a manager";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Check if URL is valid
  const isValidUrl = (url: string) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        onSave(formData);
      } catch (error) {
        console.error("Error creating asset:", error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <Modal
      isOpen={show}
      onClose={onHide}
      title="Add New Social Media Channel"
      showCloseIcon
    >
      <form onSubmit={handleSubmit}>
        <div className="modal-body">
          <div className="mb-3">
            <label htmlFor="channelName" className="form-label">
              Channel Name*
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.channelName ? "is-invalid" : ""
              }`}
              id="channelName"
              name="channelName"
              value={formData.channelName}
              onChange={handleChange}
              placeholder="e.g., Company Twitter"
              disabled={isSubmitting}
            />
            {errors.channelName && (
              <div className="invalid-feedback">{errors.channelName}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="platform" className="form-label">
              Platform*
            </label>
            <select
              className={`form-select ${errors.platform ? "is-invalid" : ""}`}
              id="platform"
              name="platform"
              value={formData.platform}
              onChange={handleChange}
              disabled={isSubmitting}
            >
              <option value="">Select Platform</option>
              {platformOptions.map((platform) => (
                <option key={platform} value={platform}>
                  {platform}
                </option>
              ))}
            </select>
            {errors.platform && (
              <div className="invalid-feedback">{errors.platform}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="channelUrl" className="form-label">
              Channel URL*
            </label>
            <input
              type="text"
              className={`form-control ${
                errors.channelUrl ? "is-invalid" : ""
              }`}
              id="channelUrl"
              name="channelUrl"
              value={formData.channelUrl}
              onChange={handleChange}
              placeholder="https://..."
              disabled={isSubmitting}
            />
            {errors.channelUrl && (
              <div className="invalid-feedback">{errors.channelUrl}</div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="managedById" className="form-label">
              Managed By*
            </label>
            {loading ? (
              <div className="d-flex align-items-center my-2">
                <div
                  className="spinner-border spinner-border-sm text-primary me-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading managers...</span>
                </div>
                <span className="text-muted">Loading managers...</span>
              </div>
            ) : (
              <>
                <select
                  className={`form-select ${
                    errors.managedById ? "is-invalid" : ""
                  }`}
                  id="managedById"
                  name="managedById"
                  value={formData.managedById}
                  onChange={handleChange}
                  disabled={isSubmitting || loading || managers.length === 0}
                >
                  <option value={0}>Select Manager</option>
                  {managers.map((manager) => (
                    <option key={manager.id} value={manager.id}>
                      {manager.name}
                    </option>
                  ))}
                </select>
                {managers.length === 0 && !loading && (
                  <div className="text-danger mt-1 small">
                    No managers available. Please add managers first.
                  </div>
                )}
                {errors.managedById && (
                  <div className="invalid-feedback">{errors.managedById}</div>
                )}
              </>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={onHide}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting || loading || managers.length === 0}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm me-2"
                  role="status"
                  aria-hidden="true"
                ></span>
                Creating...
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-1"></i> Create Channel
              </>
            )}
          </button>
        </div>
      </form>
    </Modal>
  );
}

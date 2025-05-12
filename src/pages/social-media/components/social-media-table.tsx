"use client";

import { SmAssetResponse } from "../../../types/sm-asset.types";

interface SocialMediaTableProps {
  assets: SmAssetResponse[];
  onEdit: (asset: SmAssetResponse) => void;
  onDelete: (id: number) => void;
  getManagerName: (id: number) => string;
}

export default function SocialMediaTable({
  assets,
  onEdit,
  onDelete,
  getManagerName,
}: SocialMediaTableProps) {
  // Function to get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "bi-twitter";
      case "facebook":
        return "bi-facebook";
      case "instagram":
        return "bi-instagram";
      case "linkedin":
        return "bi-linkedin";
      case "youtube":
        return "bi-youtube";
      case "tiktok":
        return "bi-tiktok";
      default:
        return "bi-globe";
    }
  };

  // Function to get platform color class
  const getPlatformColorClass = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "twitter":
        return "platform-twitter";
      case "facebook":
        return "platform-facebook";
      case "instagram":
        return "platform-instagram";
      case "linkedin":
        return "platform-linkedin";
      case "youtube":
        return "platform-youtube";
      case "tiktok":
        return "platform-tiktok";
      default:
        return "platform-other";
    }
  };

  return (
    <div className="table-responsive">
      {assets.length === 0 ? (
        <div className="alert alert-info">
          No social media assets found. Click "Add New Channel" to create one.
        </div>
      ) : (
        <table className="table table-hover social-media-table">
          <thead>
            <tr>
              <th>Channel Name</th>
              <th>Platform</th>
              <th>Channel URL</th>
              <th>Managed By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => (
              <tr key={asset.id}>
                <td className="channel-name">{asset.channelName}</td>
                <td>
                  <span
                    className={`platform-badge ${getPlatformColorClass(
                      asset.platform
                    )}`}
                  >
                    <i
                      className={`bi ${getPlatformIcon(asset.platform)} me-1`}
                    ></i>
                    {asset.platform}
                  </span>
                </td>
                <td className="channel-url">
                  <a
                    href={asset.channelUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {asset.channelUrl}
                  </a>
                </td>
                <td>{getManagerName(asset.managedById)}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="btn btn-sm btn-outline-primary me-2"
                      onClick={() => onEdit(asset)}
                    >
                      <i className="bi bi-pencil-square"></i> Edit
                    </button>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => onDelete(asset.id)}
                    >
                      <i className="bi bi-trash"></i> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

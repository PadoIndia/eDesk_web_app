import React, { useState } from "react";
import { VideoFile } from "../../../types/video.types";
import { LuCirclePlay, LuRotateCcw, LuTrash2 } from "react-icons/lu";
import { useAppDispatch } from "../../../store/store";
import { removeVideo } from "../../../features/video.slice";

interface VideoTileProps {
  video: VideoFile;
  onActionClick: (
    action: "cancel" | "pause" | "resume",
    video: VideoFile
  ) => void;
}

const UploadVideoTile: React.FC<VideoTileProps> = ({
  video,
  onActionClick,
}) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const dispatch = useAppDispatch();

  const formatSize = (bytes: number): string => {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusColorClass = (): string => {
    switch (video.status) {
      case "paused":
        return "badge bg-secondary";
      case "uploading":
        return "badge bg-primary";
      case "uploaded":
        return "badge bg-success";
      case "processing":
        return "badge bg-warning text-dark";
      case "failed":
        return "badge bg-danger";
      case "queued":
        return "badge bg-info text-dark";
      default:
        return "badge bg-secondary";
    }
  };

  const isPaused = video.status === "paused";
  const isUploading = video.status === "uploading";
  const isFailed = video.status === "failed";
  const showProgress = ["uploading", "paused", "processing"].includes(
    video.status
  );

  const onRemoveVideo = () => {
    URL.revokeObjectURL(video.thumbnailUrl);
    dispatch(removeVideo(video.id));
    setShowDeleteDialog(false);
  };

  return (
    <>
      <div className="d-flex align-items-center border rounded p-3 mb-3 shadow-sm">
        {/* Thumbnail */}
        <div
          className="flex-shrink-0 me-3"
          style={{ width: "96px", height: "64px" }}
        >
          <div className="bg-secondary rounded overflow-hidden position-relative w-100 h-100 d-flex justify-content-center align-items-center">
            {video.thumbnailUrl ? (
              <>
                <video
                  src={video.thumbnailUrl}
                  className="w-100 h-100 object-fit-cover"
                />
                <LuCirclePlay
                  className="position-absolute text-white"
                  size={24}
                />
              </>
            ) : (
              <LuCirclePlay className="text-light" size={24} />
            )}
          </div>
        </div>

        {/* Info */}
        <div className="flex-grow-1">
          <div className="d-flex align-items-center mb-1">
            <h6 className="mb-0 text-truncate flex-grow-1">{video.name}</h6>
            <span className={`${getStatusColorClass()} ms-2`}>
              {video.status.charAt(0).toUpperCase() + video.status.slice(1)}
            </span>
          </div>

          {showProgress ? (
            <>
              <div className="small text-muted">
                {formatSize(video.uploadedSize)} / {formatSize(video.size)}
              </div>
              <div className="progress mt-1" style={{ height: "6px" }}>
                <div
                  className="progress-bar"
                  role="progressbar"
                  style={{ width: `${video.progress}%` }}
                  aria-valuenow={video.progress}
                  aria-valuemin={0}
                  aria-valuemax={100}
                ></div>
              </div>
              <div className="small text-muted mt-1">{video.progress}%</div>
            </>
          ) : (
            <div className="small text-muted">{formatSize(video.size)}</div>
          )}
        </div>

        {/* Actions */}
        <div className="ms-3 d-flex align-items-center gap-2">
          {(video.status === "failed" || video.status === "processing") && (
            <button
              onClick={() => onActionClick("resume", video)}
              className="btn btn-sm btn-outline-primary rounded-circle"
              title="Retry"
            >
              <LuRotateCcw size={18} />
            </button>
          )}

          {(isPaused || isUploading) && (
            <button
              onClick={() =>
                onActionClick(isPaused ? "resume" : "pause", video)
              }
              className="btn btn-sm btn-outline-primary rounded-circle"
              title={isPaused ? "Resume" : "Pause"}
            >
              {isPaused ? (
                <i className="bi bi-play-fill" />
              ) : (
                <i className="bi bi-pause-fill" />
              )}
            </button>
          )}

          {(isPaused || isFailed) && (
            <button
              onClick={() => setShowDeleteDialog(true)}
              className="btn btn-sm btn-outline-danger rounded-circle"
              title="Delete"
            >
              <LuTrash2 size={18} />
            </button>
          )}
        </div>
      </div>

      {/* Modal */}
      {showDeleteDialog && (
        <div className="modal d-block" tabIndex={-1} role="dialog">
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Delete Video</h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setShowDeleteDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  Are you sure you want to delete <strong>{video.name}</strong>?
                  This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteDialog(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={onRemoveVideo}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default UploadVideoTile;

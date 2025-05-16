import { useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { VideoFile, VideoStatus } from "../../../types/video.types";
import uploadService from "../../../services/upload/upload.service";
import { updateStatus, removeCompleted } from "../../../features/video.slice";
import UploadVideoTile from "./upload-video-tile";

const VideoUploadList = () => {
  const videos = useAppSelector((state) => state.video.videos);
  const dispatch = useAppDispatch();
  const [activeTab, setActiveTab] = useState<"all" | VideoStatus>("all");
  const [showModal, setShowModal] = useState(false);

  const handleAction = async (
    action: "pause" | "resume" | "cancel",
    video: VideoFile
  ) => {
    try {
      if (action === "pause") {
        await uploadService.pause(video);
        dispatch(updateStatus({ id: video.id, status: "paused" }));
      } else {
        await uploadService.retryOrResume(video);
        dispatch(updateStatus({ id: video.id, status: "uploading" }));
      }
    } catch {
      dispatch(updateStatus({ id: video.id, status: "failed" }));
    }
  };

  const statusCounts = {
    all: videos.length,
    processing: videos.filter((v) => v.status === "processing").length,
    uploading: videos.filter((v) => v.status === "uploading").length,
    paused: videos.filter((v) => v.status === "paused").length,
    uploaded: videos.filter((v) => v.status === "uploaded").length,
    failed: videos.filter((v) => v.status === "failed").length,
    queued: videos.filter((v) => v.status === "queued").length,
  };

  const filteredVideos =
    activeTab === "all" ? videos : videos.filter((v) => v.status === activeTab);

  return (
    <div>
      <ul className="nav nav-tabs mb-3">
        {Object.entries(statusCounts).map(([status, count]) => (
          <li className="nav-item" key={status}>
            <button
              className={`nav-link ${activeTab === status ? "active" : ""}`}
              onClick={() => setActiveTab(status as VideoStatus)}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)} ({count})
            </button>
          </li>
        ))}
      </ul>

      <div className="text-end mb-3">
        <button
          className="btn btn-outline-danger"
          onClick={() => setShowModal(true)}
        >
          Clear Uploaded
        </button>
      </div>

      {filteredVideos.length === 0 ? (
        <div className="alert alert-info">
          No videos found for selected tab.
        </div>
      ) : (
        filteredVideos.map((video) => (
          <UploadVideoTile
            key={video.id}
            video={video}
            onActionClick={handleAction}
          />
        ))
      )}

      {/* Modal */}
      {showModal && (
        <div
          className="modal fade show d-block"
          tabIndex={-1}
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Clear Uploaded Videos</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                />
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete all uploaded videos?</p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-outline-danger"
                  onClick={() => {
                    dispatch(removeCompleted());
                    setShowModal(false);
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUploadList;

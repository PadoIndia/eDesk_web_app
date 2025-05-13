import { LuShare2, LuPencil, LuClock } from "react-icons/lu";
import { SingleVideoResponse } from "../../../types/video.types";
import { formatMiliSeconds } from "../../../utils/helper";
import { GrView } from "react-icons/gr";
import DurationsModal from "./durations-modal";
import { useState } from "react";

type Props = {
  videoInfo: SingleVideoResponse;
};

export default function VideoInfo({ videoInfo }: Props) {
  const [showModal, setShowModal] = useState(false);
  return (
    <div className="video-info">
      <DurationsModal
        data={videoInfo.videoViewDurations}
        onClose={() => setShowModal(false)}
        show={showModal}
      />
      <h1 className="video-title">{videoInfo?.name}</h1>
      <div className="video-meta">
        <span className="d-flex align-items-center">
          <LuClock className="icon" />
          {formatMiliSeconds(videoInfo?.durationInSec)}
        </span>
        <span
          className="d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <GrView />
          See views
        </span>
        <span>Conference</span>
        <span>{new Date(videoInfo?.createdOn).getDate()}</span>
      </div>
      <div className="action-buttons">
        <button className="btn btn-primary d-flex align-items-center">
          <LuShare2 className="icon" />
          Share
        </button>
        <button className="btn btn-light d-flex align-items-center">
          <LuPencil className="icon" />
          Edit Metadata
        </button>
      </div>

      <div>
        <h3 className="metadata-label">Description</h3>
        <p className="text-muted">{videoInfo?.comment}</p>
      </div>
    </div>
  );
}

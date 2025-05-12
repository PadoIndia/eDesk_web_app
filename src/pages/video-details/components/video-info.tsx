import { LuShare2, LuPencil, LuClock } from "react-icons/lu";
import { SingleVideoResponse } from "../../../types/video.types";
import ViewersButton from "./viewers-button";
import { formatSeconds } from "../../../utils/helper";

type Props = {
  videoInfo: SingleVideoResponse;
};

export default function VideoInfo({ videoInfo }: Props) {
  return (
    <div className="video-info">
      <h1 className="video-title">{videoInfo?.name}</h1>
      <div className="video-meta">
        <span className="d-flex align-items-center">
          <LuClock className="icon" />
          {formatSeconds(videoInfo?.durationInSec)}
        </span>
        <ViewersButton videoId={videoInfo.id} viewCount={245} />
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
      <div className="mb-3">
        <h3 className="metadata-label">Timestamps</h3>
        <div className="timestamp-buttons">
          {videoInfo?.timestamps.map((timestamp) => (
            <button className="btn btn-sm btn-light">
              {timestamp.timeInSec} - {timestamp.comment}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="metadata-label">Description</h3>
        <p className="text-muted">{videoInfo?.comment}</p>
      </div>
    </div>
  );
}

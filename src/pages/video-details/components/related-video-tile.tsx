import React from "react";
import styles from "./related-video.module.scss";
import { VideoResponse } from "../../../types/video.types";
import { formatMiliSeconds } from "../../../utils/helper";
import { Badge } from "../../../components/ui/badge";
import { useNavigate } from "react-router-dom";

type VideoTileProps = {
  video: VideoResponse;
};

const RelatedVideoTile: React.FC<VideoTileProps> = ({ video }) => {
  const navigate = useNavigate();
  return (
    <div
      style={{ cursor: "pointer" }}
      onClick={() => navigate(`/videos/${video.id}`)}
      className={`d-flex align-items-start ${styles.videoTile}`}
    >
      {/* Thumbnail */}
      <div className={`position-relative ${styles.thumbnail}`}>
        <img
          src={video.thumbnailLr}
          alt={video.name}
          className="img-fluid rounded"
        />
        <span
          className={`badge bg-dark position-absolute bottom-0 end-0 m-1 ${styles.duration}`}
        >
          {formatMiliSeconds(video.durationInSec)}
        </span>
      </div>

      {/* Details */}
      <div className={`ms-3 ${styles.videoDetails}`}>
        <h6 className={`mb-1 text-truncate ${styles.title}`}>{video.name}</h6>
        <div className="text-muted small">
          <Badge variant="primary">{video.event.eventName}</Badge>
        </div>
        <div className="text-muted small">
          Created on: {new Date(video.createdOn).toDateString()}
        </div>
      </div>
    </div>
  );
};

export default RelatedVideoTile;

import React from "react";
import "./styles.css";
import { IoShareSocialOutline } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";
import { VideoResponse } from "../../../../types/video.types";
import { formatMiliSeconds } from "../../../../utils/helper";

const VideoCard: React.FC<VideoResponse> = ({
  id,
  name,
  durationInSec,
  thumbnailLr,
}) => {
  return (
    <div
      className="video-card col-xl-2 col-md-4 col-lg-3 col-12 p-0"
      style={{ minWidth: "20rem" }}
    >
      <a href={`/videos/${id}`} className="video-card-link">
        <div className="video-card-image">
          <img src={thumbnailLr} alt={name} />
          <div className="video-card-duration">
            {formatMiliSeconds(durationInSec)}
          </div>
        </div>
      </a>
      <div className="video-card-body">
        <h3 className="video-card-title">{name}</h3>
        <div className="video-card-meta">
          {/* <div className="video-card-category">{category}</div> */}
          <div className="video-card-views">{0} views</div>
        </div>

        <div className="video-card-actions">
          <div className="action-button">
            <IoShareSocialOutline size={18} />
            <span>Share</span>
          </div>
          <div className="action-button">
            <HiOutlineDocumentText size={18} />
            <span>Open Logs</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;

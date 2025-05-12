import React from "react";
import "./styles.css";
import { IoShareSocialOutline } from "react-icons/io5";
import { HiOutlineDocumentText } from "react-icons/hi";
import { VideoResponse } from "../../../../types/video.types";
import { formatSeconds } from "../../../../utils/helper";

const VideoCard: React.FC<VideoResponse> = ({
  id,
  name,
  durationInSec,
  thumbnailLr,
}) => {
  return (
    <div className="video-card">
      <a href={`/videos/${id}`} className="video-card-link">
        <div className="video-card-image">
          <img src={thumbnailLr} alt={name} />
          <div className="video-card-duration">
            {formatSeconds(durationInSec)}
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

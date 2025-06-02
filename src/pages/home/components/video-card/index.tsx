import React, { useEffect, useState } from "react";
import "./styles.css";
import {
  VideoResponse,
  VideoViewDuration,
} from "../../../../types/video.types";
import { formatMiliSeconds, getShortDate } from "../../../../utils/helper";
import { Badge } from "../../../../components/ui/badge";
import DurationsModal from "../../../video-details/components/durations-modal";
import videoService from "../../../../services/api-services/video.service";
import { toast } from "react-toastify";

type Props = VideoResponse & {
  hideMeta?: boolean;
};

const VideoCard: React.FC<Props> = ({
  id,
  name,
  durationInSec,
  thumbnailLr,
  hideMeta,
  videoViewDurations,
  createdOn,
}) => {
  const [views, setViews] = useState<VideoViewDuration[]>([]);
  const [showModal, setShowModal] = useState(false);

  const uniqueViews = videoViewDurations.reduce(
    (
      acc: { id: number; userId: number }[],
      curr: { id: number; userId: number }
    ) => {
      if (!acc.some((view) => view.userId === curr.userId)) {
        acc.push(curr);
      }
      return acc;
    },
    []
  ) as { id: number; userId: number }[];

  useEffect(() => {
    if (showModal && videoViewDurations.length > 0) {
      videoService.getVideoById(id).then((res) => {
        if (res.status === "success") {
          setViews(res.data.videoViewDurations);
        } else {
          toast.error(res.message);
        }
      });
    }
  }, [showModal]);

  return (
    <div
      className="video-card col-xl-2 col-md-4 col-lg-3 col-12 p-0"
      style={{ minWidth: "20rem" }}
    >
      <DurationsModal
        data={views}
        onClose={() => setShowModal(false)}
        show={showModal}
      />
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
        {!hideMeta && (
          <>
            <div className="video-card-meta">
              <div className="video-card-views d-flex justify-content-between w-100">
                <Badge>{getShortDate(createdOn)}</Badge>{" "}
              </div>
            </div>
            <div
              className="video-card-views font-sm"
              onClick={() => setShowModal(true)}
            >
              Viewed by {uniqueViews.length} users
            </div>

            {/* <div className="video-card-actions">
              <div className="action-button">
                <IoShareSocialOutline size={18} />
                <span>Share</span>
              </div>
              <div className="action-button">
                <HiOutlineDocumentText size={18} />
                <span>Open Logs</span>
              </div>
            </div> */}
          </>
        )}
      </div>
    </div>
  );
};

export default VideoCard;

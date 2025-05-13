import { LuArrowLeft } from "react-icons/lu";
import VideoPlayer, { VideoPlayerRef } from "./components/video-player";
import VideoInfo from "./components/video-info";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import { SingleVideoResponse, TimestampPayload } from "../../types/video.types";
import videoService from "../../services/api-services/video.service";
import { formatSeconds } from "../../utils/helper";
import "./styles.css";

export default function VideoPage() {
  const { id } = useParams();

  const [vidDetails, setVidDetails] = useState<SingleVideoResponse>();
  const videoRef = useRef<VideoPlayerRef>(null);
  const navigate = useNavigate();

  const fetchVidDetails = () => {
    if (id)
      videoService.getVideoById(+id).then((res) => {
        if (res.status === "success") setVidDetails(res.data);
      });
  };

  useEffect(() => {
    fetchVidDetails();
  }, [id]);

  const addTimeStamp = useCallback(
    (data: TimestampPayload) => {
      if (id) {
        videoService.addTimestamp(Number(id), data).then((res) => {
          if (res.status === "success") {
            fetchVidDetails();
          }
        });
      }
    },
    [id]
  );

  if (!vidDetails) return <div>Loading</div>;
  return (
    <div>
      <div className="video-container">
        <div className="mb-3">
          <a onClick={() => navigate(-1)} className="back-link">
            <LuArrowLeft className="icon" />
            Back to videos
          </a>
        </div>

        <div className="row">
          <div className="col-lg-9">
            <div className="card">
              <VideoPlayer
                ref={videoRef}
                timestamps={vidDetails.timestamps}
                id={Number(id)}
                addTimeStamp={addTimeStamp}
                poster={vidDetails.thumbnailLr || ""}
                src={`https://${vidDetails.clientId}.gvideo.io/videos/${vidDetails.clientId}_${vidDetails.slug}/master.m3u8`}
              />
              <VideoInfo videoInfo={vidDetails} />
            </div>
          </div>
          <div className="col-lg-2 card p-3">
            <h5>Timestamps</h5>
            <div className="my-2">
              {vidDetails.timestamps.map((timestmp) => (
                <div className="d-flex gap-2 my-2">
                  <a
                    className="font-sm"
                    onClick={() => videoRef.current?.seekTo(timestmp.timeInSec)}
                  >
                    {formatSeconds(timestmp.timeInSec)}
                  </a>
                  <span className="font-sm">{timestmp.comment}</span>
                </div>
              ))}
            </div>
          </div>

          {/* <div className="col-lg-3">
            <VideoSidebar vidDetails={vidDetails} />
          </div> */}
        </div>
      </div>
    </div>
  );
}

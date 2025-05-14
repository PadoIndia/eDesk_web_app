import { LuArrowLeft } from "react-icons/lu";
import VideoPlayer, { VideoPlayerRef } from "./components/video-player";
import VideoInfo from "./components/video-info";
import { useNavigate, useParams } from "react-router-dom";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  SingleVideoResponse,
  TimestampPayload,
  VideoResponse,
} from "../../types/video.types";
import videoService from "../../services/api-services/video.service";
import { formatSeconds } from "../../utils/helper";
import "./styles.css";
import VideoCard from "../../components/ui/cards/video-card";

export default function VideoPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const videoRef = useRef<VideoPlayerRef>(null);

  const [vidDetails, setVidDetails] = useState<SingleVideoResponse | null>(
    null
  );
  const [relatedVideos, setRelatedVideos] = useState<VideoResponse[]>([]);

  const fetchVidDetails = useCallback(() => {
    if (id) {
      videoService.getVideoById(+id).then((res) => {
        if (res.status === "success") {
          setVidDetails(res.data);

          if (res.data.eventId) {
            videoService
              .getAllVideos({
                params: {
                  eventId: res.data.eventId,
                  limit: 30,
                },
              })
              .then((res) => {
                if (res.status === "success") {
                  setRelatedVideos(res.data.filter((v) => v.id !== Number(id)));
                }
              });
          }
        }
      });
    }
  }, [id]);

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
    [id, fetchVidDetails]
  );

  if (!vidDetails) return <div>Loading...</div>;

  return (
    <div>
      <div className="container">
        <div className="mb-3">
          <a onClick={() => navigate(-1)} className="back-link">
            <LuArrowLeft className="icon" />
            Back to videos
          </a>
        </div>

        <div className="row gap-2">
          <div className="col-lg-8 p-0">
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

          <div className="col-lg-3 card p-3">
            <h5>Timestamps</h5>
            <div className="my-2">
              {vidDetails.timestamps.map((timestmp) => (
                <div className="d-flex gap-2 my-2" key={timestmp.id}>
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

          {/* Related Videos Carousel */}
          <div className="mt-2 col-11 card p-3">
            <h4>Related Videos</h4>
            <div className="my-3">
              {relatedVideos.length > 0 ? (
                <div
                  className="d-flex gap-3"
                  style={{
                    overflowX: "scroll",
                    maxWidth: "100%",
                  }}
                >
                  {relatedVideos.map((video) => (
                    <VideoCard key={video.id} hideMeta {...video} />
                  ))}
                </div>
              ) : (
                <p>No related videos available</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

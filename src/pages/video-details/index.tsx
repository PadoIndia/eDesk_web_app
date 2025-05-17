import VideoPlayer from "./components/video-player";
import VideoInfo from "./components/video-info";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
  SingleVideoResponse,
  TimestampPayload,
  TimestampResponse,
  VideoResponse,
} from "../../types/video.types";
import videoService from "../../services/api-services/video.service";
import RelatedVideoTile from "./components/related-video-tile";
import "./styles.css";
import { toast } from "react-toastify";

export default function VideoPage() {
  const { id } = useParams();
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
      if (id && vidDetails) {
        const time = data.timeInSec;
        const existsWithTime = vidDetails.timestamps.find(
          (i) => i.timeInSec === time
        );
        if (existsWithTime)
          return toast.error("A timestamp for this time already exists");
        if (time < 0 || time > vidDetails.durationInSec)
          return toast.error(
            `Timestamp must be between 0 and ${vidDetails.durationInSec} seconds`
          );

        videoService.addTimestamp(Number(id), data).then((res) => {
          if (res.status === "success") {
            fetchVidDetails();
          }
        });
      }
    },
    [id, fetchVidDetails, vidDetails]
  );

  const updateTimeStamp = useCallback(
    (data: TimestampResponse) => {
      if (id && vidDetails) {
        videoService
          .updateTimestamp(Number(id), data.id, {
            comment:
              data.comment ||
              `Timestamp-${(vidDetails?.timestamps.length || 0) + 1}`,
            timeInSec: data.timeInSec,
          })
          .then((res) => {
            if (res.status === "success") {
              fetchVidDetails();
            }
          });
      }
    },
    [id, fetchVidDetails, vidDetails]
  );
  const deleteTimestamp = useCallback(
    (timeStampId: number) => {
      if (id) {
        videoService.deleteTimestamp(Number(id), timeStampId).then((res) => {
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
    <div className="mt-4 bg-white p-3">
      <div className="container mx-auto">
        <div className="row justify-content-between">
          <div className="col-lg-8 p-0">
            <div className="card">
              <VideoPlayer
                timestamps={vidDetails.timestamps}
                id={Number(id)}
                addTimeStamp={addTimeStamp}
                updateTimeStamp={updateTimeStamp}
                deleteTimestamp={deleteTimestamp}
                poster={vidDetails.thumbnailLr || ""}
                src={`https://${vidDetails.clientId}.gvideo.io/videos/${vidDetails.clientId}_${vidDetails.slug}/master.m3u8`}
              />
              <VideoInfo videoInfo={vidDetails} />
            </div>
          </div>

          <div className="col-lg-4">
            <h5 className="mb-4 mt-1">Related Videos</h5>
            <div className="my-2">
              {relatedVideos.length > 0 ? (
                <div
                  style={{
                    maxHeight: "100vh",
                    overflowY: "scroll",
                  }}
                >
                  {relatedVideos.map((video) => (
                    <RelatedVideoTile key={video.id} video={video} />
                  ))}
                </div>
              ) : (
                <p>No related videos available</p>
              )}
            </div>
          </div>

          {/* Related Videos Carousel */}
          {/* <div className="mt-2 col-11 card p-3">
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
          </div> */}
        </div>
      </div>
    </div>
  );
}

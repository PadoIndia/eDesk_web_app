import VideoPlayer from "./components/video-player";
import VideoInfo from "./components/video-info";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { SingleVideoResponse, VideoResponse } from "../../types/video.types";
import videoService from "../../services/api-services/video.service";
import RelatedVideoTile from "./components/related-video-tile";
import "./styles.css";

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
                  limit: 400,
                },
              })
              .then((res) => {
                if (res.status === "success") {
                  setRelatedVideos(res.data);
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

  if (!vidDetails) return <div>Loading...</div>;

  return (
    <div className="mt-4 bg-white p-3">
      <div className="container mx-auto">
        <div className="row justify-content-between">
          <div className="col-lg-8 p-0">
            <div className="card">
              <VideoPlayer
                durationInSec={vidDetails.durationInSec || 0}
                initialTimestamps={vidDetails.timestamps}
                id={Number(id)}
                poster={vidDetails.thumbnailLr || ""}
                src={`https://${vidDetails.clientId}.gvideo.io/videos/${vidDetails.clientId}_${vidDetails.slug}/master.m3u8`}
              />
              <VideoInfo
                videoInfo={vidDetails}
                onUpdateSuccess={fetchVidDetails}
              />
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
                    <RelatedVideoTile
                      key={video.id}
                      video={video}
                      isActive={Number(id) === video.id}
                    />
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

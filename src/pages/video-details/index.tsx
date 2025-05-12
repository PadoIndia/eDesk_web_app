import { LuArrowLeft } from "react-icons/lu";
import "./styles.css";
import VideoPlayer from "./components/video-player";
import VideoInfo from "./components/video-info";
import VideoSidebar from "./components/video-metadata";
import Layout from "../../components/layout";
import { useParams } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import { SingleVideoResponse, TimestampPayload } from "../../types/video.types";
import videoService from "../../services/api-services/video.service";
import { formatSeconds } from "../../utils/helper";

export default function VideoPage() {
  const { id } = useParams();
  const [vidDetails, setVidDetails] = useState<SingleVideoResponse>();

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
  console.log(vidDetails, "??");

  return (
    <Layout showSideBar={false}>
      <div className="video-container">
        <div className="mb-3">
          <a href="/" className="back-link">
            <LuArrowLeft className="icon" />
            Back to videos
          </a>
        </div>

        <div className="row">
          <div className="col-lg-2 card p-3">
            <h5>Timestamps</h5>
            <div className="my-2">
              {vidDetails.timestamps.map((timestmp) => (
                <div className="d-flex gap-2">
                  <a className="font-sm">{formatSeconds(timestmp.timeInSec)}</a>
                  <span className="font-sm">{timestmp.comment}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card">
              <VideoPlayer
                timestamps={vidDetails.timestamps}
                id={Number(id)}
                addTimeStamp={addTimeStamp}
                poster={vidDetails.thumbnailLr || ""}
                src={`https://${vidDetails.clientId}.gvideo.io/videos/${vidDetails.clientId}_${vidDetails.slug}/master.m3u8`}
              />
              <VideoInfo videoInfo={vidDetails} />
            </div>
          </div>
          <div className="col-lg-3">
            <VideoSidebar vidDetails={vidDetails} />
          </div>
        </div>
      </div>
    </Layout>
  );
}

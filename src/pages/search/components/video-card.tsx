import { Badge } from "../../../components/ui/badge";
import { VideoResponse } from "../../../types/video.types";
import { formatSeconds } from "../../../utils/helper";

interface VideoCardProps {
  video: VideoResponse;
}

export default function VideoCard({ video }: VideoCardProps) {
  return (
    <a className="video-card card mb-3" href={"/videos/" + video.id}>
      <div className="row g-0">
        <div className="col-md-4 thumbnail-container">
          <img
            src={video.thumbnailLr || "/placeholder.svg"}
            className="img-fluid rounded-start"
            alt={video.name}
          />
          <div className="duration-badge">
            {formatSeconds(video.durationInSec)}
          </div>
        </div>
        <div className="col-md-8">
          <div className="card-body">
            <h5 className="card-title">{video.name}</h5>
            <p className="uploader mb-2">
              <Badge variant={"info"}>{video.source}</Badge>
            </p>
            <p className="card-text description">{video.comment}</p>
            <span className="bg-secondary text-light p-2 rounded-pill font-sm">
              {video.event.eventName}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

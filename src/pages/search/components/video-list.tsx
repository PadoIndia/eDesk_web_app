import { VideoResponse } from "../../../types/video.types";
import VideoCard from "./video-card";

interface VideoListProps {
  videos: VideoResponse[];
}

export default function VideoList({ videos }: VideoListProps) {
  if (videos.length === 0) {
    return (
      <div className="alert alert-info">
        No videos found matching your criteria. Try adjusting your search or
        filters.
      </div>
    );
  }

  return (
    <div className="video-list">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  );
}

import VideoCard from "../../home/components/video-card";
import { VideoResponse } from "../../../types/video.types";

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
    <div className="row gap-4 mx-auto">
      {videos.map((video) => (
        <VideoCard key={video.id} {...video} />
      ))}
    </div>
  );
}

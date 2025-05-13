import { useEffect, useState } from "react";
import VideoCard from "../../components/ui/cards/video-card";
import Search from "../../components/ui/search";
import { VideoResponse } from "../../types/video.types";
import { useParams } from "react-router-dom";
import videoService from "../../services/api-services/video.service";
import { IoAddOutline } from "react-icons/io5";

const Home: React.FC = () => {
  const { eventId } = useParams();
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (eventId) {
      videoService
        .getAllVideos({
          params: {
            eventId,
          },
        })
        .then((resp) => {
          if (resp.status === "success") {
            setVideos(resp.data);
          }
        });
    }
  }, [eventId]);

  const filtered = videos.filter((v) =>
    v.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex justify-content-between p-2">
        <Search value={query} onChange={setQuery} />
        <div>
          <button className="btn btn-primary ">
            <IoAddOutline />
            Add Video
          </button>
        </div>
      </div>
      <div className="row gap-4 mx-auto">
        {filtered.map((video) => (
          <VideoCard key={video.videoId} {...video} />
        ))}
      </div>
    </div>
  );
};

export default Home;

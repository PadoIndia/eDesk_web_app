import { useEffect, useState } from "react";
import VideoCard from "./components/video-card";
import Search from "../../components/ui/search";
import { VideoResponse } from "../../types/video.types";
import { useParams } from "react-router-dom";
import videoService from "../../services/api-services/video.service";
import { IoAddOutline } from "react-icons/io5";
import { EventResponse } from "../../types/event.types";
import eventService from "../../services/api-services/event.service";
import { Badge } from "../../components/ui/badge";

const Home: React.FC = () => {
  const { eventId } = useParams();
  const [videos, setVideos] = useState<VideoResponse[]>([]);
  const [query, setQuery] = useState("");
  const [eventDetail, setEventDetail] = useState<EventResponse | null>(null);

  const fetchData = () => {
    eventService.getEventById(+eventId!).then((resp) => {
      if (resp.status === "success") {
        setEventDetail(resp.data);
      }
    });
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
  };

  useEffect(() => {
    if (eventId) {
      fetchData();
    }
  }, [eventId]);

  const filtered = videos.filter((v) =>
    v.name.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between p-2">
        <Search value={query} onChange={setQuery} />

        {eventId && (
          <div>
            <a
              className="btn btn-primary"
              target="_blank"
              href={`/uploads?eventId=${eventId}`}
            >
              <IoAddOutline />
              Add Video
            </a>
          </div>
        )}
      </div>
      {eventDetail && (
        <div className="p-2 d-flex gap-3 align-items-start">
          <h4 className="w-full">{eventDetail?.eventName}</h4>
          <div>
            <Badge variant="success">
              {new Date(eventDetail.date).toLocaleDateString()}
            </Badge>
          </div>
        </div>
      )}
      <div className="row gap-4 mx-auto">
        {filtered.map((video) => (
          <VideoCard key={video.videoId} {...video} />
        ))}
      </div>
    </div>
  );
};

export default Home;

import { useState, useEffect, memo } from "react";
import { VideoResponse } from "../../../types/video.types";
import eventService from "../../../services/api-services/event.service";
import videoService from "../../../services/api-services/video.service";
import { useNavigate, useParams } from "react-router-dom";
import { formatLocaleDateToDMY, transformEvents } from "../../../utils/helper";
import { GroupedOutput } from "../../../types/sidebar.types";
import SidebarGroup from "./sidebar-group";
import { MdOutlineSlowMotionVideo } from "react-icons/md";
import "./styles.scss";

const Sidebar = () => {
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});
  const [sidebarItems, setSideBarItems] = useState<GroupedOutput[]>([]);
  const [videoItems, setVideoItems] = useState<VideoResponse[]>([]);
  const [activeTab, setActiveTab] = useState<"events" | "recents">("events");

  const { eventId } = useParams();
  const parsedEventId = eventId ? parseInt(eventId, 10) : undefined;

  const toggleGroup = (id: number) => {
    setOpenGroups((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const navigate = useNavigate();

  useEffect(() => {
    eventService.getAllEvents().then((res) => {
      if (res.status === "success") {
        setSideBarItems(transformEvents(res.data));
      }
    });

    videoService
      .getAllVideos({
        params: {
          limit: 100,
        },
      })
      .then((res) => {
        if (res.status === "success") {
          setVideoItems(res.data);
        }
      });
  }, []);

  const handleTabChange = (tab: "events" | "recents") => {
    setActiveTab(tab);
  };

  return (
    <div className="custom-sidebar">
      <ul className="row p-0 m-1 my-2 position-relative">
        <li className="col-6  text-center" style={{ listStyle: "none" }}>
          <button
            className={`btn btn-body border-0 fw-bold transition  px-4 ${
              activeTab === "events" ? "text-primary " : "border-0"
            }`}
            onClick={() => handleTabChange("events")}
          >
            Events
          </button>
        </li>
        <li className="col-6 text-center" style={{ listStyle: "none" }}>
          <button
            className={`btn btn-body border-0 transition  fw-bold px-4 ${
              activeTab === "recents" ? "text-primary " : "border-0"
            }`}
            onClick={() => handleTabChange("recents")}
          >
            Recents
          </button>
        </li>
        <div
          className="transition rounded-pill"
          style={{
            position: "absolute",
            top: 0,
            transform: `translateX(${
              activeTab === "recents" ? "105%" : "0px"
            })`,
            bottom: 0,
            width: "50%",
            backgroundColor: "rgba(210,210,210,0.3)",
          }}
        />
      </ul>

      <div className="tab-content">
        {activeTab === "events" && (
          <div className="tab-pane fade show active">
            {sidebarItems.map((group) => (
              <SidebarGroup
                key={group.id}
                group={group}
                isOpen={openGroups[group.id] ?? false}
                toggleGroup={toggleGroup}
                activeEventId={parsedEventId}
              />
            ))}
          </div>
        )}

        {activeTab === "recents" && (
          <div className="tab-pane fade show active">
            <div className="recent-videos mt-3">
              {videoItems.map((video) => (
                <div
                  key={video.id}
                  style={{
                    gap: "0.5em",
                    marginBottom: "0.5rem",
                    padding: "0.5rem 0",
                  }}
                  className="d-flex align-items-center"
                  onClick={() => navigate(`/videos/${video.id}`)}
                >
                  <div>
                    <MdOutlineSlowMotionVideo size={17} />
                  </div>
                  <span className="text-truncate col-7">{video.name}</span>
                  <span className="font-sm">
                    {formatLocaleDateToDMY(video.createdOn)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(Sidebar);

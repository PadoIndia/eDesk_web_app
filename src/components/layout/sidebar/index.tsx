import { useState, useEffect, memo } from "react";
import { VideoResponse } from "../../../types/video.types";
import eventService from "../../../services/api-services/event.service";
import videoService from "../../../services/api-services/video.service";
import { useNavigate, useParams } from "react-router-dom";
import { GoVideo } from "react-icons/go";
import { formatLocaleDateToDMY, transformEvents } from "../../../utils/helper";
import { GroupedOutput } from "../../../types/sidebar.types";
import SidebarGroup from "./sidebar-group";
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
      <ul className="nav nav-underline">
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "events" ? "active" : ""}`}
            onClick={() => handleTabChange("events")}
          >
            Events
          </button>
        </li>
        <li className="nav-item">
          <button
            className={`nav-link ${activeTab === "recents" ? "active" : ""}`}
            onClick={() => handleTabChange("recents")}
          >
            Recents
          </button>
        </li>
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
            <div className="recent-videos">
              {videoItems.map((video) => (
                <div
                  key={video.id}
                  className="d-flex gap-2 m-1 my-3"
                  onClick={() => navigate(`/videos/${video.id}`)}
                >
                  <div>
                    <GoVideo />
                  </div>
                  <span className="text-truncate h6 col-7">{video.name}</span>
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

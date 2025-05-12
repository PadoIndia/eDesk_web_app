import { useState, useRef, useEffect, memo } from "react";
import { IoCaretForward } from "react-icons/io5";
import { BsCalendar4Event, BsFolder2 } from "react-icons/bs";
import { EventResponse } from "../../../types/event.types";
import { VideoResponse } from "../../../types/video.types";
import eventService from "../../../services/api-services/event.service";
import videoService from "../../../services/api-services/video.service";
import { useNavigate } from "react-router-dom";
import "./styles.scss";
import { Badge } from "../../ui/badge";
import { GoVideo } from "react-icons/go";
import { formatLocaleDateToDMY } from "../../../utils/helper";

type GroupedOutput = {
  id: number;
  label: string;
  count: number;
  children?: EventResponse[];
};

type SidebarGroupProps = {
  group: {
    id: number;
    label: string;
    count: number;
    children?: EventResponse[];
  };
  isOpen: boolean;
  toggleGroup: (id: number) => void;
};

function transformEvents(events: EventResponse[]): GroupedOutput[] {
  const groupMap = new Map<number, GroupedOutput>();
  const ungrouped: GroupedOutput[] = [];

  for (const event of events) {
    if (event.eventGroupMap.length > 0) {
      for (const map of event.eventGroupMap) {
        const { groupId, group } = map;
        if (!groupMap.has(groupId)) {
          groupMap.set(groupId, {
            id: groupId,
            label: group.groupName,
            children: [],
            count: 0,
          });
        }
        groupMap.get(groupId)!.children!.push(event);
      }
    } else {
      ungrouped.push({
        id: event.id,
        label: event.eventName,
        count: event.ecVideos.length,
      });
    }
  }

  return [...Array.from(groupMap.values()), ...ungrouped];
}

const SidebarGroup = ({ group, isOpen, toggleGroup }: SidebarGroupProps) => {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState("0px");
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && contentRef.current) {
      setHeight(`${contentRef.current.scrollHeight}px`);
    } else {
      setHeight("0px");
    }
  }, [isOpen]);

  const handleClick = () => {
    if (group.children) {
      toggleGroup(group.id);
    } else {
      navigate(`/events/${group.id}`);
    }
  };

  return (
    <div className="sidebar-group">
      <button className="group-toggle w-100" onClick={handleClick}>
        <div>
          {group.children && (
            <IoCaretForward
              style={{
                transform: isOpen ? `rotateZ(90deg)` : "initial",
                transition: "transform 0.4s ease",
              }}
            />
          )}
          {group.children ? (
            <BsFolder2 size={18} />
          ) : (
            <BsCalendar4Event className="event-icon" />
          )}
        </div>
        <span
          className="text-start text-truncate"
          style={{
            maxWidth: "12rem",
          }}
        >
          {group.label}
        </span>
        {!group.children && (
          <span className="count ms-auto">
            <Badge variant="primary">{group.count ?? 0}</Badge>
          </span>
        )}
      </button>
      {group.children && (
        <div
          className={`group-content ${isOpen ? "open" : ""}`}
          style={{ height, transition: "height 0.4s ease" }}
          ref={contentRef}
        >
          <div className="group-inner">
            {group.children.map((event) => (
              <div
                className="d-flex justify-content-start gap-2"
                key={event.id}
                onClick={() => navigate(`/events/${event.id}`)}
              >
                <div>
                  <BsCalendar4Event className="event-icon" />
                </div>
                <span>{event.eventName}</span>
                <span className="count">{event.ecVideos.length}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Sidebar = () => {
  const [openGroups, setOpenGroups] = useState<Record<number, boolean>>({});
  const [sidebarItems, setSideBarItems] = useState<GroupedOutput[]>([]);
  const [videoItems, setVideoItems] = useState<VideoResponse[]>([]);
  const [activeTab, setActiveTab] = useState<"events" | "recents">("events");
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
      {/* Bootstrap Tabs */}
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
        {/* Events Tab Content */}
        {activeTab === "events" && (
          <div className="tab-pane fade show active">
            {sidebarItems.map((group) => (
              <SidebarGroup
                key={group.id}
                group={group}
                isOpen={openGroups[group.id] ?? false}
                toggleGroup={toggleGroup}
              />
            ))}
          </div>
        )}

        {/* Recents Tab Content */}
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
                  <span className="text-truncate  h6 col-7">{video.name}</span>
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

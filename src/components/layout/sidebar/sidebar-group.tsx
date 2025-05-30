import { useRef, useState, useEffect } from "react";
import { BsFolder2, BsCalendar4Event } from "react-icons/bs";
import { IoCaretForward } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { GroupedOutput } from "../../../types/sidebar.types";
import { Badge } from "../../ui/badge";
import { getShortDate } from "../../../utils/helper";

type Props = {
  group: GroupedOutput;
  isOpen: boolean;
  toggleGroup: (id: number) => void;
  activeEventId?: number;
};

const SidebarGroup = ({ group, isOpen, toggleGroup, activeEventId }: Props) => {
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

  const isActiveGroup = !group.children && group.id === activeEventId;

  return (
    <div className="sidebar-group">
      <button
        className={`group-toggle border-0 w-100 ${
          isActiveGroup ? "active" : ""
        }`}
        onClick={handleClick}
        title={group.label}
      >
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
            <BsCalendar4Event size={18} className="event-icon" />
          )}
        </div>
        <div className="d-flex flex-column align-items-start">
          <span className="text-start truncate-modern">{group.label}</span>

          {!group.children && (
            <Badge variant="info" className="font-sm rounded-pill">
              {getShortDate(group.createdOn!)}
            </Badge>
          )}
        </div>
        {!group.children && (
          <span className="count ms-auto">
            <Badge variant="primary">{group.count ?? 0}</Badge>
          </span>
        )}
      </button>
      {group.children && (
        <div
          className={`group-content ${isOpen ? "open" : ""} `}
          style={{ height, transition: "height 0.4s ease" }}
          ref={contentRef}
        >
          <div className="group-inner">
            {group.children.map((event) => {
              const isActiveEvent = event.id === activeEventId;
              return (
                <div
                  title={event.eventName}
                  key={event.id}
                  className={`d-flex justify-content-start gap-2 sidebar-child ${
                    isActiveEvent ? "active" : ""
                  }`}
                  onClick={() => navigate(`/events/${event.id}`)}
                >
                  <div>
                    <BsCalendar4Event className="event-icon" />
                  </div>
                  <div className="d-flex flex-column align-items-start">
                    <span className="text-start truncate-modern">
                      {event.eventName}
                    </span>

                    <Badge variant="info" className="font-sm rounded-pill">
                      {getShortDate(event.createdOn!)}
                    </Badge>
                  </div>
                  {/* <span className="truncate-modern">{event.eventName}</span> */}
                  <span className="count">
                    <Badge variant="primary">{event.ecVideos.length}</Badge>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default SidebarGroup;

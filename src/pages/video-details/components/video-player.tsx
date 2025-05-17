import { useEffect, useRef, useState } from "react";
import { MdClose, MdOutlineTimer, MdDelete } from "react-icons/md";
import {
  TimestampPayload,
  TimestampResponse,
} from "../../../types/video.types";
import videoService from "../../../services/api-services/video.service";
import Hls from "hls.js";
import { formatSeconds } from "../../../utils/helper";

type Props = {
  id: number;
  poster: string;
  src: string;
  timestamps: TimestampResponse[];
  addTimeStamp: (data: TimestampPayload) => void;
  updateTimeStamp: (data: TimestampResponse) => void;
  deleteTimestamp: (id: number) => void;
};

const VideoPlayer = ({
  id,
  poster,
  src,
  timestamps,
  addTimeStamp,
  updateTimeStamp,
  deleteTimestamp,
}: Props) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showAddButton, setShowAddButton] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [labelInput, setLabelInput] = useState("");
  const [showTimestamps, setShowTimestamps] = useState(false);
  const [editingTimestampId, setEditingTimestampId] = useState<number | null>(
    null
  );
  const [editingLabel, setEditingLabel] = useState("");

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let intervalId: any = null;
    let hls: Hls | null = null;

    if (Hls.isSupported()) {
      hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
        setDuration(data.levels[0].details?.totalduration || 0);
      });
    } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
      video.src = src;
    }

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const startSync = () => {
      intervalId = setInterval(syncVideoWatch, 12 * 1000);
    };
    const stopSync = () => {
      if (intervalId) clearInterval(intervalId);
    };

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("playing", startSync);
    video.addEventListener("pause", stopSync);
    video.addEventListener("ended", stopSync);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("playing", startSync);
      video.removeEventListener("pause", stopSync);
      video.removeEventListener("ended", stopSync);
      if (hls) hls.destroy();
    };
  }, [src]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node)
      ) {
        setShowTooltip(false);
        setLabelInput("");
        setEditingTimestampId(null);
        setEditingLabel("");
      }
    };
    if (showTooltip || editingTimestampId !== null) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showTooltip, editingTimestampId]);

  const syncVideoWatch = () => {
    videoService
      .addViewDuration(id, [{ durationInSec: 12 }])
      .then((res) => {
        if (res.status === "success") {
          console.log("Added");
        }
      })
      .catch(console.log);
  };

  const handleAddTimestampClick = () => {
    if (!videoRef.current) return;
    videoRef.current.pause();
    setLabelInput("");
    setShowTooltip(true);
  };

  const handleSave = () => {
    addTimeStamp({
      timeInSec: currentTime,
      comment: labelInput || `Timestamp-${timestamps.length}`,
    });
    setShowTooltip(false);
    setLabelInput("");
  };

  const handleEditSave = () => {
    if (editingTimestampId !== null) {
      const timestamp = timestamps.find((t) => t.id === editingTimestampId);
      if (timestamp && editingLabel.trim() !== timestamp.comment) {
        updateTimeStamp({ ...timestamp, comment: editingLabel });
      }
    }
    setEditingTimestampId(null);
    setEditingLabel("");
  };

  const handleDelete = (id: number) => {
    const confirm = window.confirm(
      "Are you sure you want to delete this timestamp?"
    );
    if (confirm) deleteTimestamp(id);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  return (
    <div
      className="video-player-container relative"
      ref={containerRef}
      onMouseEnter={() => setShowAddButton(true)}
      onMouseLeave={() => {
        setShowAddButton(false);
        if (!showTooltip) setLabelInput("");
      }}
    >
      <video
        className="video-player w-full rounded"
        controls
        ref={videoRef}
        poster={poster}
      >
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {showAddButton && !showTooltip && duration > 0 && (
        <button
          className="btn btn-body"
          style={{
            border: "none",
            position: "absolute",
            bottom: "30px",
            left: `50%`,
            transform: "translateX(-50%)",
            zIndex: 10,
          }}
          onClick={handleAddTimestampClick}
        >
          <MdOutlineTimer color="white" size={22} />
        </button>
      )}

      <div
        style={{
          position: "absolute",
          right: "2%",
          transition: "all 200ms ease-in-out",
          transform: `translateX(${showTimestamps ? "0" : "30px"})`,
          top: "1.5rem",
          width: "30%",
          opacity: showTimestamps ? 1 : 0,
        }}
      >
        <div className="card p-3">
          <h5>Timestamps</h5>
          <div className="my-2">
            {timestamps.map((timestmp) => (
              <div
                className="row p-1 align-items-center"
                key={timestmp.id}
                style={{ gap: "0.5rem" }}
              >
                <a
                  className="font-sm col-3"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = timestmp.timeInSec;
                      videoRef.current?.play();
                    }
                  }}
                >
                  {formatSeconds(timestmp.timeInSec)}
                </a>

                {editingTimestampId === timestmp.id ? (
                  <div className="col-6 d-flex">
                    <input
                      value={editingLabel}
                      onChange={(e) => setEditingLabel(e.target.value)}
                      className="form-control form-control-sm"
                    />
                    <button
                      className="btn btn-sm btn-primary ms-1"
                      onClick={handleEditSave}
                    >
                      Save
                    </button>
                  </div>
                ) : (
                  <span
                    className="col-6 font-sm"
                    onDoubleClick={() => {
                      setEditingTimestampId(timestmp.id);
                      setEditingLabel(timestmp.comment || "");
                    }}
                  >
                    {timestmp.comment}
                  </span>
                )}

                <button
                  className="btn btn-sm btn-outline-danger col-2 d-flex align-items-center justify-content-center"
                  onClick={() => handleDelete(timestmp.id)}
                >
                  <MdDelete size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div
        className="p-2 rounded shadow"
        style={{
          position: "absolute",
          top: "0.5rem",
          right: showTimestamps ? "35%" : "1.5rem",
          background: "rgba(0,0,0,0.5)",
          transition: "all 200ms ease-in-out",
          cursor: "pointer",
          borderRadius: showTimestamps ? "50%" : "20%",
        }}
      >
        <button
          onClick={() => setShowTimestamps(!showTimestamps)}
          className="text-white btn border-0 btn-body p-0 m-0"
        >
          {showTimestamps ? <MdClose /> : "Timestamps"}
        </button>
      </div>

      {showTooltip && (
        <div
          ref={tooltipRef}
          className="timestamp-tooltip card p-3"
          style={{
            position: "absolute",
            bottom: "50%",
            left: "50%",
            transform: "translateX(-50%) translateY(50%)",
            zIndex: 20,
          }}
        >
          <div className="timestamp-tooltip-header mb-2">
            Time: {formatTime(currentTime)}
          </div>
          <input
            autoFocus
            className="form-control mb-2"
            placeholder="Enter label..."
            value={labelInput}
            onChange={(e) => setLabelInput(e.target.value)}
          />
          <div className="d-flex gap-2 justify-content-end">
            <button
              className="btn btn-outline-danger"
              onClick={() => {
                setShowTooltip(false);
                setLabelInput("");
              }}
            >
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;

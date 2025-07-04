import { useCallback, useEffect, useRef, useState } from "react";
import { MdClose, MdOutlineTimer, MdDelete } from "react-icons/md";
import {
  TimestampPayload,
  TimestampResponse,
} from "../../../types/video.types";
import videoService from "../../../services/api-services/video.service";
import Hls from "hls.js";
import { formatSeconds } from "../../../utils/helper";
import { useAppSelector } from "../../../store/store";
import { toast } from "react-toastify";

type Props = {
  id: number;
  poster: string;
  src: string;
  initialTimestamps: TimestampResponse[];
  durationInSec: number;
};

const VideoPlayer = ({
  id,
  poster,
  src,
  initialTimestamps,
  durationInSec,
}: Props) => {
  const userId = useAppSelector((s) => s.auth.userData?.user.id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const [timestamps, setTimestamps] =
    useState<TimestampResponse[]>(initialTimestamps);
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
    let timestampIntervalId: number | null = null;
    if (!video) return;
    timestampIntervalId = setInterval(
      () =>
        videoService.getTimestamps(id).then((res) => {
          if (res.status === "success") {
            setTimestamps(res.data);
          }
        }),
      10000
    );
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let intervalId: any = null;
    let hls: Hls | null = null;

    const updateTime = () => setCurrentTime(video.currentTime);
    const updateDuration = () => setDuration(video.duration);
    const startSync = () => {
      if (!intervalId && document.visibilityState === "visible") {
        intervalId = setInterval(syncVideoWatch, 12 * 1000);
      }
    };
    const stopSync = () => {
      if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
      }
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        video.pause();
        stopSync();
      } else if (document.visibilityState === "visible" && !video.paused) {
        startSync();
      }
    };

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

    video.addEventListener("timeupdate", updateTime);
    video.addEventListener("loadedmetadata", updateDuration);
    video.addEventListener("playing", startSync);
    video.addEventListener("pause", stopSync);
    video.addEventListener("ended", stopSync);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      video.removeEventListener("timeupdate", updateTime);
      video.removeEventListener("loadedmetadata", updateDuration);
      video.removeEventListener("playing", startSync);
      video.removeEventListener("pause", stopSync);
      video.removeEventListener("ended", stopSync);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      stopSync();
      if (hls) hls.destroy();
      if (timestampIntervalId) {
        clearInterval(timestampIntervalId);
      }
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

  const addTimeStamp = useCallback(
    (data: TimestampPayload) => {
      if (id) {
        const time = data.timeInSec;
        const existsWithTime = timestamps.find((i) => i.timeInSec === time);
        if (existsWithTime)
          return toast.error("A timestamp for this time already exists");
        if (time < 0 || time > durationInSec)
          return toast.error(
            `Timestamp must be between 0 and ${durationInSec} seconds`
          );

        videoService.addTimestamp(Number(id), data).then((res) => {
          if (res.status === "success") {
            setTimestamps((prev) => [...prev, res.data]);
            toast.success(res.message);
          } else toast.error(res.message);
        });
      }
    },
    [id]
  );

  const updateTimeStamp = useCallback(
    (data: TimestampResponse) => {
      if (id) {
        videoService
          .updateTimestamp(Number(id), data.id, {
            comment:
              data.comment || `Timestamp-${(timestamps.length || 0) + 1}`,
            timeInSec: data.timeInSec,
          })
          .then((res) => {
            if (res.status === "success") {
              toast.success(res.message);
            } else toast.error(res.message);
          });
      }
    },
    [id]
  );
  const deleteTimestamp = useCallback(
    (timeStampId: number) => {
      if (id) {
        videoService.deleteTimestamp(Number(id), timeStampId).then((res) => {
          if (res.status === "success") {
            toast.success(res.message);
          } else toast.error(res.message);
        });
      }
    },
    [id]
  );

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
          className="btn btn-body border-0"
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
          opacity: showTimestamps ? 1 : 0,
        }}
        className="col-md-6 col-12"
      >
        <div className="card p-3">
          <h5>Timestamps</h5>
          <div className="my-2">
            {timestamps.map((timestmp) => (
              <div
                className="row p-1 align-items-center"
                key={timestmp.id}
                style={{ gap: "0.2rem" }}
              >
                <a
                  className="font-sm col-2"
                  onClick={() => {
                    if (videoRef.current) {
                      videoRef.current.currentTime = timestmp.timeInSec;
                      videoRef.current?.play();
                    }
                  }}
                >
                  {formatSeconds(timestmp.timeInSec)}
                </a>

                {editingTimestampId === timestmp.id &&
                userId === timestmp.commentedById ? (
                  <div className="col-3 d-flex">
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
                    className="col-4 font-sm"
                    onDoubleClick={() => {
                      if (timestmp.commentedById === userId) {
                        setEditingTimestampId(timestmp.id);
                        setEditingLabel(timestmp.comment || "");
                      }
                    }}
                  >
                    {timestmp.comment}
                  </span>
                )}
                <span className="col-3 font-sm">
                  {timestmp.commentedBy?.name}
                </span>
                {timestmp.commentedById === userId && (
                  <button
                    className="btn btn-sm btn-outline-danger col-2 d-flex align-items-center justify-content-center"
                    onClick={() => handleDelete(timestmp.id)}
                  >
                    <MdDelete size={18} />
                  </button>
                )}
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
          right: showTimestamps ? "55%" : "1.5rem",
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

"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { MdOutlineTimer } from "react-icons/md";
import {
  TimestampPayload,
  TimestampResponse,
} from "../../../types/video.types";
import videoService from "../../../services/api-services/video.service";
import Hls from "hls.js";

export type VideoPlayerRef = {
  seekTo: (seconds: number) => void;
};

type Props = {
  id: number;
  poster: string;
  src: string;
  timestamps: TimestampResponse[];
  addTimeStamp: (data: TimestampPayload) => void;
};

const VideoPlayer = forwardRef<VideoPlayerRef, Props>(
  ({ id, poster, src, timestamps, addTimeStamp }, ref) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showAddButton, setShowAddButton] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const [labelInput, setLabelInput] = useState("");

    // Expose methods to parent
    useImperativeHandle(ref, () => ({
      seekTo: (seconds: number) => {
        if (videoRef.current) {
          videoRef.current.currentTime = seconds;
          videoRef.current.play();
        }
      },
    }));

    useEffect(() => {
      const video = videoRef.current;
      if (!video) return;

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      let intervalId: any | null = null;
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
        if (intervalId) {
          clearInterval(intervalId);
          intervalId = null;
        }
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

    const handleAddTimestampClick = () => {
      if (!videoRef.current) return;
      videoRef.current.pause();
      setLabelInput("");
      setShowTooltip(true);
    };

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

    const handleSave = () => {
      addTimeStamp({
        timeInSec: currentTime,
        comment: labelInput || `Timestamp-${timestamps.length}`,
      });
      setShowTooltip(false);
      setLabelInput("");
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
        style={{ position: "relative" }}
      >
        <video
          className="video-player w-full"
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

        {showTooltip && (
          <div
            className="timestamp-tooltip"
            style={{
              bottom: "50%",
              left: `${50}%`,
              transform: "translateX(-50%) translateY(50%)",
            }}
          >
            <div className="timestamp-tooltip-header">
              Time: {formatTime(currentTime)}
            </div>
            <input
              autoFocus
              className="timestamp-input"
              placeholder="Enter label..."
              value={labelInput}
              onChange={(e) => setLabelInput(e.target.value)}
            />
            <div className="d-flex gap-2">
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
  }
);

VideoPlayer.displayName = "VideoPlayer";
export default VideoPlayer;

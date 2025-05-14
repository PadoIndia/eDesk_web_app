import { LuShare2, LuPencil, LuClock } from "react-icons/lu";
import { SingleVideoResponse } from "../../../types/video.types";
import { formatMiliSeconds } from "../../../utils/helper";
import { GrView } from "react-icons/gr";
import DurationsModal from "./durations-modal";
import { useEffect, useState } from "react";
import videoService from "../../../services/api-services/video.service";
import { toast } from "react-toastify";

type Props = {
  videoInfo: SingleVideoResponse;
};

export default function VideoInfo({ videoInfo }: Props) {
  const [showModal, setShowModal] = useState(false);

  async function getVideoContent(videoId: string) {
    const containerId = "video-download-links";

    try {
      const resp = await videoService.getDownloadOptions(videoId);
      if (resp.status === "success") {
        const convertedVideos = resp.data;
        const container = document.getElementById(containerId);
        if (!container) {
          console.warn(`Container with id "${containerId}" not found.`);
          return;
        }

        container.innerHTML = "";

        const select = document.createElement("select");
        select.className = "form-select";

        convertedVideos.forEach((v) => {
          const option = document.createElement("option");
          option.value = v.url;
          option.text = v.name.replace("vod", "");
          select.appendChild(option);
        });

        const downloadBtn = document.createElement("button");
        downloadBtn.innerText = "Download";
        downloadBtn.className = "btn btn-outline-primary";
        downloadBtn.onclick = () => {
          const selectedUrl = select.value;
          if (selectedUrl) {
            window.open(selectedUrl, "_blank");
          }
        };

        container.appendChild(select);
        container.appendChild(downloadBtn);
      } else toast.error(resp.message);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  useEffect(() => {
    if (videoInfo) {
      getVideoContent(videoInfo.videoId);
    }
  }, [videoInfo]);

  return (
    <div className="video-info">
      <DurationsModal
        data={videoInfo.videoViewDurations}
        onClose={() => setShowModal(false)}
        show={showModal}
      />
      <h1 className="video-title">{videoInfo?.name}</h1>
      <div className="video-meta">
        <span className="d-flex align-items-center">
          <LuClock className="icon" />
          {formatMiliSeconds(videoInfo?.durationInSec)}
        </span>
        <span
          className="d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <GrView />
          See views
        </span>
        <span>{new Date(videoInfo?.createdOn).toLocaleDateString()}</span>
      </div>
      <div className="action-buttons">
        <button className="btn btn-primary d-flex align-items-center">
          <LuShare2 className="icon" />
          Share
        </button>
        <button className="btn btn-light d-flex align-items-center">
          <LuPencil className="icon" />
          Edit Metadata
        </button>
        <div>
          <div
            id="video-download-links"
            className="d-flex gap-2 align-items-center"
          ></div>
        </div>
      </div>

      <div>
        <h3 className="metadata-label">Description</h3>
        <p className="text-muted">{videoInfo?.comment}</p>
      </div>
    </div>
  );
}

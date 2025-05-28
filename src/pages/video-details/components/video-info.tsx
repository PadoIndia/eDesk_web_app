import { LuClock, LuPencil, LuSave } from "react-icons/lu";
import { SingleVideoResponse } from "../../../types/video.types";
import { formatMiliSeconds } from "../../../utils/helper";
import { GrView } from "react-icons/gr";
import React, { useEffect, useState } from "react";
import videoService from "../../../services/api-services/video.service";
import { toast } from "react-toastify";
import Modal from "../../../components/ui/modals";

const DurationsModal = React.lazy(() => import("./durations-modal"));

type Props = {
  videoInfo: SingleVideoResponse;
  onUpdateSuccess: () => void;
};

export default function VideoInfo({ videoInfo, onUpdateSuccess }: Props) {
  const [showModal, setShowModal] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [name, setName] = useState(videoInfo.name);

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

  const onUpdateVideo = () => {
    if (name && name !== videoInfo?.name) {
      videoService
        .updateVideo(Number(videoInfo.id), { name: name.trim() })
        .then((res) => {
          if (res.status === "success") {
            onUpdateSuccess();
            toast.success(res.message);
            setShowEdit(false);
          } else toast.error(res.message);
        })
        .catch((err) =>
          toast.error(err instanceof Error ? err.message : "Some Error Occured")
        );
    }
  };

  return (
    <div className="video-info">
      <DurationsModal
        data={videoInfo.videoViewDurations}
        onClose={() => setShowModal(false)}
        show={showModal}
      />

      <Modal
        title="Edit Video"
        showCloseIcon
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
      >
        <label htmlFor="form form-label">Title</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          className="form-control rounded"
        />
        <div className="mt-2">
          <button
            className="btn btn-primary d-flex align-items-center"
            onClick={onUpdateVideo}
            disabled={!name || name == videoInfo.name}
          >
            <LuSave className="icon" />
            Save
          </button>
        </div>
      </Modal>
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
        {/* <button className="btn btn-primary d-flex align-items-center">
          <LuShare2 className="icon" />
          Share
        </button> */}
        <button
          className="btn btn-light d-flex align-items-center"
          onClick={() => setShowEdit(true)}
        >
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

import React, { useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import uploadService from "../../services/upload/upload.service";
import { FilePicker } from "./components/file-picker";
import VideoUploadList from "./components/video-upload-list";

const Uploads: React.FC = () => {
  useEffect(() => {
    const handleOffline = (): void => {
      toast.error("You are offline. Uploads are paused.");
      uploadService.pauseAllUploads();
    };

    const handleOnline = (): void => {
      toast.info("You are back online. Uploads will resume.");
      uploadService.resumeAllUploads();
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  return (
    <div className="container-fluid vh-100 bg-light d-flex p-3">
      <div className="border-end pe-3">
        <FilePicker />
      </div>
      <div className="flex-grow-1 ps-3 d-flex flex-column align-items-start">
        <VideoUploadList />
      </div>
      <ToastContainer />
    </div>
  );
};

export default Uploads;

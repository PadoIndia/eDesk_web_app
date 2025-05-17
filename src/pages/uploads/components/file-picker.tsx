import React, { useState, useRef } from "react";
import { VideoFile, VideoStatus } from "../../../types/video.types";
import uploadService from "../../../services/upload/upload.service";
import { useAppDispatch } from "../../../store/store";
import { addVideos } from "../../../features/video.slice";

const generateId = (): string => {
  return Math.random().toString(36).substring(2, 15);
};

export const FilePicker = () => {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const onFilesSelected = async (files: File[]) => {
    const newVideos: VideoFile[] = files.map((file) => ({
      id: generateId(),
      name: file.name,
      size: file.size,
      uploadedSize: 0,
      status: "ququed" as VideoStatus,
      thumbnailUrl: URL.createObjectURL(file),
      progress: 0,
      video_id: 0,
    }));
    dispatch(addVideos(newVideos));
    await uploadService.queueVideos(newVideos, files);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files).filter((file) =>
      file.type.startsWith("video/")
    );
    onFilesSelected(files);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) =>
        file.type.startsWith("video/")
      );
      onFilesSelected(files);
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`border rounded text-center p-4 ${
        isDragging ? "border-primary bg-light" : "border-light bg-body-tertiary"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={openFileDialog}
      style={{ cursor: "pointer" }}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="d-none"
        accept="video/*,.mp4,.mkv,.avi,.mov,.webm,.flv"
        multiple
        onChange={handleFileSelect}
      />

      <div className="d-flex flex-column align-items-center gap-3">
        <div className="p-3 rounded-circle bg-primary-subtle">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="text-primary"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        <div>
          <p className="h5 mb-1">Drag and drop video files here</p>
          <p className="text-muted small">or click to select files</p>
        </div>
      </div>
    </div>
  );
};

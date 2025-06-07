import { Upload } from "tus-js-client";
import { store } from "../../store/store";
import { VideoFile } from "../../types/video.types";
import {
  updateProgress,
  updateStatus,
  updateVideoId,
} from "../../features/video.slice";
import { toast } from "react-toastify";
import videoService from "../api-services/video.service";

const uploadMap: Map<string, [string, Upload]> = new Map();
const processingQueue: Array<{ videoFile: VideoFile; file: File }> = [];
let activeUploads = 0;
const MAX_PARALLEL_UPLOADS = 3;

class UploadService {
  pauseAllUploads() {
    for (const [, [id, upload]] of uploadMap) {
      store.dispatch(updateStatus({ id, status: "paused" }));
      upload.abort();
    }
  }

  async resumeAllUploads() {
    for (const [, [id, upload]] of uploadMap) {
      const prevUploads = await upload.findPreviousUploads();
      if (prevUploads.length > 0) {
        store.dispatch(updateStatus({ id, status: "uploading" }));
        upload.resumeFromPreviousUpload(prevUploads[0]);
      }
      upload.start();
    }
  }

  async queueVideos(videoFiles: VideoFile[], files: File[]) {
    // Create a map to quickly access files by name
    const fileMap = new Map<string, File>();
    files.forEach((file) => {
      fileMap.set(file.name, file);
    });

    // Add all videos to the processing queue and update their status
    for (const videoFile of videoFiles) {
      // Skip if already uploading
      if (uploadMap.get(videoFile.name)) {
        console.log(`Video ${videoFile.name} is already uploading, skipping`);
        continue;
      }

      const file = fileMap.get(videoFile.name);
      if (!file) {
        console.error(`File not found for video ${videoFile.name}`);
        continue;
      }

      // Set initial status to queued
      store.dispatch(updateStatus({ id: videoFile.id, status: "queued" }));

      // Add to processing queue
      processingQueue.push({ videoFile, file });
    }

    // Start processing the queue if not already processing
    this.processQueue();
  }

  private async processQueue() {
    // Process the queue and start uploads if there are fewer than 3 uploads in progress
    while (processingQueue.length > 0 && activeUploads < MAX_PARALLEL_UPLOADS) {
      const { videoFile, file } = processingQueue.shift() || {};
      if (videoFile && file) {
        await this.processVideo(videoFile, file);
      }
    }
  }

  async processVideo(vidFile: VideoFile, file: File) {
    try {
      if (uploadMap.get(vidFile.name)) {
        return false;
      }
      const urlParams = new URLSearchParams(window.location.search);
      const eventIdParam = urlParams.get("eventId");
      const event_id =
        eventIdParam && !isNaN(+eventIdParam) ? +eventIdParam : null;
      const vidResp = await videoService.createVideo({
        name: vidFile.name,
        eventId: event_id,
        fileName: vidFile.name,
      });
      if (vidResp.status !== "success") {
        store.dispatch(updateStatus({ id: vidFile.id, status: "failed" }));
        return toast.error(vidResp.message);
      }
      const vidData = vidResp.data;
      const client_id = vidData.video.client_id.toString();
      store.dispatch(
        updateVideoId({ id: vidFile.id, video_id: vidData.video.id })
      );
      const video_id = vidData.video.id.toString();
      await this.uploadVideo(vidFile, file, {
        client_id,
        video_id,
        hostname: vidData.servers[0].hostname,
        token: vidData.token,
      });

      return true;
    } catch (error) {
      store.dispatch(updateStatus({ id: vidFile.id, status: "failed" }));
      if (error instanceof Error) {
        console.log(error.message);
      } else {
        console.log(error);
      }
      return false;
    }
  }

  async uploadVideo(
    vidFile: VideoFile,
    file: File,
    data: {
      video_id: string;
      client_id: string;
      token: string;
      hostname: string;
    }
  ) {
    try {
      const hostname = data.hostname;
      const token = data.token;
      store.dispatch(updateStatus({ id: vidFile.id, status: "uploading" }));
      const upload = new Upload(file, {
        chunkSize: 2 * 1024 * 1024,
        endpoint: `https://${hostname}/upload/`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        metadata: {
          filename: file.name,
          filetype: "video/mp4",
          token,
          client_id: data.client_id,
          video_id: data.video_id,
        },
        onError: async function (error) {
          console.log("Failed because: " + error);
          await videoService.updateGCoreVideo(data.video_id, "error");
          store.dispatch(updateStatus({ id: vidFile.id, status: "failed" }));
        },
        onProgress: function (bytesUploaded, bytesTotal) {
          const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2);
          console.log(bytesUploaded, bytesTotal, percentage + "%");
          store.dispatch(
            updateProgress({ id: vidFile.id, uploadedSize: bytesUploaded })
          );
        },
        onSuccess: async function () {
          console.log(
            "Download %s from %s",
            (upload.file as File).name,
            upload.url
          );
          uploadMap.delete(file.name);
          store.dispatch(updateStatus({ id: vidFile.id, status: "uploaded" }));

          await videoService.updateGCoreVideo(data.video_id, "success");
          // Check if there are more videos to process after this one completes
          activeUploads--; // Decrease active upload count after success
          new UploadService().processQueue(); // Start next upload if necessary
        },
      });
      uploadMap.set(file.name, [vidFile.id, upload]);
      activeUploads++; // Increase active upload count
      upload.start();
      return true;
    } catch (error) {
      console.log(error instanceof Error ? error.message : error);
      store.dispatch(updateStatus({ id: vidFile.id, status: "failed" }));
      return false;
    }
  }

  async retryOrResume(file: VideoFile) {
    const upload = uploadMap.get(file.name)?.[1];
    if (upload) {
      const prevUploads = await upload.findPreviousUploads();
      if (prevUploads.length > 0) {
        upload.resumeFromPreviousUpload(prevUploads[0]);
      }
      upload.start();
      return true;
    } else {
      toast.error("No Upload found for this file,Please Reupload");
      store.dispatch(updateStatus({ id: file.id, status: "failed" }));
      throw Error("Failed");
    }
  }

  async pause(file: VideoFile) {
    const upload = uploadMap.get(file.name)?.[1];
    if (upload) {
      upload.abort();
      return true;
    } else {
      toast.error("No upload found to pause for this file.");
      throw Error("Failed");
    }
  }
}

export default new UploadService();

export type TimestampPayload = {
  timeInSec: number;
  comment?: string;
};

export type VidTagResponse = {
  videoId: number;
  tagId: number;
  id: number;
};

export type TimestampResponse = {
  id: number;
  videoId: number;
  timeInSec: number;
  comment: string | null;
  commentedOn: Date | null;
  commentedById: number | null;
  createdOn: Date;
  isDeleted: boolean;
  commentedBy: {
    name: string | null;
    id: number;
  } | null;
};

export type VideoViewDurationPayload = {
  durationInSec: number;
};

export type VideoPayload = {
  source: "GCORE" | "VDOCIPHER";
  fileName: string;
  name: string;
  videoId: string;
  comment: string;
  thumbnailLr?: string;
  thumbnailHr?: string;
  slug: string;
  eventId: number;
  durationInSec: number;
  status: number;
  clientId?: string;
};

export type VideoResponse = VideoPayload & {
  ecVideoTags: { id: number; videoId: number; tagId: number }[];
  id: number;
  event: {
    id: number;
    eventName: string;
  };
  timestamps: {
    id: number;
    videoId: number;
    timeInSec: number;
    comment: string | null;
    commentedOn: Date | null;
    commentedById: number | null;
    createdOn: Date;
    isDeleted: boolean;
  }[];
  createdOn: Date;
  videoViewDurations: { id: number }[];
};

export type SingleVideoResponse = VideoPayload & {
  id: number;
  timestamps: {
    id: number;
    videoId: number;
    timeInSec: number;
    comment: string | null;
    commentedOn: Date | null;
    commentedById: number | null;
    createdOn: Date;
    isDeleted: boolean;
    commentedBy: {
      name: string | null;
      id: number;
    } | null;
  }[];
  event: {
    id: number;
    eventName: string;
  };
  createdOn: Date;
  ecVideoTags: {
    tag: {
      id: number;
      tag: string;
      category: string;
    };
    id: number;
    videoId: number;
    tagId: number;
  }[];
  videoViewDurations: VideoViewDuration[];
};

export type VideoViewDuration = {
  durationInSec: number;
  createdOn: string;
  user: {
    name: string;
    id: number;
  };
};

export interface VideoDownloadOptions {
  name: string;
  url: string;
  resolution: string;
}

export interface VideoFile {
  id: string;
  name: string;
  size: number;
  uploadedSize: number;
  status: VideoStatus;
  thumbnailUrl: string;
  progress: number;
  video_id: number;
}

export type VideoStatus =
  | "uploaded"
  | "paused"
  | "processing"
  | "uploading"
  | "failed"
  | "queued";

export interface ICreateVideoRequest {
  name: string;
  client_user_id?: string;
}
export interface ICreateVideoResponse {
  id: number;
  name: string;
  description: string;
  client_id: number;
  duration: number;
  slug: string;
  status: UploadStatus;
  origin_size: number;
  origin_video_duration: number;
  origin_audio_channels: number;
  origin_height: number;
  origin_width: number;
  created_at: string;
  updated_at: string;
  clip_start_seconds: number | null;
  clip_duration_seconds: number | null;
  hls_url: string;
  hls_cmaf_url: string;
  dash_url: string;
  iframe_url: string;
  poster: string;
  poster_thumb: string;
  screenshot: string;
  screenshots: string[];
  screenshot_id: number;
  views: number;
  cdn_views: number;
  projection: string;
  sprite: string;
  sprite_vtt: string;
  converted_videos: ConvertedVideo[];
}

export interface ITusSessionResponse {
  servers: Server[];
  token: string;
  video: VideoInfo;
}

export interface VideoInfo {
  id: number;
  name: string;
  description: string;
  client_id: number;
  duration: number;
  slug: string;
  origin_size: number;
  origin_host: string;
  origin_resource: string;
  origin_height: number;
  screenshots: string[];
  screenshot_id: number;
  ad_id: number;
  projection: string;
  client_user_id: number;
  hls_url: string;
}

export interface ConvertedVideo {
  id: number;
  name: string;
  width: number;
  height: number;
  size: number;
  progress: number;
  status: string;
  mp4_url: string;
}

export type UploadStatus = "empty" | "pending" | "viewable" | "ready" | "error";

export interface Server {
  id: number;
  hostname: string;
}

export interface IUploadConfig {
  token: string;
  filetype: string;
  video_id: string;
  client_id: string;
  filename: string;
}

export type TProgressHandler = (
  bytesUploaded: number,
  bytesTotal: number
) => void;

export type IVidQueryParams = {
  id?: string[];
  search?: string;
  status?: UploadStatus;
  client_user_id?: number;
  stream_id?: string;
  page?: number;
  per_page?: number;
  fields?: TFields[];
};

type TFields =
  | "id"
  | "name"
  | "duration"
  | "status"
  | "created_at"
  | "updated_at"
  | "hls_url"
  | "screenshots"
  | "converted_videos"
  | "priority"
  | "stream_id";

export interface ICreateVideoOnServerRequest {
  name: string;
  eventId: number | null;
  fileName: string;
}

export interface ICreateVideoOnServerResponse {
  servers: Server[];
  token: string;
  video: ICreateVideoResponse;
}

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

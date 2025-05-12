export type EventResponse = {
  id: number;
  eventName: string;
  date: Date;
  createdOn: Date;
  createdById: number;
  ecVideos: {
    id: number;
    name: string;
  }[];
  eventGroupMap: {
    groupId: number;
    group: {
      id: number;
      groupName: string;
    };
  }[];
};

export type EventPayload = {
  eventName: string;
  date: string;
  groupIds?: number[];
};

export type EventGroupPayload = {
  groupName: string;
};

export type EventGroupResponse = {
  id: number;
  groupName: string;
  eventGroupMap: {
    event: {
      ecVideos: {
        id: number;
      }[];
      id: number;
      eventName: string;
      date: Date;
      createdOn: Date;
      createdById: number;
    };
  }[];
};

// Types for Published event videos
export type PublishedEventVideoPayload = {
  videoUrl: string;
  smAssetsId: number;
};
export type PublishedEventVidResponse = {
  id: number;
  videoUrl: string;
  smAssetsId: number;
  createdOn: Date;
  createdById: number;
};

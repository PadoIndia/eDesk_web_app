export type SmAssetPayload = {
  channelName: string;
  channelUrl: string;
  platform: string;
  managedById: number;
};

export type SmAssetResponse = {
  id: number;
  channelName: string;
  channelUrl: string;
  platform: string;
  managedById: number;
  createdOn: Date;
};

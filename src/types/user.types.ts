export type DeviceInfoPayload = {
  uniqueId: string;
  os: string;
  osVersion: string;
  deviceName: string;
  buildId?: string;
  brand?: string;
  deviceId: string;
  displayId?: string;
  hardwareId?: string;
  manufacturerName?: string;
  productName?: string;
};

export type VerifyOtpPayload = {
  mobileNumber: string;
  countryCode: string;
  otp: string;
  deviceInfo: DeviceInfoPayload;
};

export type SendOtpPayload = {
  mobileNumber: string;
  countryCode: string;
  appVersion: string;
  // refId: string;
};

export type User = {
  profileImg: {
    id: bigint | undefined;
    url: string | null;
  };
  id: number;
  name: string | null;
  username: string;
  status: string | null;
  isActive: boolean;
  lastSeen: Date | null;
  contact: string;
};

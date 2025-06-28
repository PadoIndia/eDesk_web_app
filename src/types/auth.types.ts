import { TPermission } from "./user.types";

export type VerifyOtpResponse = {
  token: string;
  refreshToken: string;
  user: { id: number; permissions: TPermission[] };
};

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

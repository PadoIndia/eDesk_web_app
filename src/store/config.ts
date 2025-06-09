const isDev = import.meta.env.MODE === "development";

export const BASE_URL = isDev
  ? "http://localhost:3000/v1"
  : "https://api-edesk.esaral.com/v1";

export const mediaBaseUrl =
  "https://myesaralbucket-destination.s3.ap-south-1.amazonaws.com/";

export const socketUrl = isDev
  ? "http://localhost:3000"
  : "https://api-edesk.esaral.com";

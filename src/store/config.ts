const isDev = import.meta.env.DEV;

console.log(import.meta.env, "ENV");
export const BASE_URL = isDev
  ? "http://localhost:3000/v1"
  : "https://edesk.esaral.com/v1/admin";

export const mediaBaseUrl =
  "https://myesaralbucket-destination.s3.ap-south-1.amazonaws.com/";

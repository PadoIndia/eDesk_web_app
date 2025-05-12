export const getOperatingSystem = () => {
  const userAgent = navigator.userAgent || navigator.vendor || "";

  if (/windows phone/i.test(userAgent)) return "Windows Phone";
  if (/win/i.test(userAgent)) return "Windows";
  if (/android/i.test(userAgent)) return "Android";
  if (/macintosh|mac os x/i.test(userAgent)) return "macOS";
  if (/iphone|ipad|ipod/i.test(userAgent)) return "iOS";
  if (/linux/i.test(userAgent)) return "Linux";

  return "Unknown OS";
};

export const getOSVersion = () => {
  const userAgent = navigator.userAgent;
  let osVersion = "Unknown Version";
  let osVersionArr: RegExpMatchArray | null = null;

  if (userAgent.includes("Windows NT")) {
    osVersionArr = userAgent.match(/Windows NT (\d+\.\d+)/);
  } else if (userAgent.includes("Android")) {
    osVersionArr = userAgent.match(/Android (\d+\.\d+)/);
  } else if (userAgent.includes("Mac OS X")) {
    osVersionArr = userAgent.match(/Mac OS X (\d+[\._\d]*)/);
  }

  if (osVersionArr?.[1]) {
    osVersion = osVersionArr[1].replace(/_/g, ".");
  }

  return osVersion;
};

export function formatSeconds(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  const hh = hrs > 0 ? `${hrs}:` : "";
  const mm = `${hrs > 0 ? mins.toString().padStart(2, "0") : mins}`;
  const ss = secs.toString().padStart(2, "0");

  return `${hh}${mm}:${ss}`;
}

export function formatLocaleDateToDMY(dateString: string | Date) {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid Date";

  const day = date
    .getDate()
    .toLocaleString(undefined, { minimumIntegerDigits: 2 });
  const month = (date.getMonth() + 1).toLocaleString(undefined, {
    minimumIntegerDigits: 2,
  });
  const year = date.getFullYear().toString().slice(-2);

  return `${day}-${month}-${year}`;
}

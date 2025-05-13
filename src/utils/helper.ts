import { VerifyOtpResponse } from "../types/auth.types";
import { EventResponse } from "../types/event.types";
import { GroupedOutput } from "../types/sidebar.types";
import { VideoViewDuration } from "../types/video.types";

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
    osVersionArr = userAgent.match(/Mac OS X (\d+[._\d]*)/);
  }

  if (osVersionArr?.[1]) {
    osVersion = osVersionArr[1].replace(/_/g, ".");
  }

  return osVersion;
};

export function formatMiliSeconds(milliseconds: number): string {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const hh = hrs > 0 ? `${hrs}:` : "";
  const mm = hrs > 0 ? mins.toString().padStart(2, "0") : `${mins}`;
  const ss = secs.toString().padStart(2, "0");

  return `${hh}${mm}:${ss}`;
}
export function formatSeconds(totalSeconds: number): string {
  const hrs = Math.floor(totalSeconds / 3600);
  const mins = Math.floor((totalSeconds % 3600) / 60);
  const secs = totalSeconds % 60;

  const hh = hrs > 0 ? `${hrs}:` : "";
  const mm = hrs > 0 ? mins.toString().padStart(2, "0") : `${mins}`;
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

export const decryptAndParseTokenFromStorage = (): VerifyOtpResponse | null => {
  try {
    const encryptedInfo = localStorage.getItem("@user");
    if (!encryptedInfo) throw "";
    const decryptedInfo = atob(encryptedInfo);
    const userInfo = JSON.parse(decryptedInfo);
    if (userInfo.token && userInfo.refreshToken && userInfo.user) {
      return userInfo;
    }
    throw "";
  } catch {
    return null;
  }
};

export function groupByDateAndUser(
  durations: VideoViewDuration[]
): VideoViewDuration[] {
  const map = new Map<string, VideoViewDuration>();

  durations.forEach((item) => {
    const date = item.createdOn.slice(0, 10);
    const key = `${date}-${item.user.id}`;

    if (!map.has(key)) {
      map.set(key, {
        durationInSec: item.durationInSec,
        createdOn: date,
        user: {
          id: item.user.id,
          name: item.user.name,
        },
      });
    } else {
      const existing = map.get(key)!;
      existing.durationInSec += item.durationInSec;
    }
  });

  return Array.from(map.values());
}

export function transformEvents(events: EventResponse[]): GroupedOutput[] {
  const groupMap = new Map<number, GroupedOutput>();
  const ungrouped: GroupedOutput[] = [];

  for (const event of events) {
    if (event.eventGroupMap.length > 0) {
      for (const map of event.eventGroupMap) {
        const { groupId, group } = map;
        if (!groupMap.has(groupId)) {
          groupMap.set(groupId, {
            id: groupId,
            label: group.groupName,
            children: [],
            count: 0,
          });
        }
        groupMap.get(groupId)!.children!.push(event);
      }
    } else {
      ungrouped.push({
        id: event.id,
        label: event.eventName,
        count: event.ecVideos.length,
      });
    }
  }

  return [...Array.from(groupMap.values()), ...ungrouped];
}

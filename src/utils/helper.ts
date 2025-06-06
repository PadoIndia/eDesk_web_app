import userService from "../services/api-services/user.service";
import { Punch } from "../types/attendance.types";
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

export async function generateSHA256(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

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
        createdOn: event.createdOn,
      });
    }
  }

  return [...Array.from(groupMap.values()), ...ungrouped];
}

/**
 * Convert a date string or Date object into a short format like "22 Mar, 2025"
 * @param dateString - The input date as a string or Date object
 * @returns A formatted date string in the format "DD Mon, YYYY"
 */
export function getShortDate(dateString: string | Date): string {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  };
  const parts = date.toLocaleDateString("en-GB", options).split(" ");
  return `${parts[0]} ${parts[1]}, ${parts[2]}`;
}

export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const formatTime = (hh: number, mm: number): string => {
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

export const getWeekOff = async (userId: number): Promise<string> => {
  const response = await userService.getUserDetailsById(userId);
  const weekoff = response.data.weekoff;
  return weekoff;
};

export const calculateWorkingHours = (punches: Punch[]): string => {
  const validPunches = punches.filter(
    (p) => p.isApproved !== false || !p.approvedBy
  );

  if (validPunches.length % 2 !== 0 || validPunches.length === 0) return "—";

  // Punches are already sorted, so we can calculate directly
  let totalMinutes = 0;

  for (let i = 0; i < validPunches.length; i += 2) {
    if (i + 1 < validPunches.length) {
      const inTime = validPunches[i];
      const outTime = validPunches[i + 1];
      totalMinutes +=
        (outTime.hh ?? 0) * 60 +
        (outTime.mm ?? 0) -
        ((inTime.hh ?? 0) * 60 + (inTime.mm ?? 0));
    }
  }

  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
};

export const calculateWorkingMinutes = (punches: Punch[]): number => {
  const validPunches = punches.filter(
    (p) => p.isApproved !== false || !p.approvedBy
  );

  if (validPunches.length % 2 !== 0 || validPunches.length === 0) return 0;

  let totalMinutes = 0;

  for (let i = 0; i < validPunches.length; i += 2) {
    if (i + 1 < validPunches.length) {
      const inTime = validPunches[i];
      const outTime = validPunches[i + 1];
      totalMinutes +=
        (outTime.hh ?? 0) * 60 +
        (outTime.mm ?? 0) -
        ((inTime.hh ?? 0) * 60 + (inTime.mm ?? 0));
    }
  }

  return totalMinutes;
};

export const getLeaveTypeFromComment = (comment: string): string => {
  const commentLower = comment.toLowerCase();
  if (commentLower.includes("sick") || commentLower.includes("medical"))
    return "SL";
  if (commentLower.includes("casual")) return "CL";
  if (commentLower.includes("paid")) return "PL";
  if (commentLower.includes("unpaid")) return "UL";
  if (commentLower.includes("compensatory") || commentLower.includes("comp"))
    return "CO";
  if (commentLower.includes("earned")) return "EL";
  // Default to casual leave if can't determine
  return "CL";
};

export const getDayOfWeek = (date: Date): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

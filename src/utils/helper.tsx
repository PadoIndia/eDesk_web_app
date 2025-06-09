import { VerifyOtpResponse } from "../types/auth.types";
import { MediaType } from "../types/chat";
import { EventResponse } from "../types/event.types";
import { GroupedOutput } from "../types/sidebar.types";
import { VideoViewDuration } from "../types/video.types";
import {
  FaEnvelope,
  FaWhatsapp,
  FaPhone,
  FaIdCard,
  FaUser,
  FaCalendarAlt,
  FaTransgender,
  FaBusinessTime,
  FaMapMarkerAlt,
  FaFileAlt,
  FaImage,
  FaFilePdf,
  FaFile,
} from "react-icons/fa";

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

export const getDateLabel = (date: Date): string => {
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isToday =
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();

  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isToday) return "Today";
  if (isYesterday) return "Yesterday";
  return date.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const formatMessageTime = (timestamp: Date): string => {
  const date = new Date(timestamp);

  const options: Intl.DateTimeFormatOptions = {
    hour: "numeric",
    minute: "numeric",
    hour12: true,
  };

  return date.toLocaleTimeString(undefined, options);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let timeout: any;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const getContactTypeIcon = (type: string) => {
  switch (type) {
    case "email":
      return <FaEnvelope className="text-primary" />;
    case "whatsapp":
      return <FaWhatsapp className="text-success" />;
    case "phone":
    default:
      return <FaPhone className="text-primary" />;
  }
};

export const getDetailIcon = (label: string) => {
  switch (label) {
    case "Date of Birth":
      return <FaCalendarAlt />;
    case "Gender":
      return <FaTransgender />;
    case "Joining Date":
      return <FaBusinessTime />;
    case "Address":
      return <FaMapMarkerAlt />;
    case "Documents":
      return <FaFileAlt />;
    default:
      return <FaUser />;
  }
};

export const getDocumentTypeIcon = () => <FaIdCard className="text-primary" />;

export const validateEmail = (email: string) => /^\S+@\S+\.\S+$/.test(email);

export const validatePhone = (phone: string) => /^\+?\d{10,15}$/.test(phone);

export const formatDate = (dateString: string) =>
  new Date(dateString).toLocaleDateString();

export async function generateSHA256(file: File) {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const renderMediaIcon = (type: MediaType) => {
  switch (type) {
    case "IMAGE":
    case "VIDEO":
      return <FaImage size={16} style={{ color: "#8696a0" }} />;
    case "PDF":
      return <FaFilePdf size={16} style={{ color: "#8696a0" }} />;
    case "DOCUMENT":
      return <FaFile size={16} style={{ color: "#8696a0" }} />;
    default:
      return null;
  }
};

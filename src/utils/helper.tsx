import { mediaBaseUrl } from "../store/config";
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
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaImage,
  FaFilePdf,
  FaFile,
} from "react-icons/fa";
import { Punch } from "../types/attendance.types";
import { RootState } from "../store/store";
import { useSelector } from "react-redux";
import userService from "../services/api-services/user.service";
import {
  LeaveBalance,
  LeaveRequestStatus,
  LeaveTransactionResponse,
  LeaveTypeResponse,
} from "../types/leave.types";
import generalService from "../services/api-services/general.service";
import { DAY } from "../types/attendance-dashboard.types";

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

export const getPunchApprovalIcon = (
  punch: Punch
): React.ReactElement | null => {
  if (punch.type !== "MANUAL") return null;

  if (punch.isApproved === true) {
    return (
      <FaCheckCircle
        className="text-success ms-2"
        title={`Approved by ${punch.approvedBy || "Admin"}`}
      />
    );
  } else if (punch.isApproved === false && punch.approvedBy) {
    return (
      <FaTimesCircle
        className="text-danger ms-2"
        title={`Rejected: ${punch.missPunchReason || "No reason provided"}`}
      />
    );
  } else {
    return (
      <FaHourglassHalf className="text-warning ms-2" title="Pending Approval" />
    );
  }
};
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

export const getMediaUrl = (url?: string) => {
  if (!url) return url;
  if (url.toString().startsWith("http")) return url;
  return mediaBaseUrl + url;
};

export const getDaysInMonth = (month: number, year: number): number => {
  return new Date(year, month + 1, 0).getDate();
};

export const formatTime = (hh: number, mm: number): string => {
  return `${String(hh).padStart(2, "0")}:${String(mm).padStart(2, "0")}`;
};

export const getWeekOff = async (userId: number): Promise<string> => {
  const response = await userService.getUserById(userId);
  if (response.data.userDetails) {
    const weekoff = response.data.userDetails.weekoff || "";
    return weekoff;
  }
  return "";
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
  return "CL";
};

export const getDayOfWeek = (date: Date): string => {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  return days[date.getDay()];
};

// Current user is a department manager
export const IsDeptManager = (): boolean => {
  const userDepartments = useSelector(
    (state: RootState) => state.userDepartment.userDepartments
  );

  const isManager = userDepartments.some((dept) => dept.isAdmin);

  if (isManager) return true;

  return false;
};

// Current user is in Hr department
export const IsHr = (): boolean => {
  const userDepartments = useSelector(
    (state: RootState) => state.userDepartment.userDepartments
  );
  const isHr = userDepartments.some((dept) => dept.department.slug === "hr");
  if (isHr) return true;
  return false;
};

// Current user is in Hr department and is a manager
export const IsHrManager = (): boolean => {
  const userDepartments = useSelector(
    (state: RootState) => state.userDepartment.userDepartments
  );
  const isHrManager = userDepartments.some(
    (dept) => dept.department.slug === "hr" && dept.isAdmin
  );
  if (isHrManager) return true;
  return false;
};

export const isTeamManager = async (userId: number): Promise<boolean> => {
  const teams = await generalService.getUserTeams(userId);
  const isManager = teams.data.some((team) => team.isAdmin);
  if (isManager) return true;
  return false;
};

export function buildLeaveBalances(
  leaveTypes: LeaveTypeResponse[],
  transactions: LeaveTransactionResponse[]
): LeaveBalance[] {
  const balanceMap = new Map<number, LeaveBalance>();
  for (const lt of leaveTypes) {
    balanceMap.set(lt.id, {
      id: lt.id,
      type: lt.name,
      total: 0,
      used: 0,
      remaining: 0,
      isPaid: lt.isPaid,
      transactions: [],
    });
  }

  for (const tx of transactions) {
    const bal = balanceMap.get(tx.leaveTypeId);
    if (!bal) continue;

    bal.transactions.push(tx);

    if (tx.count >= 0) {
      bal.total += tx.count;
    } else {
      bal.used += Math.abs(tx.count);
    }
  }

  for (const bal of balanceMap.values()) {
    bal.remaining = bal.total - bal.used;
  }

  return [...balanceMap.values()];
}

export const getFinalLeaveRequestStatus = (
  managerStatus: LeaveRequestStatus,
  hrStatus: LeaveRequestStatus
): LeaveRequestStatus => {
  const statuses: LeaveRequestStatus[] = [managerStatus, hrStatus];

  if (statuses.every((status) => status === LeaveRequestStatus.PENDING)) {
    return LeaveRequestStatus.PENDING;
  }

  if (statuses.includes(LeaveRequestStatus.CANCELLED)) {
    return LeaveRequestStatus.CANCELLED;
  }

  if (statuses.includes(LeaveRequestStatus.APPROVED)) {
    return LeaveRequestStatus.APPROVED;
  }

  if (statuses.includes(LeaveRequestStatus.REJECTED)) {
    return LeaveRequestStatus.REJECTED;
  }

  return LeaveRequestStatus.PENDING;
};

export const formatDateForBackend = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};


export const convertDayNameToInt = (day: DAY) => {
  switch (day) {
    case "SUNDAY":
      return 0;
    case "MONDAY":
      return 1;
    case "TUESDAY":
      return 2;
    case "WEDNESDAY":
      return 3;
    case "THURSDAY":
      return 4;
    case "FRIDAY":
      return 5;
    case "SATURDAY":
      return 6;
  }
};
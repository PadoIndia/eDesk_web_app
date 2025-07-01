import { Department } from "./department-team.types";

export interface MissPunchRequestData {
  userId: number;
  date: number;
  month: number;
  year: number;
  hh: number;
  mm: number;
  missPunchReason: string;
  departmentId?: number;
}

export interface ManualStatusData {
  userId: number;
  date: number;
  month: number;
  year: number;
  status:
    | "PRESENT"
    | "ABSENT"
    | "HALF_DAY"
    | "WEEK_OFF"
    | "HOLIDAY"
    | "SICK_LEAVE"
    | "CASUAL_LEAVE"
    | "PAID_LEAVE"
    | "UNPAID_LEAVE"
    | "COMPENSATORY_LEAVE";
  comment?: string;
  commentBy?: number;
}

export interface UserAttendanceItem {
  id: number;
  name: string;
  thumbnail: string | null;
  department: string;
  departments: Department[];
  presentDays: number;
  absentDays: number;
  leaveDays: number;
  missPunchCount: number;
  todayStatus: string;
}

export interface PunchData {
  id: number;
  userId: number;
  date: number;
  month: number;
  year: number;
  hh: number;
  mm: number;
  type: "AUTO" | "MANUAL";
  isApproved?: boolean;
  approvedBy?: number;
  missPunchReason?: string;
  comment?: string;
  approvedOn?: string;
  userName: string;
  userDepartment: string;
}

export interface AttendanceData {
  id: number;
  userId: number;
  date: number;
  month: number;
  year: number;
  statusAuto: AutoAttendanceStatus;
  statusManual?: AutoAttendanceStatus;
  comment?: string;
  commentById?: number;
}

export interface CallData {
  id: number;
  userId: number;
  date: number;
  month: number;
  year: number;
  callDuration: number;
  missedCalls: number;
  incomingCalls: number;
  outgoingCalls: number;
  comment?: string;
}

export interface ClassData {
  id: number;
  userId: number;
  date: number;
  month: number;
  year: number;
  classType: string;
  startTime: string;
  endTime: string;
  actualStartTime?: string;
  actualEndTime?: string;
  classStatus: string;
  comment?: string;
}

export interface UserDashboardData {
  user: {
    id: number;
    name: string;
    departments: Array<{
      id: number;
      name: string;
      isAdmin: boolean;
    }>;
    isAdmin: boolean;
  };
  attendance: AttendanceData[];
  punchData: PunchData[];
  callDetails: CallData[];
  classDetails: ClassData[];
}

type AutoAttendanceStatus =
  | "PRESENT"
  | "ABSENT"
  | "HALF_DAY"
  | "WEEK_OFF"
  | "HOLIDAY"
  | "SICK_LEAVE"
  | "CASUAL_LEAVE"
  | "PAID_LEAVE"
  | "UNPAID_LEAVE"
  | "COMPENSATORY_LEAVE";

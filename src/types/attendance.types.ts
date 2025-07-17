import { AutoAttendanceStatus } from "./attendance-dashboard.types";

export interface Punch {
  id: number;
  userId: number;
  date: number;
  month: number;
  year: number;
  time: string;
  type: "AUTO" | "MANUAL";
  isApproved: boolean | null;
  approvedBy?: number | null;
  missPunchReason?: string;
  createdOn: Date;
  comment?: string;
  hh?: number;
  mm?: number;

  userDepartment?: string;
  departmentId?: number | null;

  user?: {
    name: string;
    userDepartment: {
      department: {
        id: number;
        name: string;
      };
    }[];
  };
}

export const ATTENDANCE_STATUS = [
  "PRESENT",
  "WEEK_OFF",
  "HOLIDAY",
  "ABSENT",
  "SICK_LEAVE",
  "CASUAL_LEAVE",
  "EARNED_LEAVE",
  "UNPAID_LEAVE",
  "COMPENSATORY",
  "FESTIVAL",
  "ABSENT/2",
  "SICK_LEAVE/2",
  "CASUAL_LEAVE/2",
  "EARNED_LEAVE/2",
  "UNPAID_LEAVE/2",
  "COMPENSATORY/2",
  "FESTIVAL/2",
] as AutoAttendanceStatus[];

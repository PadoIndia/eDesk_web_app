export interface Punch {
  id: number;
  userId: number;
  date: number;       // Day of month
  month: number;      // 1-12
  year: number;
  hh: number;         // Hours
  mm: number;         // Minutes
  type: 'AUTO' | 'MANUAL';
  isApproved?: boolean;
  approvedBy?: number | string;
  missPunchReason?: string;
  comment?: string;
  approvedOn?: string;
  userName?: string;
  userDepartment?: string;
  createdOn?: string;
  updatedOn?: string;
  reason?: string;    // For form submission
  time?: string;      // For form display
}

export interface CallDetails {
  id: number;
  callDuration: number;
  missedCalls: number;
  incoming: number;
  outgoing: number;
  date: string;
}

export interface ClassDetails {
  id: number;
  glcScheduled: number;
  glcTaken: number;
  oplcScheduled: number;
  oplcTaken: number;
  gdcScheduled: number;
  gdcTaken: number;
  opdcScheduled: number;
  opdcTaken: number;
  date: string;
}

export interface AttendanceUser {
  id: number;
  name: string;
  department: string;
  isAdmin: boolean;
  punchData: Punch[];
  attendance: {
    status: 'P' | 'A';  // Present or Absent
    statusManual: string;
    comment: string;
  };
  callDetails?: CallDetails[];
  classDetails?: ClassDetails[];
}

export interface CalendarEvent {
  date: string;    // ISO format YYYY-MM-DD
  title: string;
  type: "holiday" | "event" | "meeting";
}
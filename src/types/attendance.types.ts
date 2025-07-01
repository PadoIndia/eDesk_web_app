export interface CalendarEvent {
  date: string; // ISO format YYYY-MM-DD
  title: string;
  type: "holiday" | "event" | "meeting";
}

// Extended attendance.types.ts

export interface Punch {
  id: number; // Missing in original
  userId: number;
  date: number;
  month: number;
  year: number;
  time: string; // Changed from hh/mm to match common DB timestamp patterns
  type: "AUTO" | "MANUAL";
  isApproved: boolean | null; // Should allow null for pending status
  approvedBy?: number | null;
  missPunchReason?: string;
  createdOn: Date; // From the orderBy clause
  comment?: string;
  hh?: number;
  mm?: number;

  userDepartment?: string;
  departmentId?: number | null;

  // From included relations
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

interface Department {
  id: number;
  name: string;
  isAdmin: boolean;
}

export interface AttendanceUser {
  id: number;
  name: string;
  department: string; // Comma-separated departments
  departments: Department[]; // Array of department objects
  isAdmin: boolean;
  punchData: Punch[];
  attendance: AttendanceEntry[];
  callDetails: []; // Update with proper type if available
  classDetails: []; // Update with proper type if available
}

export interface AttendanceEntry {
  date: number;
  month: number;
  year: number;
  status: string;
  statusManual?: string;
  comment?: string;
}

export interface DashboardData {
  user: {
    id: number;
    name: string;
    departments: Department[]; // Raw department data from server
    isAdmin: boolean;
  };
  attendance: {
    status: "P" | "A";
    statusManual?: string;
    comment?: string;
  };
  punchData: Punch[];
  callDetails: [];
  classDetails: [];
}

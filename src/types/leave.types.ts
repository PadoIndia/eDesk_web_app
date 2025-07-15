export interface LeaveTypeResponse {
  id: number;
  name: string;
  isPaid: boolean;
  description: string;
  _count: {
    schemes: number;
  };
}

export interface LeaveScheme {
  id: number;
  name: string;
  description: string;
  slug: string;
  leaveTypesCount: number;
  usersCount: number;
  leaveTypes: {
    id: number;
    name: string;
    description: string;
    isPaid: boolean;
    maxDays: number;
    remainingDays: number;
    usedDays: number;
    allowedAfterMonths: number | null;
    isEarned: "YES" | "NO";
  }[];
}

export interface LeaveTypeScheme {
  id: number;
  leaveSchemeId: number;
  leaveTypeId: number;
  maxCarryForward: number;
  allowedAfterMonths?: number;
  isEarned: IsEarned;
  leaveType: LeaveTypeResponse;
}

export enum IsEarned {
  YES = "YES",
  NO = "NO",
}

export interface CreateLeaveSchemeRequest {
  name: string;
  description: string;
  slug: string;
}

export interface UpdateLeaveSchemeRequest {
  name?: string;
  description?: string;
  slug?: string;
}

export interface CreateLeaveTypeRequest {
  name: string;
  isPaid: boolean;
  description: string;
}

export interface UpdateLeaveTypeRequest {
  name?: string;
  isPaid?: boolean;
  description?: string;
}

export interface CreateLeaveTypeSchemeRequest {
  leaveSchemeId: number;
  leaveTypeId: number;
  maxCarryForward: number;
  allowedAfterMonths?: number;
  isEarned: IsEarned;
}

export interface UpdateLeaveTypeSchemeRequest {
  maxCarryForward?: number;
  allowedAfterMonths?: number;
  isEarned?: IsEarned;
}

///////////////////////////////////// Leave Request Related //////////////////////////////////////

export enum LeaveRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  CANCELLED = "CANCELLED",
}

export interface UpdateLeaveRequestRequest {
  leaveTypeId?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  duration?: number;
  reason?: string;
}

export interface ApproveRejectLeaveRequestRequest {
  status: "APPROVED" | "REJECTED";
  comment?: string;
}

// Query parameter types for Leave Requests
export interface GetLeaveRequestsQuery {
  userId?: number;
  managerId?: number;
  hrId?: number;
  managerStatus?: LeaveRequestStatus;
  hrStatus?: LeaveRequestStatus;
  leaveTypeId?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  page?: number;
  limit?: number;
  sortBy?:
    | "submittedOn"
    | "startDate"
    | "endDate"
    | "employeeName"
    | "leaveType";
  sortOrder?: "asc" | "desc";
}

export interface GetManagerLeaveRequestsQuery {
  leaveTypeId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
  sortBy?:
    | "submittedOn"
    | "startDate"
    | "endDate"
    | "employeeName"
    | "leaveType";
  sortOrder?: "asc" | "desc";
}

export interface GetHRLeaveRequestsQuery {
  leaveTypeId?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  page?: number;
  limit?: number;
  sortBy?:
    | "submittedOn"
    | "startDate"
    | "endDate"
    | "employeeName"
    | "leaveType";
  sortOrder?: "asc" | "desc";
}

export interface GetMyLeaveRequestsQuery {
  managerStatus?: LeaveRequestStatus;
  hrStatus?: LeaveRequestStatus;
  leaveTypeId?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  page?: number;
  limit?: number;
  sortBy?: "submittedOn" | "startDate" | "endDate" | "leaveType";
  sortOrder?: "asc" | "desc";
}

// Request types for Leave Transactions
export interface CreateLeaveTransactionRequest {
  userId: number;
  transactions: {
    leaveTypeId: number;
    count: number;
    comment?: string;
  }[];
}

export interface UpdateLeaveTransactionRequest {
  count?: number;
  comment?: string;
}

export interface LeaveTransactionFilters {
  userId?: number;
  leaveTypeId?: number;
  year?: number;
  month?: number;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?:
    | "createdOn"
    | "year"
    | "month"
    | "date"
    | "count"
    | "userName"
    | "leaveType";
  sortOrder?: "asc" | "desc";
}

export interface LeaveTransactionResponse {
  id: number;
  userId: number;
  year: number;
  month: number;
  date: number;
  leaveTypeId: number;
  count: number;
  comment: string | null;
  createdOn: Date;
  updatedOn: Date;
  assignedById: number | null;
  user: {
    id: number;
    name: string | null;
    username: string;
  };
  leaveType: {
    id: number;
    name: string;
  };
  assignedBy: { name: string | null } | null;
}

export interface LeaveBalance {
  id: number;
  type: string;
  total: number;
  used: number;
  remaining: number;
  isPaid: boolean;
  transactions: LeaveTransactionResponse[];
}

export interface LeaveRequestResponse {
  id: number;
  userId: number;
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  managerId: number;
  hrId: number;
  submittedOn: string;
  updatedOn: string;
  managerStatus: LeaveRequestStatus;
  hrStatus: LeaveRequestStatus;
  comment: string | null;
  leaveType: {
    id: number;
    name: string;
    description: string;
  };
  user: {
    id: number;
    name: string | null;
    username: string;
    userDepartment: {
      department: {
        id: number;
        name: string;
      };
    }[];
  };
}

export interface LeaveRequestPayload {
  leaveTypeId: number;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
}

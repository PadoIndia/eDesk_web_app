//Leave Types

export interface LeaveType {
  id: number;
  name: string;
  isPaid: boolean;
  description: string;
  schemesCount: number;
}

export interface LeaveScheme {
  id: number;
  name: string;
  description: string;
  slug: string;
  leaveTypesCount: number;
  usersCount: number;
}

export interface LeaveTypeScheme {
  id: number;
  leaveSchemeId: number;
  leaveTypeId: number;
  maxCarryForward: number;
  allowedAfterMonths?: number;
  isEarned: IsEarned;
  leaveType: LeaveType;
}


export enum IsEarned {
  YES = 'YES',
  NO = 'NO'
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
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED'
}

export interface CreateLeaveRequestRequest {
  leaveTypeId: number;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  duration: number;
  reason: string;
  managerId: number;
  hrId: number;
}

export interface UpdateLeaveRequestRequest {
  leaveTypeId?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  duration?: number;
  reason?: string;
}

export interface ManagerApproveRejectLeaveRequestRequest {
  status: LeaveRequestStatus.APPROVED | LeaveRequestStatus.REJECTED;
  comment?: string;
}

export interface HRApproveRejectLeaveRequestRequest {
  status: LeaveRequestStatus.APPROVED | LeaveRequestStatus.REJECTED;
  comment?: string;
}

export interface ApproveRejectLeaveRequestRequest {
  status: LeaveRequestStatus.APPROVED | LeaveRequestStatus.REJECTED;
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
  sortBy?: 'submittedOn' | 'startDate' | 'endDate' | 'employeeName' | 'leaveType';
  sortOrder?: 'asc' | 'desc';
}

export interface GetManagerLeaveRequestsQuery {
  leaveTypeId?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  page?: number;
  limit?: number;
  sortBy?: 'submittedOn' | 'startDate' | 'endDate' | 'employeeName' | 'leaveType';
  sortOrder?: 'asc' | 'desc';
}

export interface GetHRLeaveRequestsQuery {
  leaveTypeId?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  page?: number;
  limit?: number;
  sortBy?: 'submittedOn' | 'startDate' | 'endDate' | 'employeeName' | 'leaveType';
  sortOrder?: 'asc' | 'desc';
}

export interface GetMyLeaveRequestsQuery {
  managerStatus?: LeaveRequestStatus;
  hrStatus?: LeaveRequestStatus;
  leaveTypeId?: number;
  startDate?: string; // ISO date string
  endDate?: string; // ISO date string
  page?: number;
  limit?: number;
  sortBy?: 'submittedOn' | 'startDate' | 'endDate' | 'leaveType';
  sortOrder?: 'asc' | 'desc';
}

// Request types for Leave Transactions
export interface CreateLeaveTransactionRequest {
  userId: number;
  year: number;
  month: number; // 1-12
  date: number; // 1-31
  leaveTypeId: number;
  count: number; // Can be negative for deductions
  comment?: string;
  assignedBy?: number;
}

export interface UpdateLeaveTransactionRequest {
  count?: number;
  comment?: string;
  commentBy?: number;
}

// Query parameter types for Leave Transactions
export interface LeaveTransactionFilters {
  userId?: number;
  leaveTypeId?: number;
  year?: number;
  month?: number; // 1-12
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: 'createdOn' | 'year' | 'month' | 'date' | 'count' | 'userName' | 'leaveType';
  sortOrder?: 'asc' | 'desc';
}

export interface LeaveBalance {
  userId: number;
  leaveTypeId: number;
  leaveTypeName: string;
  totalAllocated: number;
  totalUsed: number;
  currentBalance: number;
  pendingRequests: number;
  availableBalance: number;
}

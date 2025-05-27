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


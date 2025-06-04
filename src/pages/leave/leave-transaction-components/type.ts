export interface LeaveTransaction {
  id: number;
  userId: number;
  userName?: string;
  year: number;
  month: number;
  date: number;
  leaveType?: string;
  leaveTypeId: number;
  count: number;
  comment: string | null;
  createdOn: string;
  assignedByName: string | null;
}
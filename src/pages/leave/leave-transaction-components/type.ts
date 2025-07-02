export interface LeaveTransaction {
  id: number;
  userId: number;
  user: { name: string };
  year: number;
  month: number;
  date: number;
  leaveType?: string;
  leaveTypeId: number;
  count: number;
  comment: string | null;
  createdOn: string;
  assignedById: number;
  assignedBy: { name: string | null };
}

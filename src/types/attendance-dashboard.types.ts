// attendance-dashboard.types

export interface MissPunchRequestData {
    userId: number;
    date: number;
    month: number;
    year: number;
    hh: number;
    mm: number;
    missPunchReason: string;
    departmentId?: number;
};

export interface ManualStatusData  {
    userId: number;
    date: number;
    month: number;
    year: number;
    status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'WEEK_OFF' | 'HOLIDAY' | 'SICK_LEAVE' | 'CASUAL_LEAVE' | 'PAID_LEAVE' | 'UNPAID_LEAVE' | 'COMPENSATORY_LEAVE';
    comment?: string;
    commentBy?: number;
}

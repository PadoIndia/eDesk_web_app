export type punchData = {
  date: number;
  month: number;
  year: number;
  hh: number;
  mm: number;
  type: 'AUTO'|'MANUAL';
  isApproved?: boolean;
  approvedBy?: number;
  missPunchReason?: string;
  comment?: string;
  approvedOn?: string;
};

export type updatePunchData = {
  date?: number;
  month?: number;
  year?: number;
  hh?: number;
  mm?: number;
  type?: 'AUTO'|'MANUAL';
  isApproved?: boolean;
  approvedBy?: number;
  missPunchReason?: string;
  comment?: string;
  approvedOn?: string;
};


export type getPunchData = {
    month:number;
    year:number;
};
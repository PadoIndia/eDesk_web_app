export type PunchPayload = {
  userId: number;
  date: number;
  month: number;
  year: number;
  hh: number;
  mm: number;
  missPunchReason?: string;
  comment?: string;
};

export interface PunchQueryParams {
  year?: number;
  month?: number;
  date?: number;
  isApproved?: boolean;
  userId?: number;
  type?: "AUTO" | "MANUAL";
}

export interface PunchResponse {
  id: number;
  userId: number;
  date: number;
  month: number;
  year: number;
  hh: number;
  mm: number;
  type: "AUTO" | "MANUAL";
  isApproved: boolean;
  missPunchReason?: string;
  comment?: string;
  approvedBy?: number;
  approvedOn: string | null;
  createdOn: string;
  updatedOn?: string;
  user: {
    name: string | null;
    empCode: string | null;
    profileImg: {
      url: string;
    } | null;
  };
  department?: {
    name: string;
  };
  approverUser: {
    name: string | null;
  } | null;
}

export interface ApprovePayload {
  comment?: string;
  isApproved: boolean;
}

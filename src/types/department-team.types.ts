export interface User {
  id: number;
  name: string;
  email: string;
}
export interface Department {
  id: number;
  name: string;
  slug: string;
  responsibilities: string | null;
  createdOn: Date;
  updatedOn: Date | null;
  teams?: Team[];
}

export interface DepartmentResponse {
  id: number;
  name: string;
  createdOn: string;
  updatedOn: string | null;
  slug: string;
  responsibilities: string | null;
  teams: Team[];
}

export interface UpdateUserDepartmentPayload {
  isAdmin: boolean;
  departmentId: number;
}

export interface UpdateUserTeamPayload {
  isAdmin: boolean;
  teamId: number;
}

export interface TeamPayload {
  name: string;
  slug: string;
  responsibilities: string;
}

export interface Team {
  id: number;
  name: string;
  slug: string;
  responsibilities?: string;
  createdOn: string;
  updatedOn?: string;
}

export interface TeamResponse {
  id: number;
  name: string;
  slug: string;
  responsibilities?: string;
  createdOn: string;
  updatedOn?: string;
  _count: {
    users: number;
  };
}
export interface SingleTeamResponse extends Omit<TeamResponse, "_count"> {
  departmentTeams: {
    departmentId: number;
  }[];
}

export interface DepartmentTeamResponse {
  id: number;
  departmentId: number;
  teamId: number;
}
export interface UserDepartment {
  id: number;
  userId: number;
  departmentId: number;
  isAdmin: boolean;
  createdOn: Date;
  updatedOn?: Date;
}
export interface UserTeam {
  id: number;
  userId: number;
  teamId: number;
  isAdmin: boolean;
}

export interface UserTeamResp {
  team: {
    name: string;
  };
  id: number;
  createdOn: Date;
  updatedOn: Date | null;
  userId: number;
  teamId: number;
  isAdmin: boolean;
}

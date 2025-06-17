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
  createdOn: Date;
  updatedOn: Date | null;
  slug: string;
  responsibilities: string | null;
  teams: Team[];
}

export interface UpdateUserDepartmentPayload {
  isAdmin: boolean;
  departmentId: number;
}

export interface DepartmentTeamLink {
  id: number;
  departmentId: number;
  teamId: number;
  team: Team;
}

export interface Team {
  id: number;
  name: string;
  slug: string;
  responsibilities?: string;
  createdOn: Date;
  updatedOn?: Date;
}
export interface DepartmentTeam {
  id: number;
  departmentId: number;
  teamId: number;
  department: Department;
  team: Team;
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

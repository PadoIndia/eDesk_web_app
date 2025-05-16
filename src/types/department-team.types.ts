export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Department {
  id: string;
  name: string;
  responsibilities:string;
  teams: Team[];
}

export interface Team {
  id: string;
  name: string;
  responsibilities:string;
  members: User[];
}
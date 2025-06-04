import { ApiResponse } from "../../types/axios.types";
import ApiService from "./api-service";

class TeamService extends ApiService {
  constructor() {
    super("/admin/team"); // Fixed: backend uses '/team' not '/team-management'
  }

  createTeam(team: {
    name: string;
    slug: string;
    responsibilities: string;
  }): ApiResponse {
    return this.postData("/", team);
  }

  getTeams(): ApiResponse {
    return this.getData("/");
  } // this only gets team data

  getTeamById(teamId: number): ApiResponse {
    return this.getData(`/${teamId}`);
  } // this gets team data and also users info in that team

  deleteTeam(teamId: number): ApiResponse {
    return this.deleteData(`/${teamId}`);
  }

  addUserToTeam(teamId: number, data:{ userId: number, isAdmin: boolean }): ApiResponse{
    return this.postData(`/${teamId}/add-user`, data);
  } // this addes users to a team 

  removeUserFromTeam(userId: number, teamId: number):ApiResponse {
    return this.deleteData(`/${userId}/${teamId}/remove-user`);
  } // this removes users from a team

  getManagerByUserId(userId: number): ApiResponse {
    return this.getData(`/manager/${userId}`);
  }

  



}

export default new TeamService();
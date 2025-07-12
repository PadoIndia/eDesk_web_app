import { ApiResponse } from "../../types/axios.types";
import {
  SingleTeamResponse,
  Team,
  TeamPayload,
  TeamResponse,
} from "../../types/department-team.types";
import ApiService from "./api-service";

class TeamService extends ApiService {
  constructor() {
    super("/admin/teams");
  }

  createTeam(team: TeamPayload): ApiResponse<Team> {
    return this.postData("/", team);
  }

  getTeams(): ApiResponse<TeamResponse[]> {
    return this.getData("/");
  }

  getTeamById(teamId: number): ApiResponse<SingleTeamResponse> {
    return this.getData(`/${teamId}`);
  }

  updateTeam(teamId: number, data: Partial<TeamPayload>) {
    return this.putData(`/${teamId}`, data);
  }

  deleteTeam(teamId: number): ApiResponse {
    return this.deleteData(`/${teamId}`);
  }

  addUserToTeam(
    teamId: number,
    data: { userId: number; isAdmin: boolean }
  ): ApiResponse {
    return this.postData(`/${teamId}/users`, data);
  }
  updateTeamUser(
    userId: number,
    teamId: number,
    isAdmin: boolean
  ): ApiResponse {
    return this.putData(`/${teamId}/users/${userId}`, { isAdmin });
  }

  removeUserFromTeam(userId: number, teamId: number): ApiResponse {
    return this.deleteData(`/${teamId}/users/${userId}`);
  }

  getManagerByUserId(userId: number): ApiResponse {
    return this.getData(`/manager/${userId}`);
  }

  getUserTeams(): ApiResponse {
    return this.getData(`/get-user-teams`);
  }
}

export default new TeamService();

import { ApiResponse } from "../../types/axios.types";
import { User } from "../../types/user.types";
import ApiService from "./api-service";

class UserService extends ApiService {
  constructor() {
    super("/users");
  }
  getAllUsers(): ApiResponse<User[]> {
    return this.getData(``);
  }
    getUserById(id:number): ApiResponse<User> {
    return this.getData(`/${id}`);
  }
}

export default new UserService();

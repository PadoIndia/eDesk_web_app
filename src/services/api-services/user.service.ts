import { ApiResponse } from "../../types/axios.types";
import { User, UserDataDetails } from "../../types/user.types";
import ApiService from "./api-service";

class UserService extends ApiService {
  constructor() {
    super("admin/users");
  }
  getAllUsers(): ApiResponse<User[]> {
    return this.getData(``);
  }
  getUserById(id: number): ApiResponse<User> {
    return this.getData(`/${id}`);
  }
  updateUser(user: User): ApiResponse<User> {
    return this.putData(``, user);
  }
  createUser(user: User): ApiResponse<User> {
    return this.postData(``, user);
  }
  getUserDetailsById(id: number): ApiResponse<UserDataDetails> {
    return this.getData(`/details/${id}`);
  }
}

export default new UserService();

import { BASE_URL } from "../../store/config";
import { ApiResponse } from "../../types/axios.types";
import {
  UpdateUserDepartmentPayload,
  UpdateUserTeamPayload,
} from "../../types/department-team.types";
import {
  Address,
  Contact,
  CreateContact,
  User,
  Document,
  AdminUser,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateSelfPayload,
} from "../../types/user.types";
import ApiService from "./api-service";

class UserService extends ApiService {
  constructor() {
    super("/admin/users");
  }
  getAllUsers(): ApiResponse<User[]> {
    return this.getData(``);
  }
  getUserById(id: number): ApiResponse<AdminUser> {
    return this.getData(`/${id}`);
  }

  updateUser(id: number, user: UpdateUserPayload): ApiResponse<number> {
    return this.putData(`/${id}`, user);
  }
  updateSelf(user: UpdateSelfPayload): ApiResponse<number> {
    return this.putData(BASE_URL + "/users", user);
  }
  createUser(user: CreateUserPayload): ApiResponse<User> {
    return this.postData(``, user);
  }

  getUserContactsById(id: number): ApiResponse<Contact> {
    return this.getData(`/contacts/${id}`);
  }

  createUserContact(conatct: CreateContact): ApiResponse<CreateContact> {
    console.log("contact details", conatct);
    return this.postData(`/contacts`, conatct);
  }

  getUserAddressById(id: number): ApiResponse<Address> {
    return this.getData(`/address/${id}`);
  }

  createUserAddress(address: Address): ApiResponse<Address> {
    return this.postData(`/address`, address);
  }

  createUserDocument(document: Document): ApiResponse {
    return this.postData(`/documents`, document);
  }

  getUserDocuments(userId: number): ApiResponse<Document[]> {
    return this.getData(`/${userId}/documents`);
  }

  updateUserDepartments(
    userId: number,
    data: UpdateUserDepartmentPayload[]
  ): ApiResponse<number[]> {
    return this.postData(`/${userId}/departments`, data);
  }

  updateUserTeams(
    userId: number,
    data: UpdateUserTeamPayload[]
  ): ApiResponse<number[]> {
    return this.postData(`/${userId}/teams`, data);
  }
}

export default new UserService();

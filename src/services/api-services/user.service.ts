import { BASE_URL } from "../../store/config";
import { ApiResponse } from "../../types/axios.types";
import {
  UpdateUserDepartmentPayload,
  UpdateUserTeamPayload,
} from "../../types/department-team.types";
import { LeaveTypeResponse } from "../../types/leave.types";
import { UserPermissionResponse } from "../../types/permission.types";
import {
  Address,
  CreateContact,
  User,
  AdminUser,
  CreateUserPayload,
  UpdateUserPayload,
  UpdateSelfPayload,
  ContactResponse,
  DocumentPayload,
  DocumentResponse,
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

  getUserContacts(userId: number): ApiResponse<ContactResponse> {
    return this.getData(`/${userId}/contacts`);
  }

  createUserContact(
    userId: number,
    conatct: CreateContact
  ): ApiResponse<ContactResponse> {
    console.log("contact details", conatct);
    return this.postData(`/${userId}/contacts`, conatct);
  }
  updateUserContact(
    userId: number,
    contactId: number,
    data: Partial<CreateContact>
  ): ApiResponse<ContactResponse> {
    return this.putData(`/${userId}/contacts/${contactId}`, data);
  }

  getUserAddresses(userId: number): ApiResponse<Address> {
    return this.getData(`/${userId}/address`);
  }

  createUserAddress(
    userId: number,
    address: Omit<Address, "id">
  ): ApiResponse<Address> {
    return this.postData(`/${userId}/address`, address);
  }
  updateUserAddress(
    userId: number,
    addressId: number,
    address: Partial<Omit<Address, "id">>
  ): ApiResponse<Address> {
    return this.putData(`/${userId}/address/${addressId}`, address);
  }

  createUserDocument(
    userId: number,
    document: DocumentPayload
  ): ApiResponse<DocumentResponse> {
    return this.postData(`/${userId}/documents`, document);
  }

  getUserDocuments(userId: number): ApiResponse<DocumentResponse[]> {
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

  getUserPermissions(userId: number): ApiResponse<UserPermissionResponse[]> {
    return this.getData(`/${userId}/permissions`);
  }
  addUserPermission(userId: number, permissionId: number): ApiResponse<number> {
    return this.postData(`/${userId}/permissions`, { permissionId });
  }
  removeUserPermission(
    userId: number,
    permissionId: number
  ): ApiResponse<number> {
    return this.deleteData(`/${userId}/permissions/${permissionId}`);
  }

  getLeaveTypesByUserId(userId: number): ApiResponse<LeaveTypeResponse[]> {
    return this.getData(`/${userId}/leave-types`);
  }
}

export default new UserService();

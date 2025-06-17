import { ApiResponse } from "../../types/axios.types";
import {
  Address,
  Contact,
  CreateContact,
  CreateUserDetails,
  UpdateUser,
  User,
  UserDataDetails,
  Document
} from "../../types/user.types";
import ApiService from "./api-service";

class UserService extends ApiService {
  constructor() {
    super("/admin/users");
  }
  getAllUsers(): ApiResponse<User[]> {
    return this.getData(``);
  }
  getUserById(id: number): ApiResponse<User> {
    return this.getData(`/${id}`);
  }
  updateUser(id: number, user: UpdateUser): ApiResponse<UpdateUser> {
    return this.putData(`/${id}`, user);
  }
  createUser(user: Partial<User>): ApiResponse<User> {
    return this.postData(``, user);
  }

  //////////////////////// User Details ////////////////////////
  getUserDetailsById(id: number): ApiResponse<UserDataDetails> {
    return this.getData(`/details/${id}`);
  }

  getUserDetails():ApiResponse<UserDataDetails[]> {
    return this.getData(`/details`);
  }

  createUserDetails(data: CreateUserDetails): ApiResponse{
    console.log("this is create user details api", data);
    
    return this.postData(`/details`, data);
  }

  /////////////////////// User Contacts ///////////////////////
  getUserContactsById(id: number): ApiResponse<Contact> {
    return this.getData(`/contacts/${id}`);
  }

  createUserContact(conatct: CreateContact): ApiResponse<CreateContact> {
      console.log("contact details",conatct);
      
    return this.postData(`/contacts`, conatct);
  }

  //////////////////////// User Address ///////////////////////

  getUserAddressById(id: number): ApiResponse<Address> {
    return this.getData(`/address/${id}`);
  }

  createUserAddress(address: Address): ApiResponse<Address> {
    return this.postData(`/address`, address);
  }
  
  /////////////////////// User Document ///////////////////////
  
  createUserDocument(document:Document): ApiResponse{
    return this.postData(`/documents`, document);
  }

  getUserDocuments(): ApiResponse<Document[]> {
    return this.getData(`/documents`);
  }

}

export default new UserService();

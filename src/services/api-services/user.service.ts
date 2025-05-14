import { ApiResponse } from "../../types/axios.types";
import { Address, Contact, CreateContact, User, UserDataDetails } from "../../types/user.types";
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

  //////////////////////// User Details ////////////////////////
  getUserDetailsById(id: number): ApiResponse<UserDataDetails> {
    return this.getData(`/details/${id}`);
  }

  /////////////////////// User Contacts ///////////////////////
  getUserContactsById(id:number):ApiResponse<Contact>{
    return this.getData(`/contacts/${id}`);
  }

  createUserContact(conatct:CreateContact): ApiResponse<CreateContact>{
    return this.postData(`/contacts`,conatct);
  }

  //////////////////////// User Address ///////////////////////

  getUserAddressById(id:number): ApiResponse<Address> {
    return this.getData(`/address/${id}`);
  }

  createUserAddress(address:Address): ApiResponse<Address>{
    return this.postData(`/address`,address);
  }


}

export default new UserService();

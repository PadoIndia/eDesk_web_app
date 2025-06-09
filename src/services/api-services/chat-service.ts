import { ApiResponse } from "../../types/axios.types";
import {
  ChatPayload,
  SingleChatResp,
  ChatItem,
  MessageResp,
} from "../../types/chat";
import ApiService from "./api-service";

class ChatService extends ApiService {
  constructor() {
    super("/chats");
  }

  getAllChats(type: "STANDARD" | "TASK" | "GROUP"): ApiResponse<ChatItem[]> {
    return this.getData(`?type=${type}`);
  }

  getChatDetails(id: number): ApiResponse<SingleChatResp> {
    return this.getData(`/${id}`);
  }

  getChatMessages(id: number, page?: number): ApiResponse<MessageResp[]> {
    if (page) {
      return this.getData(`/${id}/messages?page=${page}`);
    }
    return this.getData(`/${id}/messages`);
  }

  createNewChat(data: ChatPayload): ApiResponse<number> {
    return this.postData("", data);
  }

  updateChat(id: number, data: Partial<ChatPayload>): ApiResponse {
    return this.putData(`/${id}`, data);
  }

  updateJoinStatus(id: number, status: "APPROVED" | "REJECTED"): ApiResponse {
    return this.postData(`/${id}/join`, { status });
  }

  addParticipant(id: number, userId: number): ApiResponse {
    return this.postData(`/${id}/participants`, { userId });
  }

  removeParticipant(id: number, userId: number): ApiResponse {
    return this.deleteData(`/${id}/participants/${userId}`);
  }
  updateParticipant(id: number, userId: number, isAdmin: boolean): ApiResponse {
    return this.putData(`/${id}/participants/${userId}`, { isAdmin });
  }

  addSubtasks(id: number, data: string[]): ApiResponse {
    return this.postData(`/${id}/subtasks`, data);
  }

  removeSubTask(id: number, subTaskId: number): ApiResponse {
    return this.deleteData(`/${id}/subtasks/${subTaskId}`);
  }
}

export default new ChatService();

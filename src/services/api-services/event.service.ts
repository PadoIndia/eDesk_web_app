import { ApiResponse } from "../../types/axios.types";
import { EventPayload, EventResponse } from "../../types/event.types";
import ApiService from "./api-service";

class EventService extends ApiService {
  constructor() {
    super("/events");
  }
  getAllEvents(): ApiResponse<EventResponse[]> {
    return this.getData("");
  }
  getEventById(id: number): ApiResponse<EventResponse> {
    return this.getData(`/${id}`);
  }
  createEvent(data: EventPayload): ApiResponse<number> {
    return this.postData(``, data);
  }
  updateEvent(
    id: number,
    data: Partial<EventPayload>
  ): ApiResponse<Omit<EventResponse, "ecVideos">> {
    return this.putData(`/${id}`, data);
  }
  deleteEvent(id: number): ApiResponse<Omit<EventResponse, "ecVideos">> {
    return this.deleteData(`/${id}`);
  }
  addToGroup(id: number, groupId: number): ApiResponse {
    return this.postData(`/${id}/groups/${groupId}`, {});
  }

  removeFromGroup(id: number, groupId: number): ApiResponse {
    return this.deleteData(`/${id}/groups/${groupId}`, {});
  }
}

export default new EventService();

import { ApiResponse } from "../../types/axios.types";
import { EventGroupPayload, EventGroupResponse } from "../../types/event.types";
import ApiService from "./api-service";

class EventGroupService extends ApiService {
  constructor() {
    super("/event-groups");
  }
  getAllEventGroups(): ApiResponse<EventGroupResponse[]> {
    return this.getData(``);
  }
  getEventGroupById(id: number): ApiResponse<EventGroupResponse> {
    return this.getData(`/${id}`);
  }
  createEventGroup(data: EventGroupPayload): ApiResponse<number> {
    return this.postData(``, data);
  }
  updateEventGroup(id: number, data: Partial<EventGroupPayload>) {
    return this.putData(`/${id}`, data);
  }
  deleteGroupEvent(id: number) {
    return this.deleteData(`/${id}`);
  }
}

export default new EventGroupService();

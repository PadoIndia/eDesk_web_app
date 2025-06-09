import { useCallback, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import chatService from "../../../services/api-services/chat-service";
import { getChatDetails } from "../../../features/chat-slice";
import ContactTile from "./contact-tile";
import { User } from "../../../types/user.types";
import { getAvailableUsers } from "../../../features/user-slice";

type Props = {
  onSave: () => void;
  isAdmin: boolean;
};

const ParticipantModal = ({ onSave, isAdmin }: Props) => {
  const dispatch = useAppDispatch();
  const userReducer = useAppSelector((s) => s.userReducer);
  const chat = useAppSelector((s) => s.chatReducer.chatDetails);
  const contacts = userReducer.data;
  const [participants, setParticipants] = useState<number[]>([]);
  const [search, setSearch] = useState("");
  const chParticipants = chat?.participants.map((i) => i.user.id);

  const isAlreadyInChat = (id: number) => {
    return chParticipants?.includes(id);
  };

  const filtered = contacts?.filter(
    (i) =>
      i.name?.toLowerCase().includes(search.toLowerCase()) &&
      !isAlreadyInChat(i.id)
  );

  const toggleSelection = useCallback(
    (contact: User) => {
      if (chat?.id && isAdmin) {
        if (participants.includes(contact.id)) {
          chatService.removeParticipant(chat.id, contact.id).then((res) => {
            if (res.status == "success") {
              setParticipants((prev) => prev.filter((p) => p !== contact.id));
            }
          });
        } else {
          chatService.addParticipant(chat.id, contact.id).then((res) => {
            if (res.status == "success") {
              setParticipants((prev) => [...prev, contact.id]);
            }
          });
        }
      }
    },
    [chat?.id, isAdmin, participants]
  );

  const handleSave = () => {
    if (chat?.id) {
      if (participants.length > 0) dispatch(getChatDetails(chat?.id));
      onSave();
    }
  };

  const renderItem = useCallback(
    (item: User) => (
      <ContactTile
        isGroupSelection={true}
        isSelected={participants.includes(item.id)}
        item={item}
        toggleSelection={toggleSelection}
        key={item.id}
      />
    ),
    [participants, toggleSelection]
  );

  useEffect(() => {
    dispatch(getAvailableUsers());
    return () => {
      if (chat?.id) dispatch(getChatDetails(chat?.id));
    };
  }, []);

  if (userReducer.isLoading)
    return <div className="spinner-border" role="status" />;

  return (
    <div
      className="d-flex flex-column bg-white position-relative"
      style={{ height: "500px" }}
    >
      <div className="px-3 py-3 bg-white border-bottom">
        <p className="text-muted mb-0 small">{participants.length} selected</p>
      </div>
      <div className="flex-grow-1 overflow-auto">
        <div className="p-3">
          <input
            placeholder="Search Users"
            className="form-control"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="px-3">
          {filtered && filtered.length > 0 ? (
            filtered.map((item) => renderItem(item))
          ) : (
            <div className="text-center py-4">
              <p className="text-muted">No contacts found</p>
            </div>
          )}
        </div>
      </div>
      <div className="p-3 border-top bg-light">
        <button
          disabled={participants.length <= 0}
          className="btn btn-primary w-100"
          onClick={handleSave}
        >
          <small className="text-white">{"Save"}</small>
        </button>
      </div>
    </div>
  );
};

export default ParticipantModal;

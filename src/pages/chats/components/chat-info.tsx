import { lazy, useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/store";
import { ChatParticipant } from "../../../types/chat";
import chatService from "../../../services/api-services/chat-service";
import { removeChatParticipant } from "../../../features/chat-slice";
import Avatar from "../../../components/avatar";
import UserTile from "./user-tile";
import { MdAdd } from "react-icons/md";
import Modal from "../../../components/ui/modals";

const ParticipantModal = lazy(() => import("./participant-modal"));

const ChatInfo = () => {
  const chat = useAppSelector((s) => s.chatReducer.chatDetails);
  const userId = useAppSelector((s) => s.auth.userData?.user.id);
  const isGroup = chat?.type !== "STANDARD";
  const [participant, setParticipant] = useState<ChatParticipant | null>(null);
  const isUserAdmin = chat?.participants.find(
    (i) => i.user.id == userId
  )?.isAdmin;
  const [admins, setAdmins] = useState<number[]>([]);
  const [showAddParticipant, setShowAddParticipant] = useState(false);
  const [removed, setRemoved] = useState<number[]>([]);

  const dispatch = useAppDispatch();

  const handleParticipantAction = (p: ChatParticipant) => {
    if (!isUserAdmin) return;
    if (p.user.id == userId || p.user.id == chat.createdById) return;
    setParticipant(p);
  };

  const makeAdmin = (p: ChatParticipant) => {
    if (p.joinStatus != "APPROVED") {
      // Show toast notification (you'll need to implement toast functionality)
      console.log("Awaiting request approval");
      return;
    }
    if (chat?.id) {
      chatService.updateParticipant(chat?.id, p.user.id, true).then((res) => {
        if (res.status == "success") {
          setAdmins((prev) => [...prev, p.user.id]);
          setParticipant(null);
        }
      });
    }
  };

  const removeParticipant = (p: ChatParticipant) => {
    // if (chat?.createdById !== userId) return;
    if (chat?.id) {
      chatService.removeParticipant(chat?.id, p.user.id).then((res) => {
        if (res.status == "success") {
          setParticipant(null);
          setRemoved((prev) => [...prev, p.user.id]);
          dispatch(removeChatParticipant(p.id));
        }
      });
    }
  };

  const makeUser = (p: ChatParticipant) => {
    if (chat?.id) {
      chatService.updateParticipant(chat?.id, p.user.id, false).then((res) => {
        if (res.status == "success") {
          setAdmins((prev) => prev.filter((i) => i !== p.user.id));
          setParticipant(null);
        }
      });
    }
  };

  useEffect(() => {
    if (chat) {
      setAdmins(
        chat.participants.filter((i) => i.isAdmin).map((i) => i.user.id) || []
      );
    }
  }, [chat]);

  return (
    <div className="bg-white min-vh-10" style={{ height: "600px" }}>
      <div className="row">
        <div className="col-12 p-0">
          <Modal
            isOpen={showAddParticipant}
            showCloseIcon
            title="Add Participants"
            onClose={() => setShowAddParticipant(false)}
          >
            <ParticipantModal
              onSave={() => setShowAddParticipant(false)}
              isAdmin={!!isUserAdmin}
            />
          </Modal>

          {/* Header */}
          <div
            className="d-flex justify-content-center align-items-start p-3"
            style={{ height: "100px" }}
          >
            <Avatar
              imageUrl={chat?.thumbnailImageUrl}
              title={chat?.title || ""}
              bgColor="#e3f2fd"
              size={80}
            />
          </div>

          {/* Title */}
          <h2 className="text-center fw-bold my-3">{chat?.title}</h2>

          {/* Description */}
          {chat?.description && (
            <div className="px-3">
              <h6 className="fw-bold mt-3 pt-3 border-top">Description</h6>
              <p className="text-muted">{chat.description}</p>
            </div>
          )}

          {/* Participants Section */}
          <div className="mx-3 mt-3 bg-light p-3 rounded">
            {isGroup && chat?.participants && (
              <>
                <h5 className="fw-bold mb-3">
                  Participants ({chat.participants.length})
                </h5>

                {/* Add Participants Button */}
                {isUserAdmin && (
                  <div
                    className="d-flex align-items-center mb-3 p-2 bg-white rounded cursor-pointer"
                    onClick={() => setShowAddParticipant(true)}
                    style={{ cursor: "pointer" }}
                  >
                    <div
                      className="rounded-circle bg-primary bg-opacity-25 d-flex align-items-center justify-content-center me-3"
                      style={{ width: "36px", height: "36px" }}
                    >
                      <MdAdd size={20} />
                    </div>
                    <span className="fw-bold">Add Participants</span>
                  </div>
                )}

                {/* Participants List */}
                {chat.participants
                  .filter((i) => !removed.includes(i.user.id))
                  .map((item) => (
                    <div key={item.id} className="mb-2">
                      <UserTile
                        userId={userId}
                        item={item}
                        onPress={handleParticipantAction}
                        badge={
                          admins.includes(item.user.id) ? (
                            <span className="badge bg-success">Admin</span>
                          ) : (
                            item.joinStatus !== "APPROVED" && (
                              <span
                                className={`badge ${
                                  item.joinStatus == "PENDING"
                                    ? "bg-warning"
                                    : "bg-secondary"
                                }`}
                              >
                                {item.joinStatus == "PENDING"
                                  ? "Pending"
                                  : "Rejected"}
                              </span>
                            )
                          )
                        }
                      />
                    </div>
                  ))}
              </>
            )}
          </div>

          {/* Participant Actions Modal */}
          {participant && (
            <div
              className="modal fade show d-block"
              style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
            >
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-body p-4">
                    {isUserAdmin && (
                      <>
                        {!admins.includes(participant.user.id) &&
                          participant.joinStatus == "APPROVED" && (
                            <button
                              className="btn btn-outline-primary w-100 mb-3"
                              onClick={() => makeAdmin(participant)}
                            >
                              Make Group Admin
                            </button>
                          )}

                        {userId == chat?.createdById &&
                          admins.includes(participant.user.id) && (
                            <button
                              className="btn btn-outline-warning w-100 mb-3"
                              onClick={() => makeUser(participant)}
                            >
                              Dismiss as Admin
                            </button>
                          )}

                        {(userId == chat.createdById ||
                          !participant.isAdmin) && (
                          <button
                            className="btn btn-outline-danger w-100 mb-3"
                            onClick={() => removeParticipant(participant)}
                          >
                            Remove {participant.user.name}
                          </button>
                        )}
                      </>
                    )}

                    <button
                      className="btn btn-secondary w-100"
                      onClick={() => setParticipant(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInfo;

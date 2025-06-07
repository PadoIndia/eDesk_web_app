import { ReactNode } from "react";
import Avatar from "../../../components/avatar";
import { ChatParticipant } from "../../../types/chat";

type Props = {
  item: ChatParticipant;
  onPress: (item: ChatParticipant) => void;
  badge?: ReactNode;
  userId?: number;
};

const UserTile = ({ item, onPress, badge, userId }: Props) => {
  return (
    <div
      className="d-flex justify-content-between align-items-start mb-1 py-2 px-3 bg-white rounded cursor-pointer user-tile"
      onClick={() => onPress(item)}
      style={{ cursor: "pointer" }}
    >
      <div className="d-flex align-items-center" style={{ width: "80%" }}>
        <Avatar
          imageUrl={item.user.profileUrl}
          title={item.user.name}
          size={36}
        />
        <div className="ms-3">
          <div className="fw-bold text-dark small">
            {userId == item.user.id ? "You" : item.user.name}
          </div>
          <div className="text-muted small">{item.user.username}</div>
        </div>
      </div>
      {badge && <div className="badge-container">{badge}</div>}
    </div>
  );
};

export default UserTile;

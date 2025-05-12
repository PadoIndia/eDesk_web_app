import { GrView } from "react-icons/gr";

type Props = {
  videoId: number;
  viewCount: number;
};

export default function ViewersButton({ viewCount }: Props) {
  return (
    <span className="d-flex align-items-center gap-2">
      <GrView />
      {viewCount} views
    </span>
  );
}

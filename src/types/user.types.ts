export type User = {
  profileImg: {
    id: bigint | undefined;
    url: string | null;
  };
  id: number;
  name: string | null;
  username: string;
  status: string | null;
  isActive: boolean;
  lastSeen: Date | null;
  contact: string;
};

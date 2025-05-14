// types.ts
export type User = {
  id: number;
  name: string | null;
  username: string;
  contact: string;
  profileImg: {
    id?: bigint;
    url: string | null;
  };
  status: string | null;
  isActive: boolean;
  lastSeen: Date | null;
};

export type UserDataDetails = {
  id: number;
  gender: string;
  dob: string;
  joiningDate: string;
  createdOn: string;
  leaveSchemeId?: number;
  updatedOn: string;
  userId: number;
  weekoff: string;
};

export type Contact = {
  id: number;
  relation: string;
  name: string;
  value: string;
  contactType: "EMAIL" | "WHATSAPP" | "PHONE" | "OTHER";
};

export type CreateContact = {
  relation: string;
  name: string;
  value: string;
  contactType: "EMAIL" | "WHATSAPP" | "PHONE" | "OTHER";
}

export type Address = {
  id?: number;
  addressType: "PERMANENT" | "CURRENT";
  address: string;
  landmark?: string|null;
  pincode: string;
  state: string;
  city: string;
  isPrimary?: boolean;
  isActive?: boolean;
};

export type Document = {
  id: number;
  title: string;
  fileUrl: string;
  documentType: "AADHAR" | "PAN" | "PASSPORT" | "VOTER_ID" | "DRIVING_LICENCE";
};

export type DetailItemProps = {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  editValue?: string;
  onChange?: (val: string) => void;
  isEditing?: boolean;
  badgeClass?: string;
};

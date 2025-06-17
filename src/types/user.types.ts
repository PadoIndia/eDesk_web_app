// types.ts
export type User = {
  id: number;
  name: string | null;
  username: string;
  contact: string;
  password?: string;
  profileImg: {
    id?: bigint;
    url: string | null;
  };
  empCode?: string;
  status: string | null;
  isActive: boolean;
  lastSeen: Date | null;
};

export type UpdateUser = {
  name?: string;
  username?: string;
  contact?: string;
  empCode?: string;
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

export type CreateUserDetails = {
  gender: string;
  dob: string;
  joiningDate: string;
  leaveSchemeId?: number;
  weekoff: string;
}

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
};

export type Address = {
  id?: number;
  addressType: "PERMANENT" | "CURRENT";
  address: string;
  landmark?: string | null;
  pincode: string;
  state: string;
  city: string;
  isPrimary?: boolean;
  isActive?: boolean;
};

// export type Document = {
//   title: string;
//   fileId: number;
//   documentType: "AADHAR" | "PAN" | "PASSPORT" | "VOTER_ID" | "DRIVING_LICENCE";
//   file?: File | null;
// };

export type DetailItemProps = {
  icon?: React.ReactNode;
  label: string;
  value?: string;
  editValue?: string;
  onChange?: (val: string) => void;
  isEditing?: boolean;
  badgeClass?: string;
};



export interface FileDetails {
  id: string;
  name: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl: string;
  hash: string;
  type: string;
  createdAt: string;
  updatedOn: string;
  createdById: number;
  compression?: null;
  dimensions?: null;
  duration?: number;
  pages?: number;
  resolution?: null;
}

export interface Document {
  id?: number;
  title: string;
  fileId: number;
  documentType: "AADHAR" | "PAN" | "PASSPORT" | "VOTER_ID" | "DRIVING_LICENCE";
  createdOn?: string;
  updatedOn?: string;
  // userId: number;
  file?: FileDetails | null;
}
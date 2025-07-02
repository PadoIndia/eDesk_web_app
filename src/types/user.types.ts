export type User = {
  id: number;
  name: string;
  username: string;
  contact: string;
  password: string | null;
  profileImg: {
    id?: bigint;
    url: string | null;
  };
  empCode: string | null;
  status: string | null;
  isActive: boolean;
  lastSeen: Date | null;
};

export type TGender = "MALE" | "FEMALE" | "OTHER";

export type AdminUser = Prettify<
  User & {
    userDetails: UserDetails | null;
    userDepartment: UserDepartmentResp[];
    userTeam: UserTeamResp[];
  }
>;
export type UserDepartmentResp = {
  department: { name: string; slug: string };
  isAdmin: boolean;
  departmentId: number;
};
export type UserTeamResp = {
  team: { name: string; slug: string };
  isAdmin: boolean;
  teamId: number;
};

export type UserInfo = Prettify<
  Omit<User, "id" | "profileImg" | "lastSeen" | "status">
>;

export type UserDetails = {
  joiningDate: string;
  dob: string | null;
  gender: TGender;
  leaveSchemeId: number | null;
  weekoff?: string;
};

export type CreateUserPayload = Prettify<
  UserInfo & {
    userDetails: UserDetails;
    departments: { isAdmin: boolean; departmentId: number }[];
    teams: { isAdmin: boolean; teamId: number }[];
  }
>;

export type UpdateUserPayload = Prettify<
  Omit<CreateUserPayload, "departments" | "teams" | "dob"> & { dob?: string }
>;

export type UpdateSelfPayload = {
  name?: string;
  profileImgId?: number;
  status?: "ONLINE" | "OFFLINE";
  lastSeen?: string;
  notificationToken?: string;
  dob?: string;
  gender?: TGender;
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

export type TPermission =
  | "can_access_ecloud"
  | "can_create_ecloud_event"
  | "can_create_ecloud_event_group"
  | "can_manage_user"
  | "can_assign_team"
  | "can_add_leaves"
  | "is_admin"
  | "is_admin_department"
  | "is_admin_team";

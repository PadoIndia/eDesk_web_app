export interface PermissionResponse {
  id: number;
  slug: string;
  title: string;
  description: string;
  adminMenuId: number | null;
}

export interface UserPermissionResponse {
  permission: {
    slug: string;
    title: string;
  };
  id: number;
  createdOn: Date;
  updatedOn: Date | null;
  userId: number;
  permissionId: number;
  assignedById: number;
  assignedBy: {
    name: string;
  };
}

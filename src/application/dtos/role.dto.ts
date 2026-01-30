import { UserRole } from '../../domain/entities';

export interface RoleDTO {
  code: UserRole;
  name: string;
  description: string;
}

export interface RolePermissionDTO {
  module: string;
  action: string;
  allowed: boolean;
}

export interface RoleWithPermissionsDTO extends RoleDTO {
  permissions: RolePermissionDTO[];
}

import { UserRole, UserStatus } from '../../domain/entities';

export interface CreateUserDTO {
  email: string;
  password: string;
  fullName: string;
  phone?: string;
  role: UserRole;
}

export interface UpdateUserDTO {
  email?: string;
  fullName?: string;
  phone?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface ChangePasswordDTO {
  currentPassword: string;
  newPassword: string;
}

export interface ResetPasswordDTO {
  newPassword: string;
}

export interface ListUsersDTO {
  page?: number;
  pageSize?: number;
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface UserResponseDTO {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
}

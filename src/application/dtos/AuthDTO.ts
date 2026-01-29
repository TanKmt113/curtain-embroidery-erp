import { UserRole, UserWithoutPassword } from '../../domain/entities';

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginResponseDTO {
  accessToken: string;
  refreshToken: string;
  user: UserWithoutPassword;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface RefreshTokenResponseDTO {
  accessToken: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

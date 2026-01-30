import { User, UserRole, UserStatus } from '../entities/User';
import { PaginationOptions, PaginatedResult } from './ICustomerRepository';

export interface UserFilters {
  search?: string;
  role?: UserRole;
  status?: UserStatus;
}

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findAll(
    filters: UserFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<User>>;
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User>;
  update(id: string, data: Partial<User>): Promise<User>;
  delete(id: string): Promise<void>;
}

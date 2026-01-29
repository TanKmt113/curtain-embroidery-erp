import { Customer, CustomerType } from '../entities/Customer';

export interface CustomerFilters {
  search?: string;
  type?: CustomerType;
  isActive?: boolean;
}

export interface PaginationOptions {
  page: number;
  pageSize: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ICustomerRepository {
  findById(id: string): Promise<Customer | null>;
  findByCode(code: string): Promise<Customer | null>;
  findByEmail(email: string): Promise<Customer | null>;
  findAll(
    filters: CustomerFilters,
    pagination: PaginationOptions
  ): Promise<PaginatedResult<Customer>>;
  create(customer: Omit<Customer, 'id' | 'code' | 'createdAt' | 'updatedAt'>): Promise<Customer>;
  update(id: string, data: Partial<Customer>): Promise<Customer>;
  delete(id: string): Promise<void>;
  getNextCode(): Promise<string>;
}

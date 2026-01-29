import { Product, ProductType } from '../entities/Product';

export interface ProductFilters {
  search?: string;
  type?: ProductType;
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

export interface IProductRepository {
  findById(id: string): Promise<Product | null>;
  findByCode(code: string): Promise<Product | null>;
  findAll(filters: ProductFilters, pagination: PaginationOptions): Promise<PaginatedResult<Product>>;
  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product>;
  update(id: string, data: Partial<Product>): Promise<Product>;
  delete(id: string): Promise<void>;
  getNextCode(type: ProductType): Promise<string>;
}

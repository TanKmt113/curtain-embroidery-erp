import { Order, OrderItem, OrderStatus } from '../entities/Order';
import { PaginationOptions, PaginatedResult } from './ICustomerRepository';

export interface OrderFilters {
  search?: string;
  customerId?: string;
  status?: OrderStatus;
  createdById?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface IOrderRepository {
  findById(id: string): Promise<Order | null>;
  findByIdWithItems(id: string): Promise<Order | null>;
  findByCode(code: string): Promise<Order | null>;
  findAll(filters: OrderFilters, pagination: PaginationOptions): Promise<PaginatedResult<Order>>;
  create(order: Omit<Order, 'id' | 'createdAt' | 'updatedAt'>): Promise<Order>;
  update(id: string, data: Partial<Order>): Promise<Order>;
  delete(id: string): Promise<void>;
  getNextCode(): Promise<string>;
  
  // Items
  addItem(item: Omit<OrderItem, 'id'>): Promise<OrderItem>;
  updateItem(id: string, data: Partial<OrderItem>): Promise<OrderItem>;
  removeItem(id: string): Promise<void>;
  getItems(orderId: string): Promise<OrderItem[]>;
}

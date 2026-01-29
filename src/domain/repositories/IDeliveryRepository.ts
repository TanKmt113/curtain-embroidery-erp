import { Delivery, DeliveryType, DeliveryStatus } from '../entities/Delivery';
import { PaginationOptions, PaginatedResult } from './ICustomerRepository';

export interface DeliveryFilters {
  orderId?: string;
  type?: DeliveryType;
  status?: DeliveryStatus;
  fromDate?: Date;
  toDate?: Date;
}

export interface IDeliveryRepository {
  findById(id: string): Promise<Delivery | null>;
  findByCode(code: string): Promise<Delivery | null>;
  findByOrderId(orderId: string): Promise<Delivery[]>;
  findAll(filters: DeliveryFilters, pagination: PaginationOptions): Promise<PaginatedResult<Delivery>>;
  create(delivery: Omit<Delivery, 'id' | 'createdAt' | 'updatedAt'>): Promise<Delivery>;
  update(id: string, data: Partial<Delivery>): Promise<Delivery>;
  delete(id: string): Promise<void>;
  getNextCode(type: DeliveryType): Promise<string>;
}

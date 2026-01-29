import { Quotation, QuotationItem, QuotationStatus } from '../entities/Quotation';
import { PaginationOptions, PaginatedResult } from './ICustomerRepository';

export interface QuotationFilters {
  search?: string;
  customerId?: string;
  status?: QuotationStatus;
  createdById?: string;
  fromDate?: Date;
  toDate?: Date;
}

export interface IQuotationRepository {
  findById(id: string): Promise<Quotation | null>;
  findByIdWithItems(id: string): Promise<Quotation | null>;
  findByCode(code: string): Promise<Quotation | null>;
  findAll(filters: QuotationFilters, pagination: PaginationOptions): Promise<PaginatedResult<Quotation>>;
  create(quotation: Omit<Quotation, 'id' | 'createdAt' | 'updatedAt'>): Promise<Quotation>;
  update(id: string, data: Partial<Quotation>): Promise<Quotation>;
  delete(id: string): Promise<void>;
  getNextCode(): Promise<string>;
  
  // Items
  addItem(item: Omit<QuotationItem, 'id'>): Promise<QuotationItem>;
  updateItem(id: string, data: Partial<QuotationItem>): Promise<QuotationItem>;
  removeItem(id: string): Promise<void>;
  getItems(quotationId: string): Promise<QuotationItem[]>;
}

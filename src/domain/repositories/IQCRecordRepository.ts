import { QCRecord, QCResult } from '../entities/QCRecord';
import { PaginationOptions, PaginatedResult } from './ICustomerRepository';

export interface QCRecordFilters {
  orderId?: string;
  inspectorId?: string;
  result?: QCResult;
  fromDate?: Date;
  toDate?: Date;
}

export interface IQCRecordRepository {
  findById(id: string): Promise<QCRecord | null>;
  findByCode(code: string): Promise<QCRecord | null>;
  findByOrderId(orderId: string): Promise<QCRecord[]>;
  findAll(filters: QCRecordFilters, pagination: PaginationOptions): Promise<PaginatedResult<QCRecord>>;
  create(qcRecord: Omit<QCRecord, 'id' | 'createdAt' | 'updatedAt'>): Promise<QCRecord>;
  update(id: string, data: Partial<QCRecord>): Promise<QCRecord>;
  delete(id: string): Promise<void>;
  getNextCode(): Promise<string>;
}

import { QCResult } from '../../domain/entities/QCRecord';

// ==================== QC Record DTOs ====================
export interface CreateQCRecordDto {
  orderId: string;
  result: QCResult;
  checkDate?: Date;
  defects?: string;
  notes?: string;
}

export interface UpdateQCRecordDto {
  result?: QCResult;
  defects?: string;
  notes?: string;
}

export interface QCRecordResponseDto {
  id: string;
  code: string;
  orderId: string;
  order?: {
    id: string;
    code: string;
    customerName: string;
  };
  result: QCResult;
  checkDate: Date;
  defects?: string;
  notes?: string;
  inspectorId: string;
  inspector?: {
    id: string;
    fullName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface QCRecordListQueryDto {
  orderId?: string;
  inspectorId?: string;
  result?: QCResult;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

// ==================== QC Statistics DTOs ====================
export interface QCStatisticsDto {
  totalInspected: number;
  passed: number;
  passedWithMinor: number;
  failed: number;
  passRate: number;
  defectsByType: { defect: string; count: number }[];
  byPeriod: {
    period: string;
    passed: number;
    failed: number;
  }[];
}
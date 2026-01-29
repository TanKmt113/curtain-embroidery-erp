import { QuotationStatus, ItemType } from '../../domain/entities/Quotation';

// ==================== Quotation DTOs ====================
export interface CreateQuotationDto {
  customerId: string;
  validUntil?: Date;
  notes?: string;
  items: CreateQuotationItemDto[];
}

export interface UpdateQuotationDto {
  validUntil?: Date;
  notes?: string;
  discount?: number;
}

export interface QuotationResponseDto {
  id: string;
  code: string;
  customerId: string;
  customer?: {
    id: string;
    code: string;
    name: string;
  };
  status: QuotationStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  validUntil?: Date;
  notes?: string;
  items?: QuotationItemResponseDto[];
  createdById: string;
  createdBy?: {
    id: string;
    fullName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface QuotationListQueryDto {
  search?: string;
  customerId?: string;
  status?: QuotationStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

// ==================== Quotation Item DTOs ====================
export interface CreateQuotationItemDto {
  productId: string;
  itemType: ItemType;
  quantity: number;
  unit: string;
  unitPrice: number;
  width?: number;
  height?: number;
  windowName?: string;
  batchCode?: string;
  notes?: string;
}

export interface UpdateQuotationItemDto {
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  width?: number;
  height?: number;
  windowName?: string;
  batchCode?: string;
  notes?: string;
}

export interface QuotationItemResponseDto {
  id: string;
  quotationId: string;
  productId: string;
  product?: {
    id: string;
    code: string;
    name: string;
    type: string;
  };
  itemType: ItemType;
  quantity: number;
  unit: string;
  unitPrice: number;
  amount: number;
  width?: number;
  height?: number;
  windowName?: string;
  batchCode?: string;
  notes?: string;
}

// ==================== Status Transition DTOs ====================
export interface UpdateQuotationStatusDto {
  status: QuotationStatus;
  reason?: string;
}

export interface ConvertQuotationToOrderDto {
  depositAmount?: number;
  deliveryDate?: Date;
  deliveryAddress?: string;
  notes?: string;
}
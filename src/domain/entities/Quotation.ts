import { Decimal } from '@prisma/client/runtime/library';
import { Customer } from './Customer';

export interface Quotation {
  id: string;
  code: string;
  customerId: string;
  createdById: string;
  status: QuotationStatus;
  validUntil?: Date | null;
  subtotal: Decimal | number;
  discount: Decimal | number;
  tax: Decimal | number;
  total: Decimal | number;
  // Aliases for use cases compatibility
  totalAmount?: Decimal | number;
  finalAmount?: Decimal | number;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: QuotationItem[];
  customer?: Customer;
}

export enum QuotationStatus {
  DRAFT = 'DRAFT',
  SENT = 'SENT',
  APPROVED = 'APPROVED',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CONVERTED = 'CONVERTED',
  CANCELLED = 'CANCELLED',
}

export interface QuotationItem {
  id: string;
  quotationId: string;
  itemType: ItemType;
  productId: string;
  description?: string | null;
  windowName?: string | null;
  windowLabel?: string | null;
  width?: Decimal | number | null;
  height?: Decimal | number | null;
  batchCode?: string | null;
  batchLabel?: string | null;
  batchQuantity?: number | null;
  quantity: Decimal | number;
  unit: string;
  unitPrice: Decimal | number;
  amount: Decimal | number;
  totalPrice?: Decimal | number;
  specifications?: string | Record<string, any> | null;
  notes?: string | null;
}

export enum ItemType {
  CURTAIN_WINDOW = 'CURTAIN_WINDOW',
  PROCESSING_BATCH = 'PROCESSING_BATCH',
}

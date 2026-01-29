import { Decimal } from '@prisma/client/runtime/library';
import { ItemType } from './Quotation';
import { Customer } from './Customer';

export interface Order {
  id: string;
  code: string;
  quotationId?: string | null;
  customerId: string;
  createdById: string;
  status: OrderStatus;
  orderDate: Date;
  deliveryDate?: Date | null;
  installDate?: Date | null;
  subtotal: Decimal | number;
  discount: Decimal | number;
  tax: Decimal | number;
  total: Decimal | number;
  // Aliases for use cases compatibility
  totalAmount?: Decimal | number;
  finalAmount?: Decimal | number;
  paidAmount: Decimal | number;
  depositPaid?: Decimal | number;
  shippingAddress?: string | null;
  deliveryAddress?: string | null;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: OrderItem[];
  customer?: Customer;
}

export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  IN_PRODUCTION = 'IN_PRODUCTION',
  QC_PENDING = 'QC_PENDING',
  QC_PASSED = 'QC_PASSED',
  READY_DELIVERY = 'READY_DELIVERY',
  INSTALLING = 'INSTALLING',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface OrderItem {
  id: string;
  orderId: string;
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
  producedQty?: Decimal | number;
  deliveredQty?: Decimal | number;
  notes?: string | null;
}

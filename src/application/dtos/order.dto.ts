import { OrderStatus } from '../../domain/entities/Order';
import { ItemType } from '../../domain/entities/Quotation';

// ==================== Order DTOs ====================
export interface CreateOrderDto {
  customerId: string;
  quotationId?: string;
  deliveryDate?: Date;
  shippingAddress?: string;
  notes?: string;
  items: CreateOrderItemDto[];
}

export interface UpdateOrderDto {
  deliveryDate?: Date;
  shippingAddress?: string;
  discount?: number;
  paidAmount?: number;
  notes?: string;
}

export interface OrderResponseDto {
  id: string;
  code: string;
  customerId: string;
  customer?: {
    id: string;
    code: string;
    name: string;
    phone?: string;
    address?: string;
  };
  quotationId?: string;
  status: OrderStatus;
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paidAmount: number;
  remainingAmount: number;
  deliveryDate?: Date;
  shippingAddress?: string;
  notes?: string;
  items?: OrderItemResponseDto[];
  createdById: string;
  createdBy?: {
    id: string;
    fullName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderListQueryDto {
  search?: string;
  customerId?: string;
  status?: OrderStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

// ==================== Order Item DTOs ====================
export interface CreateOrderItemDto {
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

export interface UpdateOrderItemDto {
  quantity?: number;
  unit?: string;
  unitPrice?: number;
  width?: number;
  height?: number;
  windowName?: string;
  batchCode?: string;
  notes?: string;
}

export interface OrderItemResponseDto {
  id: string;
  orderId: string;
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
export interface UpdateOrderStatusDto {
  status: OrderStatus;
  reason?: string;
}

export interface RecordPaymentDto {
  amount: number;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CARD';
  notes?: string;
}
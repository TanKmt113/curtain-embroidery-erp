import { DeliveryType, DeliveryStatus } from '../../domain/entities/Delivery';

// ==================== Delivery DTOs ====================
export interface CreateDeliveryDto {
  orderId: string;
  type: DeliveryType;
  scheduledDate: Date;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
  items: CreateDeliveryItemDto[];
}

export interface UpdateDeliveryDto {
  scheduledDate?: Date;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
}

export interface DeliveryResponseDto {
  id: string;
  code: string;
  orderId: string;
  order?: {
    id: string;
    code: string;
    customerName: string;
    customerPhone?: string;
  };
  type: DeliveryType;
  status: DeliveryStatus;
  scheduledDate?: Date | null;
  actualDate?: Date;
  address?: string;
  contactName?: string;
  contactPhone?: string;
  notes?: string;
  items?: DeliveryItemResponseDto[];
  createdBy?: {
    id: string;
    fullName: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface DeliveryListQueryDto {
  orderId?: string;
  type?: DeliveryType;
  status?: DeliveryStatus;
  fromDate?: string;
  toDate?: string;
  page?: number;
  pageSize?: number;
}

// ==================== Delivery Item DTOs ====================
export interface CreateDeliveryItemDto {
  orderItemId: string;
  quantity: number;
  notes?: string;
}

export interface UpdateDeliveryItemDto {
  quantity?: number;
  notes?: string;
}

export interface DeliveryItemResponseDto {
  id: string;
  deliveryId: string;
  orderItemId: string;
  orderItem?: {
    id: string;
    productName: string;
    windowLabel?: string;
    batchLabel?: string;
    totalQty: number;
    deliveredQty: number;
  };
  quantity: number;
  notes?: string;
}

// ==================== Status Transition DTOs ====================
export interface UpdateDeliveryStatusDto {
  status: DeliveryStatus;
  actualDate?: Date;
  notes?: string;
}

export interface ConfirmDeliveryDto {
  actualDate?: Date;
  receiverName?: string;
  receiverSignature?: string;
  notes?: string;
  images?: string[];
}
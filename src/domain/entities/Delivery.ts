export interface Delivery {
  id: string;
  code: string;
  orderId: string;
  type: DeliveryType;
  scheduledDate?: Date | null;
  actualDate?: Date | null;
  completedDate?: Date | null;
  address?: string | null;
  contactName?: string | null;
  contactPhone?: string | null;
  status: DeliveryStatus;
  notes?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export enum DeliveryType {
  DELIVERY = 'DELIVERY',
  INSTALLATION = 'INSTALLATION',
}

export enum DeliveryStatus {
  SCHEDULED = 'SCHEDULED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
}

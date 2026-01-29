import { z } from 'zod';
import { DeliveryType, DeliveryStatus } from '../../domain/entities/Delivery';

export const DeliveryItemSchema = z.object({
  orderItemId: z.string().uuid(),
  quantity: z.number().min(1),
  notes: z.string().optional(),
});

export const CreateDeliverySchema = z.object({
  orderId: z.string().uuid(),
  type: z.nativeEnum(DeliveryType),
  scheduledDate: z.string().datetime(),
  address: z.string().optional(),
  contactName: z.string().optional(),
  contactPhone: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(DeliveryItemSchema).min(1, 'At least one item is required'),
});

export const UpdateDeliveryStatusSchema = z.object({
  status: z.nativeEnum(DeliveryStatus),
  actualDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const DeliveryListQuerySchema = z.object({
  orderId: z.string().uuid().optional(),
  type: z.nativeEnum(DeliveryType).optional(),
  status: z.nativeEnum(DeliveryStatus).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).optional(),
  pageSize: z.string().regex(/^\d+$/).optional(),
});

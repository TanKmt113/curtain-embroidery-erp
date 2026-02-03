import { z } from 'zod';
import { OrderStatus } from '../../domain/entities/Order';
import { ItemType } from '../../domain/entities/Quotation';

export const OrderItemSchema = z.object({
  productId: z.string().uuid(),
  itemType: z.nativeEnum(ItemType),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  width: z.number().positive().optional(),
  height: z.number().positive().optional(),
  windowLabel: z.string().optional(),
  batchLabel: z.string().optional(),
  specifications: z.record(z.any()).optional(),
  notes: z.string().optional(),
});

export const CreateOrderSchema = z.object({
  customerId: z.string().uuid(),
  quotationId: z.string().uuid().optional(),
  deliveryDate: z.string().datetime().optional(),
  // Keep backward-compat with older clients, but canonical field is shippingAddress
  shippingAddress: z.string().optional(),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(OrderItemSchema).min(1, 'At least one item is required'),
});

export const UpdateOrderStatusSchema = z.object({
  status: z.nativeEnum(OrderStatus),
  reason: z.string().optional(),
});

export const OrderListQuerySchema = z.object({
  search: z.string().optional(),
  customerId: z.string().uuid().optional(),
  status: z.nativeEnum(OrderStatus).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).optional(),
  pageSize: z.string().regex(/^\d+$/).optional(),
});

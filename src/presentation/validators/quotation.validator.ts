import { z } from 'zod';
import { QuotationStatus, ItemType } from '../../domain/entities/Quotation';

export const QuotationItemSchema = z.object({
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

export const CreateQuotationSchema = z.object({
  customerId: z.string().uuid(),
  validUntil: z.string().datetime().optional(),
  notes: z.string().optional(),
  items: z.array(QuotationItemSchema).min(1, 'At least one item is required'),
});

export const UpdateQuotationStatusSchema = z.object({
  status: z.nativeEnum(QuotationStatus),
  reason: z.string().optional(),
});

export const QuotationListQuerySchema = z.object({
  search: z.string().optional(),
  customerId: z.string().uuid().optional(),
  status: z.nativeEnum(QuotationStatus).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).optional(),
  pageSize: z.string().regex(/^\d+$/).optional(),
});

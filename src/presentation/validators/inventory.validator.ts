import { z } from 'zod';
import { InventoryOwnership } from '../../domain/entities/Inventory';

export const StockReceiveSchema = z.object({
  productId: z.string().uuid().optional(),
  materialId: z.string().uuid().optional(),
  warehouse: z.string().min(1),
  ownership: z.nativeEnum(InventoryOwnership).optional(),
  customerId: z.string().uuid().optional(),
  quantity: z.number().positive(),
  referenceType: z.string().optional(),
  referenceId: z.string().optional(),
  notes: z.string().optional(),
}).refine(data => data.productId || data.materialId, {
  message: 'Either productId or materialId is required',
});

export const StockAdjustmentSchema = z.object({
  inventoryId: z.string().uuid(),
  adjustmentQty: z.number(),
  reason: z.string().min(1, 'Reason is required'),
});

export const InventoryListQuerySchema = z.object({
  productId: z.string().uuid().optional(),
  materialId: z.string().uuid().optional(),
  ownership: z.nativeEnum(InventoryOwnership).optional(),
  customerId: z.string().uuid().optional(),
  warehouse: z.string().optional(),
  lowStock: z.enum(['true', 'false']).optional(),
  page: z.string().regex(/^\d+$/).optional(),
  pageSize: z.string().regex(/^\d+$/).optional(),
});

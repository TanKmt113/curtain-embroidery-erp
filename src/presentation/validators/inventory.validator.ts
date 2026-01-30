import { z } from 'zod';
import { InventoryOwnership } from '../../domain/entities/Inventory';

// Single item receive (legacy format)
export const StockReceiveItemSchema = z.object({
  productId: z.string().uuid().optional(),
  materialId: z.string().uuid().optional(),
  quantity: z.number().positive('Quantity must be positive'),
  unitCost: z.number().min(0).optional(),
  location: z.string().optional().transform(val => val === '' ? undefined : val),
  notes: z.string().optional().transform(val => val === '' ? undefined : val),
}).refine(data => data.productId || data.materialId, {
  message: 'Either productId or materialId is required',
});

// Bulk receive format
export const StockReceiveSchema = z.object({
  // Legacy single item format
  productId: z.string().uuid().optional(),
  materialId: z.string().uuid().optional(),
  warehouse: z.string().min(1).optional(),
  ownership: z.nativeEnum(InventoryOwnership).optional(),
  customerId: z.string().uuid().optional(),
  quantity: z.number().positive().optional(),
  referenceType: z.string().optional(),
  referenceId: z.string().optional(),
  notes: z.string().optional().transform(val => val === '' ? undefined : val),
  
  // Bulk format
  type: z.enum(['RECEIVE', 'ADJUSTMENT', 'TRANSFER']).optional(),
  items: z.array(StockReceiveItemSchema).optional(),
}).refine(data => {
  // Either single format or bulk format
  if (data.items && data.items.length > 0) {
    return true; // Bulk format
  }
  // Single format requires productId/materialId and warehouse
  return (data.productId || data.materialId) && data.warehouse;
}, {
  message: 'Either provide items array or single item with productId/materialId and warehouse',
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

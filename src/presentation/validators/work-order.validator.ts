import { z } from 'zod';
import { WorkOrderStatus } from '../../domain/entities/WorkOrder';

export const CreateWorkOrderSchema = z.object({
  orderId: z.string().uuid(),
  orderItemId: z.string().uuid(),
  quantity: z.number().min(1),
  assigneeId: z.string().uuid().optional(),
  priority: z.number().min(1).max(10).optional(),
  plannedStartDate: z.string().datetime().optional(),
  plannedEndDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const UpdateWorkOrderStatusSchema = z.object({
  status: z.nativeEnum(WorkOrderStatus),
  completedQty: z.number().min(0).optional(),
  defectQty: z.number().min(0).optional(),
  reason: z.string().optional(),
});

export const CompleteWorkOrderSchema = z.object({
  completedQty: z.number().min(0),
  defectQty: z.number().min(0).optional(),
  actualEndDate: z.string().datetime().optional(),
  notes: z.string().optional(),
});

export const WorkOrderListQuerySchema = z.object({
  search: z.string().optional(),
  orderId: z.string().uuid().optional(),
  status: z.nativeEnum(WorkOrderStatus).optional(),
  assigneeId: z.string().uuid().optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).optional(),
  pageSize: z.string().regex(/^\d+$/).optional(),
});

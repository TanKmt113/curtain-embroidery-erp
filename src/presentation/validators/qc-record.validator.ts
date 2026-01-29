import { z } from 'zod';
import { QCResult } from '../../domain/entities/QCRecord';

export const CreateQCRecordSchema = z.object({
  orderId: z.string().uuid(),
  orderItemId: z.string().uuid().optional(),
  workOrderId: z.string().uuid().optional(),
  result: z.nativeEnum(QCResult),
  defectsFound: z.array(z.string()).optional(),
  notes: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

export const UpdateQCRecordSchema = z.object({
  result: z.nativeEnum(QCResult).optional(),
  defectsFound: z.array(z.string()).optional(),
  notes: z.string().optional(),
  images: z.array(z.string().url()).optional(),
});

export const QCRecordListQuerySchema = z.object({
  orderId: z.string().uuid().optional(),
  inspectorId: z.string().uuid().optional(),
  result: z.nativeEnum(QCResult).optional(),
  fromDate: z.string().datetime().optional(),
  toDate: z.string().datetime().optional(),
  page: z.string().regex(/^\d+$/).optional(),
  pageSize: z.string().regex(/^\d+$/).optional(),
});

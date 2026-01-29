import { z } from 'zod';
import { ProductType } from '../../domain/entities/Product';

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  type: z.nativeEnum(ProductType),
  unit: z.string().min(1, 'Unit is required'),
  basePrice: z.number().min(0, 'Base price must be positive'),
  description: z.string().optional(),
  specifications: z.record(z.any()).optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  unit: z.string().min(1).optional(),
  basePrice: z.number().min(0).optional(),
  description: z.string().optional(),
  specifications: z.record(z.any()).optional(),
  isActive: z.boolean().optional(),
});

export const ProductListQuerySchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(ProductType).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  page: z.string().regex(/^\d+$/).optional(),
  pageSize: z.string().regex(/^\d+$/).optional(),
});

import { z } from 'zod';
import { ProductType } from '../../domain/entities/Product';

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().optional(), // Ignored - code is auto-generated
  type: z.nativeEnum(ProductType),
  unit: z.string().min(1, 'Unit is required'),
  basePrice: z.number().min(0, 'Base price must be positive'),
  description: z.string().optional().transform(val => val === '' ? undefined : val),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  specifications: z.any().optional(), // Ignored - not in DB schema
  status: z.string().optional(), // Ignored - use isActive instead
  isActive: z.boolean().optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  unit: z.string().min(1).optional(),
  basePrice: z.number().min(0).optional(),
  description: z.string().optional().transform(val => val === '' ? undefined : val),
  image: z.string().url('Invalid image URL').optional().or(z.literal('')).transform(val => val === '' ? undefined : val),
  specifications: z.any().optional(), // Ignored - not in DB schema
  isActive: z.boolean().optional(),
});

export const ProductListQuerySchema = z.object({
  search: z.string().optional(),
  type: z.nativeEnum(ProductType).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  page: z.string().regex(/^\d+$/).optional(),
  pageSize: z.string().regex(/^\d+$/).optional(),
});

import { z } from 'zod';
import { ProductType } from '../../domain/entities/Product';

// Custom validator for image URL - accepts both full URLs and relative paths starting with /uploads/
const imageSchema = z.string()
  .refine(
    (val) => val === '' || val.startsWith('/uploads/') || val.startsWith('http://') || val.startsWith('https://'),
    { message: 'Image must be a valid URL or a path starting with /uploads/' }
  )
  .optional()
  .transform(val => val === '' ? undefined : val);

export const CreateProductSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  code: z.string().optional(), // Ignored - code is auto-generated
  type: z.nativeEnum(ProductType),
  unit: z.string().min(1, 'Unit is required'),
  basePrice: z.number().min(0, 'Base price must be positive'),
  description: z.string().optional().transform(val => val === '' ? undefined : val),
  image: imageSchema,
  specifications: z.any().optional(), // Ignored - not in DB schema
  status: z.string().optional(), // Ignored - use isActive instead
  isActive: z.boolean().optional(),
});

export const UpdateProductSchema = z.object({
  name: z.string().min(1).optional(),
  type: z.nativeEnum(ProductType).optional(), // Ignored - type cannot be changed
  unit: z.string().min(1).optional(),
  basePrice: z.number().min(0).optional(),
  description: z.string().optional().transform(val => val === '' ? undefined : val),
  image: imageSchema,
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

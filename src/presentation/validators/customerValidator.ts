import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../domain/errors';
import { CustomerType } from '../../domain/entities';

export const createCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long'),
  type: z.nativeEnum(CustomerType).optional(),
  email: z.string().email('Invalid email format').optional().nullable(),
  phone: z.string().max(20, 'Phone is too long').optional().nullable(),
  address: z.string().max(500, 'Address is too long').optional().nullable(),
  taxCode: z.string().max(20, 'Tax code is too long').optional().nullable(),
  contactPerson: z.string().max(255, 'Contact person name is too long').optional().nullable(),
  notes: z.string().max(1000, 'Notes is too long').optional().nullable(),
});

export const updateCustomerSchema = z.object({
  name: z.string().min(1, 'Name is required').max(255, 'Name is too long').optional(),
  type: z.nativeEnum(CustomerType).optional(),
  email: z.string().email('Invalid email format').optional().nullable(),
  phone: z.string().max(20, 'Phone is too long').optional().nullable(),
  address: z.string().max(500, 'Address is too long').optional().nullable(),
  taxCode: z.string().max(20, 'Tax code is too long').optional().nullable(),
  contactPerson: z.string().max(255, 'Contact person name is too long').optional().nullable(),
  notes: z.string().max(1000, 'Notes is too long').optional().nullable(),
  isActive: z.boolean().optional(),
});

export const listCustomersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
  type: z.nativeEnum(CustomerType).optional(),
  isActive: z.enum(['true', 'false']).optional(),
});

export function validateCreateCustomer(req: Request, _res: Response, next: NextFunction): void {
  const result = createCustomerSchema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError('Validation failed', details);
  }

  next();
}

export function validateUpdateCustomer(req: Request, _res: Response, next: NextFunction): void {
  const result = updateCustomerSchema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError('Validation failed', details);
  }

  next();
}

export function validateListCustomersQuery(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  const result = listCustomersQuerySchema.safeParse(req.query);

  if (!result.success) {
    const details = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError('Validation failed', details);
  }

  next();
}

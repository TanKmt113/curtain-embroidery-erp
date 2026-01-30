import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../domain/errors';
import { UserRole, UserStatus } from '../../domain/entities';

export const createUserSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password is too long'),
  fullName: z.string().min(1, 'Full name is required').max(255, 'Full name is too long'),
  phone: z.string().max(20, 'Phone is too long').optional().nullable(),
  role: z.nativeEnum(UserRole, { errorMap: () => ({ message: 'Invalid role' }) }),
});

export const updateUserSchema = z.object({
  email: z.string().email('Invalid email format').optional(),
  fullName: z.string().min(1, 'Full name is required').max(255, 'Full name is too long').optional(),
  phone: z.string().max(20, 'Phone is too long').optional().nullable(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(100, 'New password is too long'),
});

export const resetPasswordSchema = z.object({
  newPassword: z
    .string()
    .min(8, 'New password must be at least 8 characters')
    .max(100, 'New password is too long'),
});

export const listUsersQuerySchema = z.object({
  page: z.string().regex(/^\d+$/).transform(Number).optional(),
  pageSize: z.string().regex(/^\d+$/).transform(Number).optional(),
  search: z.string().optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
});

export function validateCreateUser(req: Request, _res: Response, next: NextFunction): void {
  const result = createUserSchema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError('Validation failed', details);
  }

  next();
}

export function validateUpdateUser(req: Request, _res: Response, next: NextFunction): void {
  const result = updateUserSchema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError('Validation failed', details);
  }

  next();
}

export function validateChangePassword(req: Request, _res: Response, next: NextFunction): void {
  const result = changePasswordSchema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError('Validation failed', details);
  }

  next();
}

export function validateResetPassword(req: Request, _res: Response, next: NextFunction): void {
  const result = resetPasswordSchema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError('Validation failed', details);
  }

  next();
}

export function validateListUsersQuery(req: Request, _res: Response, next: NextFunction): void {
  const result = listUsersQuerySchema.safeParse(req.query);

  if (!result.success) {
    const details = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError('Validation failed', details);
  }

  next();
}

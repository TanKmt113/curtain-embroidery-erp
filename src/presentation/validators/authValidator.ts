import { z } from 'zod';
import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../../domain/errors';

export const loginSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required'),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1, 'Refresh token is required'),
});

export function validateLogin(req: Request, _res: Response, next: NextFunction): void {
  const result = loginSchema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError('Validation failed', details);
  }

  next();
}

export function validateRefreshToken(req: Request, _res: Response, next: NextFunction): void {
  const result = refreshTokenSchema.safeParse(req.body);

  if (!result.success) {
    const details = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError('Validation failed', details);
  }

  next();
}

import { Request, Response, NextFunction } from 'express';
import {
  DomainError,
  ValidationError,
  EntityNotFoundError,
  UnauthorizedError,
  ForbiddenError,
  ConflictError,
} from '../../domain/errors';
import { logger } from '../../main/config/logger';

interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: Array<{ field: string; message: string }>;
  };
}

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
): void {
  logger.error(
    {
      error: err.message,
      stack: err.stack,
      path: req.path,
      method: req.method,
    },
    'Error occurred'
  );

  let statusCode = 500;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'Internal server error';
  let details: Array<{ field: string; message: string }> | undefined;

  if (err instanceof ValidationError) {
    statusCode = 400;
    errorCode = 'VALIDATION_ERROR';
    message = err.message;
    details = err.details;
  } else if (err instanceof UnauthorizedError) {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
    message = err.message;
  } else if (err instanceof ForbiddenError) {
    statusCode = 403;
    errorCode = 'FORBIDDEN';
    message = err.message;
  } else if (err instanceof EntityNotFoundError) {
    statusCode = 404;
    errorCode = 'NOT_FOUND';
    message = err.message;
  } else if (err instanceof ConflictError) {
    statusCode = 409;
    errorCode = 'CONFLICT';
    message = err.message;
  } else if (err instanceof DomainError) {
    statusCode = 400;
    errorCode = 'DOMAIN_ERROR';
    message = err.message;
  } else if (err.name === 'JsonWebTokenError') {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
    message = 'Invalid token';
  } else if (err.name === 'TokenExpiredError') {
    statusCode = 401;
    errorCode = 'UNAUTHORIZED';
    message = 'Token expired';
  }

  const response: ErrorResponse = {
    success: false,
    error: {
      code: errorCode,
      message,
      ...(details && { details }),
    },
  };

  res.status(statusCode).json(response);
}

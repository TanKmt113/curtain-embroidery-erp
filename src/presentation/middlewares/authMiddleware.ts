import { Request, Response, NextFunction } from 'express';
import { ITokenService } from '../../application/interfaces';
import { TokenPayload } from '../../application/dtos';
import { UnauthorizedError, ForbiddenError } from '../../domain/errors';
import { UserRole } from '../../domain/entities';

declare global {
  namespace Express {
    interface Request {
      user?: TokenPayload;
    }
  }
}

export function createAuthMiddleware(tokenService: ITokenService) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('Missing or invalid authorization header');
    }

    const token = authHeader.substring(7);

    try {
      const payload = tokenService.verifyAccessToken(token);
      req.user = payload;
      next();
    } catch {
      throw new UnauthorizedError('Invalid or expired token');
    }
  };
}

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('User not authenticated');
    }

    if (!allowedRoles.includes(req.user.role as UserRole)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
}

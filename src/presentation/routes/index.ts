import { Router } from 'express';
import { createAuthRouter } from './authRoutes';
import { createCustomerRouter } from './customerRoutes';
import { AuthController, CustomerController } from '../controllers';
import { ITokenService } from '../../application/interfaces';

export function createApiRouter(
  authController: AuthController,
  customerController: CustomerController,
  tokenService: ITokenService
): Router {
  const router = Router();

  router.use('/auth', createAuthRouter(authController, tokenService));
  router.use('/customers', createCustomerRouter(customerController, tokenService));

  // Health check endpoint
  router.get('/health', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  return router;
}

export { createAuthRouter } from './authRoutes';
export { createCustomerRouter } from './customerRoutes';

import { Router } from 'express';
import { CustomerController } from '../controllers';
import {
  validateCreateCustomer,
  validateUpdateCustomer,
  validateListCustomersQuery,
} from '../validators';
import { createAuthMiddleware, authorize } from '../middlewares';
import { ITokenService } from '../../application/interfaces';
import { UserRole } from '../../domain/entities';

export function createCustomerRouter(
  customerController: CustomerController,
  tokenService: ITokenService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  // All routes require authentication
  router.use(authMiddleware);

  router.post(
    '/',
    authorize(UserRole.ADMIN, UserRole.SALES),
    validateCreateCustomer,
    customerController.create
  );

  router.get(
    '/',
    authorize(
      UserRole.ADMIN,
      UserRole.SALES,
      UserRole.WAREHOUSE,
      UserRole.INSTALLER,
      UserRole.ACCOUNTANT
    ),
    validateListCustomersQuery,
    customerController.list
  );

  router.get(
    '/:id',
    authorize(
      UserRole.ADMIN,
      UserRole.SALES,
      UserRole.WAREHOUSE,
      UserRole.INSTALLER,
      UserRole.ACCOUNTANT
    ),
    customerController.getById
  );

  router.put(
    '/:id',
    authorize(UserRole.ADMIN, UserRole.SALES),
    validateUpdateCustomer,
    customerController.update
  );

  return router;
}

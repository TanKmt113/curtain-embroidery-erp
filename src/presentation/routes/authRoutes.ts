import { Router } from 'express';
import { AuthController } from '../controllers';
import { validateLogin, validateRefreshToken } from '../validators';
import { createAuthMiddleware } from '../middlewares';
import { ITokenService } from '../../application/interfaces';

export function createAuthRouter(
  authController: AuthController,
  tokenService: ITokenService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  router.post('/login', validateLogin, authController.login);
  router.post('/refresh', validateRefreshToken, authController.refresh);
  router.post('/logout', authMiddleware, validateRefreshToken, authController.logout);

  return router;
}

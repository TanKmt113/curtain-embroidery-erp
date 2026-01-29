import { prisma } from '../../infrastructure/database';
import { PrismaUserRepository, PrismaRefreshTokenRepository } from '../../infrastructure/repositories';
import { JwtTokenService, BcryptHashService } from '../../infrastructure/security';
import { LoginUseCase, RefreshTokenUseCase, LogoutUseCase } from '../../application/use-cases/auth';
import { AuthController } from '../../presentation/controllers';

export function makeAuthController(): AuthController {
  const userRepository = new PrismaUserRepository(prisma);
  const refreshTokenRepository = new PrismaRefreshTokenRepository(prisma);
  const tokenService = new JwtTokenService();
  const hashService = new BcryptHashService();

  const loginUseCase = new LoginUseCase(
    userRepository,
    refreshTokenRepository,
    tokenService,
    hashService
  );
  const refreshTokenUseCase = new RefreshTokenUseCase(refreshTokenRepository, tokenService);
  const logoutUseCase = new LogoutUseCase(refreshTokenRepository, tokenService);

  return new AuthController(loginUseCase, refreshTokenUseCase, logoutUseCase);
}

export function makeTokenService(): JwtTokenService {
  return new JwtTokenService();
}

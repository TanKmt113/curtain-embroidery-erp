import { IRefreshTokenRepository } from '../../../domain/repositories';
import { ITokenService } from '../../interfaces';
import { RefreshTokenDTO, RefreshTokenResponseDTO, TokenPayload } from '../../dtos';
import { UnauthorizedError } from '../../../domain/errors';

export class RefreshTokenUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: RefreshTokenDTO): Promise<RefreshTokenResponseDTO> {
    let payload: TokenPayload;

    try {
      payload = this.tokenService.verifyRefreshToken(dto.refreshToken);
    } catch {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const tokenHash = this.tokenService.hashToken(dto.refreshToken);
    const storedToken = await this.refreshTokenRepository.findByTokenHash(tokenHash);

    if (!storedToken) {
      throw new UnauthorizedError('Refresh token not found');
    }

    if (storedToken.revokedAt) {
      throw new UnauthorizedError('Refresh token has been revoked');
    }

    if (storedToken.expiresAt < new Date()) {
      throw new UnauthorizedError('Refresh token has expired');
    }

    const newAccessToken = this.tokenService.generateAccessToken({
      userId: payload.userId,
      email: payload.email,
      role: payload.role,
    });

    return {
      accessToken: newAccessToken,
    };
  }
}

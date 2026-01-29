import { IRefreshTokenRepository } from '../../../domain/repositories';
import { ITokenService } from '../../interfaces';
import { RefreshTokenDTO } from '../../dtos';

export class LogoutUseCase {
  constructor(
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenService: ITokenService
  ) {}

  async execute(dto: RefreshTokenDTO): Promise<void> {
    const tokenHash = this.tokenService.hashToken(dto.refreshToken);
    await this.refreshTokenRepository.revokeByTokenHash(tokenHash);
  }
}

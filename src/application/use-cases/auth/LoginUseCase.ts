import { IUserRepository, IRefreshTokenRepository } from '../../../domain/repositories';
import { ITokenService, IHashService } from '../../interfaces';
import { LoginDTO, LoginResponseDTO, TokenPayload } from '../../dtos';
import { UnauthorizedError } from '../../../domain/errors';
import { UserStatus } from '../../../domain/entities';

export class LoginUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly refreshTokenRepository: IRefreshTokenRepository,
    private readonly tokenService: ITokenService,
    private readonly hashService: IHashService
  ) {}

  async execute(dto: LoginDTO): Promise<LoginResponseDTO> {
    const user = await this.userRepository.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedError('Invalid credentials');
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new UnauthorizedError('Account is not active');
    }

    const isPasswordValid = await this.hashService.compare(dto.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid credentials');
    }

    const payload: TokenPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
    };

    const accessToken = this.tokenService.generateAccessToken(payload);
    const refreshToken = this.tokenService.generateRefreshToken(payload);

    // Store refresh token hash in database
    const tokenHash = this.tokenService.hashToken(refreshToken);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // 7 days

    await this.refreshTokenRepository.create({
      tokenHash,
      userId: user.id,
      expiresAt,
      revokedAt: null,
    });

    // Return user without password
    const { passwordHash, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      user: userWithoutPassword,
    };
  }
}

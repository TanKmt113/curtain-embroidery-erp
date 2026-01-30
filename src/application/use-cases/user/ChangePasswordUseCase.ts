import { IUserRepository } from '../../../domain/repositories';
import { ChangePasswordDTO } from '../../dtos/user.dto';
import { EntityNotFoundError, UnauthorizedError } from '../../../domain/errors';
import { IHashService } from '../../interfaces';

export class ChangePasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService
  ) {}

  async execute(userId: string, dto: ChangePasswordDTO): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new EntityNotFoundError('User', userId);
    }

    // Verify current password
    const isPasswordValid = await this.hashService.compare(dto.currentPassword, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Current password is incorrect');
    }

    // Hash new password
    const newPasswordHash = await this.hashService.hash(dto.newPassword);

    await this.userRepository.update(userId, {
      passwordHash: newPasswordHash,
    });
  }
}

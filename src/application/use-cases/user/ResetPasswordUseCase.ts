import { IUserRepository } from '../../../domain/repositories';
import { ResetPasswordDTO } from '../../dtos/user.dto';
import { EntityNotFoundError } from '../../../domain/errors';
import { IHashService } from '../../interfaces';

export class ResetPasswordUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService
  ) {}

  async execute(userId: string, dto: ResetPasswordDTO): Promise<void> {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new EntityNotFoundError('User', userId);
    }

    // Hash new password
    const newPasswordHash = await this.hashService.hash(dto.newPassword);

    await this.userRepository.update(userId, {
      passwordHash: newPasswordHash,
    });
  }
}

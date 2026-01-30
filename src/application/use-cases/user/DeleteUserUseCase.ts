import { IUserRepository } from '../../../domain/repositories';
import { EntityNotFoundError, BusinessRuleViolationError } from '../../../domain/errors';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, currentUserId: string): Promise<void> {
    // Prevent self-deletion
    if (id === currentUserId) {
      throw new BusinessRuleViolationError('Cannot delete your own account');
    }

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new EntityNotFoundError('User', id);
    }

    await this.userRepository.delete(id);
  }
}

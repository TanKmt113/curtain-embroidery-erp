import { IUserRepository } from '../../../domain/repositories';
import { UserResponseDTO } from '../../dtos/user.dto';
import { EntityNotFoundError } from '../../../domain/errors';

export class GetUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string): Promise<UserResponseDTO> {
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new EntityNotFoundError('User', id);
    }

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      phone: userWithoutPassword.phone ?? null,
    };
  }
}

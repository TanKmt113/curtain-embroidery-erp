import { IUserRepository } from '../../../domain/repositories';
import { UpdateUserDTO, UserResponseDTO } from '../../dtos/user.dto';
import { EntityNotFoundError, ConflictError } from '../../../domain/errors';

export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(id: string, dto: UpdateUserDTO): Promise<UserResponseDTO> {
    const existingUser = await this.userRepository.findById(id);

    if (!existingUser) {
      throw new EntityNotFoundError('User', id);
    }

    // Check if email is being updated and already exists
    if (dto.email && dto.email !== existingUser.email) {
      const userWithEmail = await this.userRepository.findByEmail(dto.email);
      if (userWithEmail && userWithEmail.id !== id) {
        throw new ConflictError(`User with email '${dto.email}' already exists`);
      }
    }

    const updatedUser = await this.userRepository.update(id, {
      ...(dto.email !== undefined && { email: dto.email }),
      ...(dto.fullName !== undefined && { fullName: dto.fullName }),
      ...(dto.phone !== undefined && { phone: dto.phone }),
      ...(dto.role !== undefined && { role: dto.role }),
      ...(dto.status !== undefined && { status: dto.status }),
    });

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = updatedUser;
    return {
      ...userWithoutPassword,
      phone: userWithoutPassword.phone ?? null,
    };
  }
}

import { IUserRepository } from '../../../domain/repositories';
import { CreateUserDTO, UserResponseDTO } from '../../dtos/user.dto';
import { UserStatus } from '../../../domain/entities';
import { ConflictError } from '../../../domain/errors';
import { IHashService } from '../../interfaces';

export class CreateUserUseCase {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly hashService: IHashService
  ) {}

  async execute(dto: CreateUserDTO): Promise<UserResponseDTO> {
    // Check if email already exists
    const existingUser = await this.userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError(`User with email '${dto.email}' already exists`);
    }

    // Hash password
    const passwordHash = await this.hashService.hash(dto.password);

    const user = await this.userRepository.create({
      email: dto.email,
      passwordHash,
      fullName: dto.fullName,
      phone: dto.phone || null,
      role: dto.role,
      status: UserStatus.ACTIVE,
    });

    // Return user without password
    const { passwordHash: _, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      phone: userWithoutPassword.phone ?? null,
    };
  }
}

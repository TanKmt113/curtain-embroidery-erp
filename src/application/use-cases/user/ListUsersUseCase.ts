import { IUserRepository, PaginatedResult } from '../../../domain/repositories';
import { ListUsersDTO, UserResponseDTO } from '../../dtos/user.dto';

export class ListUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(dto: ListUsersDTO): Promise<PaginatedResult<UserResponseDTO>> {
    const page = dto.page || 1;
    const pageSize = Math.min(dto.pageSize || 20, 100);

    const result = await this.userRepository.findAll(
      {
        search: dto.search,
        role: dto.role,
        status: dto.status,
      },
      { page, pageSize }
    );

    // Remove passwordHash from all users
    const usersWithoutPassword: UserResponseDTO[] = result.data.map((user) => {
      const { passwordHash: _, ...userWithoutPassword } = user;
      return {
        ...userWithoutPassword,
        phone: userWithoutPassword.phone ?? null,
      };
    });

    return {
      ...result,
      data: usersWithoutPassword,
    };
  }
}

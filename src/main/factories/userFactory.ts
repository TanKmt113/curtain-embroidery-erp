import { prisma } from '../../infrastructure/database';
import { PrismaUserRepository } from '../../infrastructure/repositories';
import { BcryptHashService } from '../../infrastructure/security';
import {
  CreateUserUseCase,
  ListUsersUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  ChangePasswordUseCase,
  ResetPasswordUseCase,
} from '../../application/use-cases/user';
import { UserController } from '../../presentation/controllers';

export function makeUserController(): UserController {
  const userRepository = new PrismaUserRepository(prisma);
  const hashService = new BcryptHashService();

  const createUserUseCase = new CreateUserUseCase(userRepository, hashService);
  const listUsersUseCase = new ListUsersUseCase(userRepository);
  const getUserUseCase = new GetUserUseCase(userRepository);
  const updateUserUseCase = new UpdateUserUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  const changePasswordUseCase = new ChangePasswordUseCase(userRepository, hashService);
  const resetPasswordUseCase = new ResetPasswordUseCase(userRepository, hashService);

  return new UserController(
    createUserUseCase,
    listUsersUseCase,
    getUserUseCase,
    updateUserUseCase,
    deleteUserUseCase,
    changePasswordUseCase,
    resetPasswordUseCase
  );
}

import { Request, Response } from 'express';
import {
  CreateUserUseCase,
  ListUsersUseCase,
  GetUserUseCase,
  UpdateUserUseCase,
  DeleteUserUseCase,
  ChangePasswordUseCase,
  ResetPasswordUseCase,
} from '../../application/use-cases/user';
import {
  CreateUserDTO,
  UpdateUserDTO,
  ListUsersDTO,
  ChangePasswordDTO,
  ResetPasswordDTO,
} from '../../application/dtos/user.dto';
import { UserRole, UserStatus } from '../../domain/entities';

export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly listUsersUseCase: ListUsersUseCase,
    private readonly getUserUseCase: GetUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
    private readonly deleteUserUseCase: DeleteUserUseCase,
    private readonly changePasswordUseCase: ChangePasswordUseCase,
    private readonly resetPasswordUseCase: ResetPasswordUseCase
  ) {}

  create = async (req: Request, res: Response): Promise<void> => {
    const dto: CreateUserDTO = {
      email: req.body.email,
      password: req.body.password,
      fullName: req.body.fullName,
      phone: req.body.phone,
      role: req.body.role,
    };

    const user = await this.createUserUseCase.execute(dto);

    res.status(201).json({
      success: true,
      data: user,
    });
  };

  list = async (req: Request, res: Response): Promise<void> => {
    const dto: ListUsersDTO = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      pageSize: req.query.pageSize ? parseInt(req.query.pageSize as string, 10) : undefined,
      search: req.query.search as string | undefined,
      role: req.query.role as UserRole | undefined,
      status: req.query.status as UserStatus | undefined,
    };

    const result = await this.listUsersUseCase.execute(dto);

    res.status(200).json({
      success: true,
      data: result.data,
      meta: {
        page: result.page,
        pageSize: result.pageSize,
        total: result.total,
        totalPages: result.totalPages,
      },
    });
  };

  getById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    const user = await this.getUserUseCase.execute(id);

    res.status(200).json({
      success: true,
      data: user,
    });
  };

  update = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const dto: UpdateUserDTO = {
      email: req.body.email,
      fullName: req.body.fullName,
      phone: req.body.phone,
      role: req.body.role,
      status: req.body.status,
    };

    const user = await this.updateUserUseCase.execute(id, dto);

    res.status(200).json({
      success: true,
      data: user,
    });
  };

  delete = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const currentUserId = req.user?.userId as string;

    await this.deleteUserUseCase.execute(id, currentUserId);

    res.status(200).json({
      success: true,
      message: 'User deleted successfully',
    });
  };

  changePassword = async (req: Request, res: Response): Promise<void> => {
    const userId = req.user?.userId as string;
    const dto: ChangePasswordDTO = {
      currentPassword: req.body.currentPassword,
      newPassword: req.body.newPassword,
    };

    await this.changePasswordUseCase.execute(userId, dto);

    res.status(200).json({
      success: true,
      message: 'Password changed successfully',
    });
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const dto: ResetPasswordDTO = {
      newPassword: req.body.newPassword,
    };

    await this.resetPasswordUseCase.execute(id, dto);

    res.status(200).json({
      success: true,
      message: 'Password reset successfully',
    });
  };
}

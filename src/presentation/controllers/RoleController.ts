import { Request, Response } from 'express';
import { ListRolesUseCase, GetRolePermissionsUseCase } from '../../application/use-cases/role';
import { UserRole } from '../../domain/entities';
import { ValidationError } from '../../domain/errors';

export class RoleController {
  constructor(
    private readonly listRolesUseCase: ListRolesUseCase,
    private readonly getRolePermissionsUseCase: GetRolePermissionsUseCase
  ) {}

  list = async (_req: Request, res: Response): Promise<void> => {
    const roles = await this.listRolesUseCase.execute();

    res.status(200).json({
      success: true,
      data: roles,
    });
  };

  getPermissions = async (req: Request, res: Response): Promise<void> => {
    const { code } = req.params;

    // Validate role code
    if (!Object.values(UserRole).includes(code as UserRole)) {
      throw new ValidationError(`Invalid role code: ${code}`, [
        { field: 'code', message: `Role must be one of: ${Object.values(UserRole).join(', ')}` },
      ]);
    }

    const roleWithPermissions = await this.getRolePermissionsUseCase.execute(code as UserRole);

    res.status(200).json({
      success: true,
      data: roleWithPermissions,
    });
  };
}

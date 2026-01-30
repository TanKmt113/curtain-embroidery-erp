import { ListRolesUseCase, GetRolePermissionsUseCase } from '../../application/use-cases/role';
import { RoleController } from '../../presentation/controllers';

export function makeRoleController(): RoleController {
  const listRolesUseCase = new ListRolesUseCase();
  const getRolePermissionsUseCase = new GetRolePermissionsUseCase();

  return new RoleController(listRolesUseCase, getRolePermissionsUseCase);
}

import { UserRole } from '../../../domain/entities';
import { RoleDTO, RoleWithPermissionsDTO, RolePermissionDTO } from '../../dtos/role.dto';

// Role definitions with display names and descriptions
const ROLE_DEFINITIONS: Record<UserRole, { name: string; description: string }> = {
  [UserRole.ADMIN]: {
    name: 'Administrator',
    description: 'Quản trị hệ thống toàn quyền',
  },
  [UserRole.SALES]: {
    name: 'Sales',
    description: 'Nhân viên kinh doanh',
  },
  [UserRole.WAREHOUSE]: {
    name: 'Warehouse',
    description: 'Nhân viên kho',
  },
  [UserRole.PRODUCTION]: {
    name: 'Production',
    description: 'Nhân viên sản xuất',
  },
  [UserRole.QC]: {
    name: 'Quality Control',
    description: 'Nhân viên kiểm tra chất lượng',
  },
  [UserRole.INSTALLER]: {
    name: 'Installer',
    description: 'Nhân viên lắp đặt',
  },
  [UserRole.ACCOUNTANT]: {
    name: 'Accountant',
    description: 'Kế toán',
  },
};

// Permission matrix - defines what each role can do
const PERMISSIONS_MATRIX: Record<string, Record<string, UserRole[]>> = {
  users: {
    create: [UserRole.ADMIN],
    view: [UserRole.ADMIN],
    update: [UserRole.ADMIN],
    delete: [UserRole.ADMIN],
  },
  customers: {
    create: [UserRole.ADMIN, UserRole.SALES],
    view: [UserRole.ADMIN, UserRole.SALES, UserRole.WAREHOUSE, UserRole.INSTALLER, UserRole.ACCOUNTANT],
    update: [UserRole.ADMIN, UserRole.SALES],
    delete: [UserRole.ADMIN],
  },
  products: {
    create: [UserRole.ADMIN],
    view: [UserRole.ADMIN, UserRole.SALES, UserRole.WAREHOUSE, UserRole.PRODUCTION, UserRole.QC, UserRole.ACCOUNTANT],
    update: [UserRole.ADMIN],
    delete: [UserRole.ADMIN],
  },
  quotations: {
    create: [UserRole.ADMIN, UserRole.SALES],
    view: [UserRole.ADMIN, UserRole.SALES, UserRole.ACCOUNTANT],
    update: [UserRole.ADMIN, UserRole.SALES],
    send: [UserRole.ADMIN, UserRole.SALES],
    approve: [UserRole.ADMIN, UserRole.SALES],
    convert: [UserRole.ADMIN, UserRole.SALES],
  },
  orders: {
    create: [UserRole.ADMIN, UserRole.SALES],
    view: [UserRole.ADMIN, UserRole.SALES, UserRole.WAREHOUSE, UserRole.PRODUCTION, UserRole.QC, UserRole.INSTALLER, UserRole.ACCOUNTANT],
    update: [UserRole.ADMIN, UserRole.SALES],
    cancel: [UserRole.ADMIN, UserRole.SALES],
    confirm: [UserRole.ADMIN, UserRole.SALES],
    recordPayment: [UserRole.ADMIN, UserRole.ACCOUNTANT],
  },
  workOrders: {
    create: [UserRole.ADMIN, UserRole.PRODUCTION],
    view: [UserRole.ADMIN, UserRole.SALES, UserRole.WAREHOUSE, UserRole.PRODUCTION, UserRole.QC],
    assign: [UserRole.ADMIN, UserRole.PRODUCTION],
    updateProgress: [UserRole.ADMIN, UserRole.PRODUCTION],
    complete: [UserRole.ADMIN, UserRole.PRODUCTION],
  },
  inventory: {
    view: [UserRole.ADMIN, UserRole.SALES, UserRole.WAREHOUSE, UserRole.PRODUCTION, UserRole.ACCOUNTANT],
    stockIn: [UserRole.ADMIN, UserRole.WAREHOUSE],
    stockOut: [UserRole.ADMIN, UserRole.WAREHOUSE],
    adjust: [UserRole.ADMIN, UserRole.WAREHOUSE],
    reserve: [UserRole.ADMIN, UserRole.WAREHOUSE],
  },
  qcRecords: {
    create: [UserRole.ADMIN, UserRole.QC],
    view: [UserRole.ADMIN, UserRole.SALES, UserRole.PRODUCTION, UserRole.QC],
    update: [UserRole.ADMIN, UserRole.QC],
  },
  deliveries: {
    create: [UserRole.ADMIN, UserRole.SALES, UserRole.WAREHOUSE],
    view: [UserRole.ADMIN, UserRole.SALES, UserRole.WAREHOUSE, UserRole.INSTALLER, UserRole.ACCOUNTANT],
    update: [UserRole.ADMIN, UserRole.WAREHOUSE, UserRole.INSTALLER],
    complete: [UserRole.ADMIN, UserRole.INSTALLER],
  },
};

export class ListRolesUseCase {
  async execute(): Promise<RoleDTO[]> {
    return Object.values(UserRole).map((code) => ({
      code,
      name: ROLE_DEFINITIONS[code].name,
      description: ROLE_DEFINITIONS[code].description,
    }));
  }
}

export class GetRolePermissionsUseCase {
  async execute(roleCode: UserRole): Promise<RoleWithPermissionsDTO> {
    const roleInfo = ROLE_DEFINITIONS[roleCode];
    
    if (!roleInfo) {
      throw new Error(`Role '${roleCode}' not found`);
    }

    const permissions: RolePermissionDTO[] = [];

    // Build permissions list for this role
    for (const [module, actions] of Object.entries(PERMISSIONS_MATRIX)) {
      for (const [action, allowedRoles] of Object.entries(actions)) {
        permissions.push({
          module,
          action,
          allowed: allowedRoles.includes(roleCode),
        });
      }
    }

    return {
      code: roleCode,
      name: roleInfo.name,
      description: roleInfo.description,
      permissions,
    };
  }
}

// Helper function to check if a role has permission
export function hasPermission(role: UserRole, module: string, action: string): boolean {
  const modulePermissions = PERMISSIONS_MATRIX[module];
  if (!modulePermissions) return false;
  
  const allowedRoles = modulePermissions[action];
  if (!allowedRoles) return false;
  
  return allowedRoles.includes(role);
}

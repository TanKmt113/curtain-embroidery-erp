import { Router } from 'express';
import { RoleController } from '../controllers';
import { createAuthMiddleware } from '../middlewares';
import { ITokenService } from '../../application/interfaces';

export function createRoleRoutes(
  roleController: RoleController,
  tokenService: ITokenService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  // All routes require authentication
  router.use(authMiddleware);

  /**
   * @swagger
   * /roles:
   *   get:
   *     summary: Lấy danh sách tất cả roles
   *     tags: [Roles]
   *     security:
   *       - BearerAuth: []
   *     responses:
   *       200:
   *         description: Danh sách roles
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RoleListResponse'
   *       401:
   *         description: Unauthorized
   */
  router.get('/', roleController.list);

  /**
   * @swagger
   * /roles/{code}/permissions:
   *   get:
   *     summary: Lấy chi tiết permissions của một role
   *     tags: [Roles]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: code
   *         required: true
   *         schema:
   *           $ref: '#/components/schemas/UserRole'
   *         description: Mã role (ADMIN, SALES, WAREHOUSE, PRODUCTION, QC, INSTALLER, ACCOUNTANT)
   *     responses:
   *       200:
   *         description: Chi tiết role và permissions
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/RolePermissionsResponse'
   *       400:
   *         description: Invalid role code
   *       401:
   *         description: Unauthorized
   */
  router.get('/:code/permissions', roleController.getPermissions);

  return router;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         code:
 *           $ref: '#/components/schemas/UserRole'
 *         name:
 *           type: string
 *           example: Administrator
 *         description:
 *           type: string
 *           example: Quản trị hệ thống toàn quyền
 *
 *     Permission:
 *       type: object
 *       properties:
 *         module:
 *           type: string
 *           example: users
 *         action:
 *           type: string
 *           example: create
 *         allowed:
 *           type: boolean
 *           example: true
 *
 *     RoleWithPermissions:
 *       type: object
 *       properties:
 *         code:
 *           $ref: '#/components/schemas/UserRole'
 *         name:
 *           type: string
 *         description:
 *           type: string
 *         permissions:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Permission'
 *
 *     RoleListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Role'
 *
 *     RolePermissionsResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/RoleWithPermissions'
 */

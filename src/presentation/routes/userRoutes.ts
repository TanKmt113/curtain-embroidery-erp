import { Router } from 'express';
import { UserController } from '../controllers';
import {
  validateCreateUser,
  validateUpdateUser,
  validateChangePassword,
  validateResetPassword,
  validateListUsersQuery,
} from '../validators/user.validator';
import { createAuthMiddleware, authorize } from '../middlewares';
import { ITokenService } from '../../application/interfaces';
import { UserRole } from '../../domain/entities';

export function createUserRoutes(
  userController: UserController,
  tokenService: ITokenService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  // All routes require authentication
  router.use(authMiddleware);

  /**
   * @swagger
   * /users:
   *   post:
   *     summary: Tạo người dùng mới
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateUserRequest'
   *     responses:
   *       201:
   *         description: Tạo người dùng thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Chỉ ADMIN được tạo người dùng
   *       409:
   *         description: Conflict - Email đã tồn tại
   */
  router.post(
    '/',
    authorize(UserRole.ADMIN),
    validateCreateUser,
    userController.create
  );

  /**
   * @swagger
   * /users:
   *   get:
   *     summary: Lấy danh sách người dùng
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *         description: Số trang
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           default: 20
   *           maximum: 100
   *         description: Số lượng mỗi trang
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Tìm kiếm theo tên, email, SĐT
   *       - in: query
   *         name: role
   *         schema:
   *           $ref: '#/components/schemas/UserRole'
   *         description: Lọc theo vai trò
   *       - in: query
   *         name: status
   *         schema:
   *           $ref: '#/components/schemas/UserStatus'
   *         description: Lọc theo trạng thái
   *     responses:
   *       200:
   *         description: Danh sách người dùng
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserListResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Chỉ ADMIN được xem danh sách
   */
  router.get(
    '/',
    authorize(UserRole.ADMIN),
    validateListUsersQuery,
    userController.list
  );

  /**
   * @swagger
   * /users/me/change-password:
   *   post:
   *     summary: Đổi mật khẩu của chính mình
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ChangePasswordRequest'
   *     responses:
   *       200:
   *         description: Đổi mật khẩu thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized hoặc mật khẩu hiện tại không đúng
   */
  router.post(
    '/me/change-password',
    validateChangePassword,
    userController.changePassword
  );

  /**
   * @swagger
   * /users/{id}:
   *   get:
   *     summary: Lấy thông tin người dùng theo ID
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID người dùng
   *     responses:
   *       200:
   *         description: Thông tin người dùng
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Chỉ ADMIN được xem chi tiết
   *       404:
   *         description: Không tìm thấy người dùng
   */
  router.get(
    '/:id',
    authorize(UserRole.ADMIN),
    userController.getById
  );

  /**
   * @swagger
   * /users/{id}:
   *   put:
   *     summary: Cập nhật thông tin người dùng
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID người dùng
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateUserRequest'
   *     responses:
   *       200:
   *         description: Cập nhật thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UserResponse'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Chỉ ADMIN được cập nhật
   *       404:
   *         description: Không tìm thấy người dùng
   *       409:
   *         description: Conflict - Email đã tồn tại
   */
  router.put(
    '/:id',
    authorize(UserRole.ADMIN),
    validateUpdateUser,
    userController.update
  );

  /**
   * @swagger
   * /users/{id}:
   *   delete:
   *     summary: Xóa người dùng
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID người dùng
   *     responses:
   *       200:
   *         description: Xóa thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       400:
   *         description: Không thể tự xóa chính mình
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Chỉ ADMIN được xóa
   *       404:
   *         description: Không tìm thấy người dùng
   */
  router.delete(
    '/:id',
    authorize(UserRole.ADMIN),
    userController.delete
  );

  /**
   * @swagger
   * /users/{id}/reset-password:
   *   post:
   *     summary: Reset mật khẩu cho người dùng (Admin)
   *     tags: [Users]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *         description: ID người dùng
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/ResetPasswordRequest'
   *     responses:
   *       200:
   *         description: Reset mật khẩu thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/SuccessResponse'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Chỉ ADMIN được reset mật khẩu
   *       404:
   *         description: Không tìm thấy người dùng
   */
  router.post(
    '/:id/reset-password',
    authorize(UserRole.ADMIN),
    validateResetPassword,
    userController.resetPassword
  );

  return router;
}

/**
 * @swagger
 * components:
 *   schemas:
 *     UserRole:
 *       type: string
 *       enum: [ADMIN, SALES, WAREHOUSE, PRODUCTION, QC, INSTALLER, ACCOUNTANT]
 *       description: Vai trò người dùng
 *
 *     UserStatus:
 *       type: string
 *       enum: [ACTIVE, INACTIVE, SUSPENDED]
 *       description: Trạng thái người dùng
 *
 *     CreateUserRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *         - fullName
 *         - role
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: user@example.com
 *         password:
 *           type: string
 *           minLength: 8
 *           example: password123
 *         fullName:
 *           type: string
 *           example: Nguyễn Văn A
 *         phone:
 *           type: string
 *           example: "0901234567"
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *
 *     UpdateUserRequest:
 *       type: object
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *         fullName:
 *           type: string
 *         phone:
 *           type: string
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         status:
 *           $ref: '#/components/schemas/UserStatus'
 *
 *     ChangePasswordRequest:
 *       type: object
 *       required:
 *         - currentPassword
 *         - newPassword
 *       properties:
 *         currentPassword:
 *           type: string
 *           example: oldpassword123
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           example: newpassword123
 *
 *     ResetPasswordRequest:
 *       type: object
 *       required:
 *         - newPassword
 *       properties:
 *         newPassword:
 *           type: string
 *           minLength: 8
 *           example: newpassword123
 *
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         email:
 *           type: string
 *           format: email
 *         fullName:
 *           type: string
 *         phone:
 *           type: string
 *           nullable: true
 *         role:
 *           $ref: '#/components/schemas/UserRole'
 *         status:
 *           $ref: '#/components/schemas/UserStatus'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           $ref: '#/components/schemas/User'
 *
 *     UserListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         data:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/User'
 *         meta:
 *           type: object
 *           properties:
 *             page:
 *               type: integer
 *             pageSize:
 *               type: integer
 *             total:
 *               type: integer
 *             totalPages:
 *               type: integer
 *
 *     SuccessResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 */

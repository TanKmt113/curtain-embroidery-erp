import { Router } from 'express';
import { CustomerController } from '../controllers';
import {
  validateCreateCustomer,
  validateUpdateCustomer,
  validateListCustomersQuery,
} from '../validators';
import { createAuthMiddleware, authorize } from '../middlewares';
import { ITokenService } from '../../application/interfaces';
import { UserRole } from '../../domain/entities';

export function createCustomerRouter(
  customerController: CustomerController,
  tokenService: ITokenService
): Router {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  // All routes require authentication
  router.use(authMiddleware);

  /**
   * @swagger
   * /customers:
   *   post:
   *     summary: Tạo khách hàng mới
   *     tags: [Customers]
   *     security:
   *       - BearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateCustomerRequest'
   *     responses:
   *       201:
   *         description: Tạo khách hàng thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CustomerResponse'
   *       400:
   *         description: Validation error
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/ErrorResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Chỉ ADMIN và SALES được tạo khách hàng
   *       409:
   *         description: Conflict - Email đã tồn tại
   */
  router.post(
    '/',
    authorize(UserRole.ADMIN, UserRole.SALES),
    validateCreateCustomer,
    customerController.create
  );

  /**
   * @swagger
   * /customers:
   *   get:
   *     summary: Lấy danh sách khách hàng
   *     tags: [Customers]
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
   *         description: Tìm kiếm theo tên, mã, email, SĐT
   *       - in: query
   *         name: type
   *         schema:
   *           $ref: '#/components/schemas/CustomerType'
   *         description: Lọc theo loại khách hàng
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: boolean
   *         description: Lọc theo trạng thái hoạt động
   *     responses:
   *       200:
   *         description: Danh sách khách hàng
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CustomerListResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   */
  router.get(
    '/',
    authorize(
      UserRole.ADMIN,
      UserRole.SALES,
      UserRole.WAREHOUSE,
      UserRole.INSTALLER,
      UserRole.ACCOUNTANT
    ),
    validateListCustomersQuery,
    customerController.list
  );

  /**
   * @swagger
   * /customers/{id}:
   *   get:
   *     summary: Lấy thông tin chi tiết khách hàng
   *     tags: [Customers]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID của khách hàng
   *     responses:
   *       200:
   *         description: Thông tin khách hàng
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CustomerResponse'
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden
   *       404:
   *         description: Không tìm thấy khách hàng
   */
  router.get(
    '/:id',
    authorize(
      UserRole.ADMIN,
      UserRole.SALES,
      UserRole.WAREHOUSE,
      UserRole.INSTALLER,
      UserRole.ACCOUNTANT
    ),
    customerController.getById
  );

  /**
   * @swagger
   * /customers/{id}:
   *   put:
   *     summary: Cập nhật thông tin khách hàng
   *     tags: [Customers]
   *     security:
   *       - BearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *         description: ID của khách hàng
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/UpdateCustomerRequest'
   *     responses:
   *       200:
   *         description: Cập nhật thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/CustomerResponse'
   *       400:
   *         description: Validation error
   *       401:
   *         description: Unauthorized
   *       403:
   *         description: Forbidden - Chỉ ADMIN và SALES được cập nhật
   *       404:
   *         description: Không tìm thấy khách hàng
   *       409:
   *         description: Conflict - Email đã tồn tại
   */
  router.put(
    '/:id',
    authorize(UserRole.ADMIN, UserRole.SALES),
    validateUpdateCustomer,
    customerController.update
  );

  return router;
}

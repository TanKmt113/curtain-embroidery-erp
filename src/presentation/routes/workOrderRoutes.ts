import { Router } from 'express';
import { WorkOrderController } from '../controllers/WorkOrderController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import {
  CreateWorkOrderSchema,
  UpdateWorkOrderStatusSchema,
  CompleteWorkOrderSchema,
  WorkOrderListQuerySchema,
} from '../validators/work-order.validator';
import { ITokenService } from '../../application/interfaces';

export const createWorkOrderRoutes = (workOrderController: WorkOrderController, tokenService: ITokenService): Router => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  /**
   * @swagger
   * components:
   *   schemas:
   *     WorkOrder:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           format: uuid
   *         code:
   *           type: string
   *           example: "WO2024010001"
   *         orderId:
   *           type: string
   *           format: uuid
   *         orderItemId:
   *           type: string
   *           format: uuid
   *         status:
   *           type: string
   *           enum: [PENDING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED]
   *         quantity:
   *           type: integer
   *         completedQty:
   *           type: integer
   *         defectQty:
   *           type: integer
   *         assigneeId:
   *           type: string
   *           format: uuid
   *         priority:
   *           type: integer
   *           minimum: 1
   *           maximum: 10
   *         plannedStartDate:
   *           type: string
   *           format: date-time
   *         plannedEndDate:
   *           type: string
   *           format: date-time
   *         actualStartDate:
   *           type: string
   *           format: date-time
   *         actualEndDate:
   *           type: string
   *           format: date-time
   */

  /**
   * @swagger
   * /api/work-orders:
   *   get:
   *     tags: [Work Orders]
   *     summary: List all work orders
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *       - in: query
   *         name: orderId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [PENDING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED]
   *       - in: query
   *         name: assigneeId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *     responses:
   *       200:
   *         description: List of work orders
   */
  router.get(
    '/',
    authMiddleware,
    validateRequest({ query: WorkOrderListQuerySchema }),
    workOrderController.list
  );

  /**
   * @swagger
   * /api/work-orders/{id}:
   *   get:
   *     tags: [Work Orders]
   *     summary: Get work order by ID with steps
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     responses:
   *       200:
   *         description: Work order details with steps
   */
  router.get('/:id', authMiddleware, workOrderController.get);

  /**
   * @swagger
   * /api/work-orders:
   *   post:
   *     tags: [Work Orders]
   *     summary: Create a new work order
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - orderId
   *               - orderItemId
   *               - quantity
   *             properties:
   *               orderId:
   *                 type: string
   *                 format: uuid
   *               orderItemId:
   *                 type: string
   *                 format: uuid
   *               quantity:
   *                 type: integer
   *               assigneeId:
   *                 type: string
   *                 format: uuid
   *               priority:
   *                 type: integer
   *                 minimum: 1
   *                 maximum: 10
   *               plannedStartDate:
   *                 type: string
   *                 format: date-time
   *               plannedEndDate:
   *                 type: string
   *                 format: date-time
   *     responses:
   *       201:
   *         description: Work order created successfully
   */
  router.post(
    '/',
    authMiddleware,
    validateRequest({ body: CreateWorkOrderSchema }),
    workOrderController.create
  );

  /**
   * @swagger
   * /api/work-orders/{id}/status:
   *   patch:
   *     tags: [Work Orders]
   *     summary: Update work order status
   *     description: |
   *       Status flow: PENDING → IN_PROGRESS → COMPLETED
   *       
   *       - Can put ON_HOLD from IN_PROGRESS
   *       - Can CANCEL from PENDING or ON_HOLD
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - status
   *             properties:
   *               status:
   *                 type: string
   *                 enum: [PENDING, IN_PROGRESS, ON_HOLD, COMPLETED, CANCELLED]
   *               completedQty:
   *                 type: integer
   *               defectQty:
   *                 type: integer
   *     responses:
   *       200:
   *         description: Status updated successfully
   */
  router.patch(
    '/:id/status',
    authMiddleware,
    validateRequest({ body: UpdateWorkOrderStatusSchema }),
    workOrderController.updateStatus
  );

  /**
   * @swagger
   * /api/work-orders/{id}/complete:
   *   post:
   *     tags: [Work Orders]
   *     summary: Complete a work order
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *           format: uuid
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - completedQty
   *             properties:
   *               completedQty:
   *                 type: integer
   *               defectQty:
   *                 type: integer
   *               actualEndDate:
   *                 type: string
   *                 format: date-time
   *               notes:
   *                 type: string
   *     responses:
   *       200:
   *         description: Work order completed successfully
   */
  router.post(
    '/:id/complete',
    authMiddleware,
    validateRequest({ body: CompleteWorkOrderSchema }),
    workOrderController.complete
  );

  return router;
};

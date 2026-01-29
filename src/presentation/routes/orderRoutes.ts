import { Router } from 'express';
import { OrderController } from '../controllers/OrderController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateOrderSchema, UpdateOrderStatusSchema, OrderListQuerySchema } from '../validators/order.validator';
import { ITokenService } from '../../application/interfaces';

export const createOrderRoutes = (orderController: OrderController, tokenService: ITokenService): Router => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  /**
   * @swagger
   * components:
   *   schemas:
   *     Order:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           format: uuid
   *         code:
   *           type: string
   *           example: "SO2024010001"
   *         customerId:
   *           type: string
   *           format: uuid
   *         quotationId:
   *           type: string
   *           format: uuid
   *         status:
   *           type: string
   *           enum: [CONFIRMED, PRODUCTION, QC_PENDING, READY_DELIVERY, DELIVERING, COMPLETED, CANCELLED]
   *         totalAmount:
   *           type: number
   *         discount:
   *           type: number
   *         finalAmount:
   *           type: number
   *         depositPaid:
   *           type: number
   *         remainingAmount:
   *           type: number
   *         deliveryDate:
   *           type: string
   *           format: date-time
   *         deliveryAddress:
   *           type: string
   *     OrderItem:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           format: uuid
   *         productId:
   *           type: string
   *           format: uuid
   *         itemType:
   *           type: string
   *           enum: [CURTAIN_WINDOW, PROCESSING_BATCH]
   *         quantity:
   *           type: number
   *         unitPrice:
   *           type: number
   *         totalPrice:
   *           type: number
   *         producedQty:
   *           type: number
   *         deliveredQty:
   *           type: number
   */

  /**
   * @swagger
   * /api/orders:
   *   get:
   *     tags: [Orders]
   *     summary: List all orders
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *       - in: query
   *         name: customerId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [CONFIRMED, PRODUCTION, QC_PENDING, READY_DELIVERY, DELIVERING, COMPLETED, CANCELLED]
   *       - in: query
   *         name: fromDate
   *         schema:
   *           type: string
   *           format: date-time
   *       - in: query
   *         name: toDate
   *         schema:
   *           type: string
   *           format: date-time
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
   *         description: List of orders
   */
  router.get(
    '/',
    authMiddleware,
    validateRequest({ query: OrderListQuerySchema }),
    orderController.list
  );

  /**
   * @swagger
   * /api/orders/{id}:
   *   get:
   *     tags: [Orders]
   *     summary: Get order by ID with items
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
   *         description: Order details with items
   */
  router.get('/:id', authMiddleware, orderController.get);

  /**
   * @swagger
   * /api/orders:
   *   post:
   *     tags: [Orders]
   *     summary: Create a new order
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - customerId
   *               - items
   *             properties:
   *               customerId:
   *                 type: string
   *                 format: uuid
   *               quotationId:
   *                 type: string
   *                 format: uuid
   *               deliveryDate:
   *                 type: string
   *                 format: date-time
   *               deliveryAddress:
   *                 type: string
   *               notes:
   *                 type: string
   *               items:
   *                 type: array
   *                 items:
   *                   type: object
   *                   required:
   *                     - productId
   *                     - itemType
   *                     - quantity
   *                     - unitPrice
   *                   properties:
   *                     productId:
   *                       type: string
   *                       format: uuid
   *                     itemType:
   *                       type: string
   *                       enum: [CURTAIN_WINDOW, PROCESSING_BATCH]
   *                     quantity:
   *                       type: number
   *                     unitPrice:
   *                       type: number
   *     responses:
   *       201:
   *         description: Order created successfully
   */
  router.post(
    '/',
    authMiddleware,
    validateRequest({ body: CreateOrderSchema }),
    orderController.create
  );

  /**
   * @swagger
   * /api/orders/{id}/status:
   *   patch:
   *     tags: [Orders]
   *     summary: Update order status
   *     description: |
   *       Status flow: CONFIRMED → PRODUCTION → QC_PENDING → READY_DELIVERY → DELIVERING → COMPLETED
   *       
   *       - From QC_PENDING can go back to PRODUCTION if QC fails
   *       - From DELIVERING can go back to READY_DELIVERY if delivery fails
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
   *                 enum: [CONFIRMED, PRODUCTION, QC_PENDING, READY_DELIVERY, DELIVERING, COMPLETED, CANCELLED]
   *               reason:
   *                 type: string
   *     responses:
   *       200:
   *         description: Status updated successfully
   */
  router.patch(
    '/:id/status',
    authMiddleware,
    validateRequest({ body: UpdateOrderStatusSchema }),
    orderController.updateStatus
  );

  return router;
};

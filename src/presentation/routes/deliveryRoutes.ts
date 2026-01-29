import { Router } from 'express';
import { DeliveryController } from '../controllers/DeliveryController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateDeliverySchema, UpdateDeliveryStatusSchema, DeliveryListQuerySchema } from '../validators/delivery.validator';
import { ITokenService } from '../../application/interfaces';

export const createDeliveryRoutes = (deliveryController: DeliveryController, tokenService: ITokenService): Router => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  /**
   * @swagger
   * components:
   *   schemas:
   *     Delivery:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           format: uuid
   *         code:
   *           type: string
   *           example: "DLV2024010001"
   *         orderId:
   *           type: string
   *           format: uuid
   *         type:
   *           type: string
   *           enum: [DELIVERY, INSTALLATION]
   *           description: |
   *             - DELIVERY: Giao hàng thông thường
   *             - INSTALLATION: Giao và lắp đặt
   *         status:
   *           type: string
   *           enum: [SCHEDULED, IN_TRANSIT, DELIVERED, FAILED, CANCELLED]
   *         scheduledDate:
   *           type: string
   *           format: date-time
   *         actualDate:
   *           type: string
   *           format: date-time
   *         address:
   *           type: string
   *         contactName:
   *           type: string
   *         contactPhone:
   *           type: string
   */

  /**
   * @swagger
   * /api/deliveries:
   *   get:
   *     tags: [Deliveries]
   *     summary: List all deliveries
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: orderId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [DELIVERY, INSTALLATION]
   *       - in: query
   *         name: status
   *         schema:
   *           type: string
   *           enum: [SCHEDULED, IN_TRANSIT, DELIVERED, FAILED, CANCELLED]
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
   *         description: List of deliveries
   */
  router.get(
    '/',
    authMiddleware,
    validateRequest({ query: DeliveryListQuerySchema }),
    deliveryController.list
  );

  /**
   * @swagger
   * /api/deliveries/{id}:
   *   get:
   *     tags: [Deliveries]
   *     summary: Get delivery by ID with items
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
   *         description: Delivery details with items
   */
  router.get('/:id', authMiddleware, deliveryController.get);

  /**
   * @swagger
   * /api/deliveries:
   *   post:
   *     tags: [Deliveries]
   *     summary: Create a new delivery
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
   *               - type
   *               - scheduledDate
   *               - items
   *             properties:
   *               orderId:
   *                 type: string
   *                 format: uuid
   *               type:
   *                 type: string
   *                 enum: [DELIVERY, INSTALLATION]
   *               scheduledDate:
   *                 type: string
   *                 format: date-time
   *               address:
   *                 type: string
   *               contactName:
   *                 type: string
   *               contactPhone:
   *                 type: string
   *               notes:
   *                 type: string
   *               items:
   *                 type: array
   *                 items:
   *                   type: object
   *                   required:
   *                     - orderItemId
   *                     - quantity
   *                   properties:
   *                     orderItemId:
   *                       type: string
   *                       format: uuid
   *                     quantity:
   *                       type: integer
   *                     notes:
   *                       type: string
   *     responses:
   *       201:
   *         description: Delivery created successfully
   */
  router.post(
    '/',
    authMiddleware,
    validateRequest({ body: CreateDeliverySchema }),
    deliveryController.create
  );

  /**
   * @swagger
   * /api/deliveries/{id}/status:
   *   patch:
   *     tags: [Deliveries]
   *     summary: Update delivery status
   *     description: |
   *       Status flow: SCHEDULED → IN_TRANSIT → DELIVERED
   *       
   *       - Can mark as FAILED from IN_TRANSIT
   *       - Can reschedule (back to SCHEDULED) from FAILED
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
   *                 enum: [SCHEDULED, IN_TRANSIT, DELIVERED, FAILED, CANCELLED]
   *               actualDate:
   *                 type: string
   *                 format: date-time
   *               notes:
   *                 type: string
   *     responses:
   *       200:
   *         description: Status updated successfully
   */
  router.patch(
    '/:id/status',
    authMiddleware,
    validateRequest({ body: UpdateDeliveryStatusSchema }),
    deliveryController.updateStatus
  );

  return router;
};

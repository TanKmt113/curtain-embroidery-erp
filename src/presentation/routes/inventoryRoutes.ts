import { Router } from 'express';
import { InventoryController } from '../controllers/InventoryController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { StockReceiveSchema, StockAdjustmentSchema, InventoryListQuerySchema } from '../validators/inventory.validator';
import { ITokenService } from '../../application/interfaces';

export const createInventoryRoutes = (inventoryController: InventoryController, tokenService: ITokenService): Router => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  /**
   * @swagger
   * components:
   *   schemas:
   *     Inventory:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           format: uuid
   *         productId:
   *           type: string
   *           format: uuid
   *         materialId:
   *           type: string
   *           format: uuid
   *         warehouse:
   *           type: string
   *         ownership:
   *           type: string
   *           enum: [COMPANY, CONSIGNMENT]
   *           description: |
   *             - COMPANY: Hàng của công ty
   *             - CONSIGNMENT: Hàng ký gửi của khách
   *         customerId:
   *           type: string
   *           format: uuid
   *           description: Required when ownership is CONSIGNMENT
   *         quantity:
   *           type: number
   *         reservedQty:
   *           type: number
   *         availableQty:
   *           type: number
   *         minStock:
   *           type: number
   *         maxStock:
   *           type: number
   */

  /**
   * @swagger
   * /api/inventory:
   *   get:
   *     tags: [Inventory]
   *     summary: List all inventory items
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: productId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: materialId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: ownership
   *         schema:
   *           type: string
   *           enum: [COMPANY, CONSIGNMENT]
   *       - in: query
   *         name: customerId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: warehouse
   *         schema:
   *           type: string
   *       - in: query
   *         name: lowStock
   *         schema:
   *           type: string
   *           enum: [true, false]
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
   *         description: List of inventory items
   */
  router.get(
    '/',
    authMiddleware,
    validateRequest({ query: InventoryListQuerySchema }),
    inventoryController.list
  );

  /**
   * @swagger
   * /api/inventory/{id}:
   *   get:
   *     tags: [Inventory]
   *     summary: Get inventory item by ID
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
   *         description: Inventory item details
   */
  router.get('/:id', authMiddleware, inventoryController.get);

  /**
   * @swagger
   * /api/inventory/receive:
   *   post:
   *     tags: [Inventory]
   *     summary: Receive stock into inventory
   *     description: Add stock to existing inventory or create new inventory record
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - warehouse
   *               - quantity
   *             properties:
   *               productId:
   *                 type: string
   *                 format: uuid
   *               materialId:
   *                 type: string
   *                 format: uuid
   *               warehouse:
   *                 type: string
   *               ownership:
   *                 type: string
   *                 enum: [COMPANY, CONSIGNMENT]
   *               customerId:
   *                 type: string
   *                 format: uuid
   *               quantity:
   *                 type: number
   *               referenceType:
   *                 type: string
   *               referenceId:
   *                 type: string
   *               notes:
   *                 type: string
   *     responses:
   *       201:
   *         description: Stock received successfully
   */
  router.post(
    '/receive',
    authMiddleware,
    validateRequest({ body: StockReceiveSchema }),
    inventoryController.receive
  );

  /**
   * @swagger
   * /api/inventory/adjust:
   *   post:
   *     tags: [Inventory]
   *     summary: Adjust stock quantity
   *     description: Increase or decrease stock quantity with reason
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - inventoryId
   *               - adjustmentQty
   *               - reason
   *             properties:
   *               inventoryId:
   *                 type: string
   *                 format: uuid
   *               adjustmentQty:
   *                 type: number
   *                 description: Positive to increase, negative to decrease
   *               reason:
   *                 type: string
   *     responses:
   *       200:
   *         description: Stock adjusted successfully
   */
  router.post(
    '/adjust',
    authMiddleware,
    validateRequest({ body: StockAdjustmentSchema }),
    inventoryController.adjust
  );

  return router;
};

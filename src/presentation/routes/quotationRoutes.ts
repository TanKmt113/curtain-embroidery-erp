import { Router } from 'express';
import { QuotationController } from '../controllers/QuotationController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateQuotationSchema, UpdateQuotationStatusSchema, QuotationListQuerySchema } from '../validators/quotation.validator';
import { ITokenService } from '../../application/interfaces';

export const createQuotationRoutes = (quotationController: QuotationController, tokenService: ITokenService): Router => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  /**
   * @swagger
   * components:
   *   schemas:
   *     Quotation:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           format: uuid
   *         code:
   *           type: string
   *           example: "QT2024010001"
   *         customerId:
   *           type: string
   *           format: uuid
   *         status:
   *           type: string
   *           enum: [DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED, CONVERTED, CANCELLED]
   *         totalAmount:
   *           type: number
   *         discount:
   *           type: number
   *         finalAmount:
   *           type: number
   *         validUntil:
   *           type: string
   *           format: date-time
   *         items:
   *           type: array
   *           items:
   *             $ref: '#/components/schemas/QuotationItem'
   *     QuotationItem:
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
   *         windowLabel:
   *           type: string
   *           description: For curtain items (e.g., "Phòng khách - Cửa sổ 1")
   *         batchLabel:
   *           type: string
   *           description: For processing items (e.g., "Lô thêu tháng 1")
   */

  /**
   * @swagger
   * /api/quotations:
   *   get:
   *     tags: [Quotations]
   *     summary: List all quotations
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
   *           enum: [DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED, CONVERTED, CANCELLED]
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
   *         description: List of quotations
   */
  router.get(
    '/',
    authMiddleware,
    validateRequest({ query: QuotationListQuerySchema }),
    quotationController.list
  );

  /**
   * @swagger
   * /api/quotations/{id}:
   *   get:
   *     tags: [Quotations]
   *     summary: Get quotation by ID with items
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
   *         description: Quotation details with items
   */
  router.get('/:id', authMiddleware, quotationController.get);

  /**
   * @swagger
   * /api/quotations:
   *   post:
   *     tags: [Quotations]
   *     summary: Create a new quotation
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
   *               validUntil:
   *                 type: string
   *                 format: date-time
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
   *                     width:
   *                       type: number
   *                     height:
   *                       type: number
   *                     windowLabel:
   *                       type: string
   *                     batchLabel:
   *                       type: string
   *     responses:
   *       201:
   *         description: Quotation created successfully
   */
  router.post(
    '/',
    authMiddleware,
    validateRequest({ body: CreateQuotationSchema }),
    quotationController.create
  );

  /**
   * @swagger
   * /api/quotations/{id}/status:
   *   patch:
   *     tags: [Quotations]
   *     summary: Update quotation status
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
   *                 enum: [DRAFT, SENT, ACCEPTED, REJECTED, EXPIRED, CONVERTED, CANCELLED]
   *               reason:
   *                 type: string
   *     responses:
   *       200:
   *         description: Status updated successfully
   */
  router.patch(
    '/:id/status',
    authMiddleware,
    validateRequest({ body: UpdateQuotationStatusSchema }),
    quotationController.updateStatus
  );

  return router;
};

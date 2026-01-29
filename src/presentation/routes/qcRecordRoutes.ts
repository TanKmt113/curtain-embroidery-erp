import { Router } from 'express';
import { QCRecordController } from '../controllers/QCRecordController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateQCRecordSchema, UpdateQCRecordSchema, QCRecordListQuerySchema } from '../validators/qc-record.validator';
import { ITokenService } from '../../application/interfaces';

export const createQCRecordRoutes = (qcRecordController: QCRecordController, tokenService: ITokenService): Router => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  /**
   * @swagger
   * components:
   *   schemas:
   *     QCRecord:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           format: uuid
   *         code:
   *           type: string
   *           example: "QC2024010001"
   *         orderId:
   *           type: string
   *           format: uuid
   *         orderItemId:
   *           type: string
   *           format: uuid
   *         workOrderId:
   *           type: string
   *           format: uuid
   *         result:
   *           type: string
   *           enum: [PASS, PASS_WITH_MINOR, FAIL]
   *         defectsFound:
   *           type: array
   *           items:
   *             type: string
   *         notes:
   *           type: string
   *         images:
   *           type: array
   *           items:
   *             type: string
   *             format: uri
   *         inspectorId:
   *           type: string
   *           format: uuid
   */

  /**
   * @swagger
   * /api/qc-records:
   *   get:
   *     tags: [QC Records]
   *     summary: List all QC records
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: orderId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: inspectorId
   *         schema:
   *           type: string
   *           format: uuid
   *       - in: query
   *         name: result
   *         schema:
   *           type: string
   *           enum: [PASS, PASS_WITH_MINOR, FAIL]
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
   *         description: List of QC records
   */
  router.get(
    '/',
    authMiddleware,
    validateRequest({ query: QCRecordListQuerySchema }),
    qcRecordController.list
  );

  /**
   * @swagger
   * /api/qc-records/{id}:
   *   get:
   *     tags: [QC Records]
   *     summary: Get QC record by ID
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
   *         description: QC record details
   */
  router.get('/:id', authMiddleware, qcRecordController.get);

  /**
   * @swagger
   * /api/qc-records:
   *   post:
   *     tags: [QC Records]
   *     summary: Create a new QC record
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
   *               - result
   *             properties:
   *               orderId:
   *                 type: string
   *                 format: uuid
   *               orderItemId:
   *                 type: string
   *                 format: uuid
   *               workOrderId:
   *                 type: string
   *                 format: uuid
   *               result:
   *                 type: string
   *                 enum: [PASS, PASS_WITH_MINOR, FAIL]
   *               defectsFound:
   *                 type: array
   *                 items:
   *                   type: string
   *               notes:
   *                 type: string
   *               images:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: uri
   *     responses:
   *       201:
   *         description: QC record created successfully
   */
  router.post(
    '/',
    authMiddleware,
    validateRequest({ body: CreateQCRecordSchema }),
    qcRecordController.create
  );

  /**
   * @swagger
   * /api/qc-records/{id}:
   *   put:
   *     tags: [QC Records]
   *     summary: Update a QC record
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
   *             properties:
   *               result:
   *                 type: string
   *                 enum: [PASS, PASS_WITH_MINOR, FAIL]
   *               defectsFound:
   *                 type: array
   *                 items:
   *                   type: string
   *               notes:
   *                 type: string
   *               images:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: uri
   *     responses:
   *       200:
   *         description: QC record updated successfully
   */
  router.put(
    '/:id',
    authMiddleware,
    validateRequest({ body: UpdateQCRecordSchema }),
    qcRecordController.update
  );

  return router;
};

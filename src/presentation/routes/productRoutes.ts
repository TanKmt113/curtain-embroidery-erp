import { Router } from 'express';
import { ProductController } from '../controllers/ProductController';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { validateRequest } from '../middlewares/validateRequest';
import { CreateProductSchema, UpdateProductSchema, ProductListQuerySchema } from '../validators/product.validator';
import { ITokenService } from '../../application/interfaces';

export const createProductRoutes = (productController: ProductController, tokenService: ITokenService): Router => {
  const router = Router();
  const authMiddleware = createAuthMiddleware(tokenService);

  /**
   * @swagger
   * components:
   *   schemas:
   *     Product:
   *       type: object
   *       properties:
   *         id:
   *           type: string
   *           format: uuid
   *         code:
   *           type: string
   *           example: "CUR00001"
   *         name:
   *           type: string
   *           example: "Rèm cửa cao cấp"
   *         type:
   *           type: string
   *           enum: [CURTAIN, EMBROIDERY, CUSHION, SERVICE]
   *         unit:
   *           type: string
   *           example: "bộ"
   *         basePrice:
   *           type: number
   *           example: 1500000
   *         description:
   *           type: string
   *         isActive:
   *           type: boolean
   *         createdAt:
   *           type: string
   *           format: date-time
   *         updatedAt:
   *           type: string
   *           format: date-time
   *     CreateProduct:
   *       type: object
   *       required:
   *         - name
   *         - type
   *         - unit
   *         - basePrice
   *       properties:
   *         name:
   *           type: string
   *         type:
   *           type: string
   *           enum: [CURTAIN, EMBROIDERY, CUSHION, SERVICE]
   *         unit:
   *           type: string
   *         basePrice:
   *           type: number
   *         description:
   *           type: string
   *         specifications:
   *           type: object
   */

  /**
   * @swagger
   * /api/products:
   *   get:
   *     tags: [Products]
   *     summary: List all products
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: search
   *         schema:
   *           type: string
   *         description: Search by code or name
   *       - in: query
   *         name: type
   *         schema:
   *           type: string
   *           enum: [CURTAIN, EMBROIDERY, CUSHION, SERVICE]
   *       - in: query
   *         name: isActive
   *         schema:
   *           type: string
   *           enum: [true, false]
   *       - in: query
   *         name: page
   *         schema:
   *           type: integer
   *           default: 1
   *       - in: query
   *         name: pageSize
   *         schema:
   *           type: integer
   *           default: 20
   *     responses:
   *       200:
   *         description: List of products
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Product'
   *                 pagination:
   *                   $ref: '#/components/schemas/Pagination'
   */
  router.get(
    '/',
    authMiddleware,
    validateRequest({ query: ProductListQuerySchema }),
    productController.list
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   get:
   *     tags: [Products]
   *     summary: Get product by ID
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
   *         description: Product details
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Product'
   *       404:
   *         description: Product not found
   */
  router.get('/:id', authMiddleware, productController.get);

  /**
   * @swagger
   * /api/products:
   *   post:
   *     tags: [Products]
   *     summary: Create a new product
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             $ref: '#/components/schemas/CreateProduct'
   *     responses:
   *       201:
   *         description: Product created successfully
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   $ref: '#/components/schemas/Product'
   */
  router.post(
    '/',
    authMiddleware,
    validateRequest({ body: CreateProductSchema }),
    productController.create
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   put:
   *     tags: [Products]
   *     summary: Update a product
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
   *             $ref: '#/components/schemas/CreateProduct'
   *     responses:
   *       200:
   *         description: Product updated successfully
   */
  router.put(
    '/:id',
    authMiddleware,
    validateRequest({ body: UpdateProductSchema }),
    productController.update
  );

  /**
   * @swagger
   * /api/products/{id}:
   *   delete:
   *     tags: [Products]
   *     summary: Delete a product (soft delete)
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
   *         description: Product deleted successfully
   */
  router.delete('/:id', authMiddleware, productController.delete);

  return router;
};

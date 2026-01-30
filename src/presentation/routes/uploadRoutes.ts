import { Router } from 'express';
import { UploadController } from '../controllers/UploadController';
import { uploadImage, uploadImages } from '../middlewares/upload.middleware';
import { createAuthMiddleware } from '../middlewares/authMiddleware';
import { ITokenService } from '../../application/interfaces';

/**
 * @swagger
 * components:
 *   schemas:
 *     UploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             url:
 *               type: string
 *               description: URL của file đã upload
 *             filename:
 *               type: string
 *               description: Tên file gốc
 *             size:
 *               type: number
 *               description: Kích thước file (bytes)
 *             mimetype:
 *               type: string
 *               description: MIME type của file
 *     MultiUploadResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               url:
 *                 type: string
 *               filename:
 *                 type: string
 *               size:
 *                 type: number
 *               mimetype:
 *                 type: string
 */

export function createUploadRoutes(uploadController: UploadController, tokenService: ITokenService): Router {
  const router = Router();
  const authenticate = createAuthMiddleware(tokenService);

  /**
   * @swagger
   * /api/upload/image:
   *   post:
   *     tags: [Upload]
   *     summary: Upload một hình ảnh
   *     description: Upload một hình ảnh lên server. Hỗ trợ JPEG, PNG, GIF, WebP. Max 5MB.
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: folder
   *         schema:
   *           type: string
   *           enum: [products, materials, users, documents]
   *           default: products
   *         description: Thư mục lưu trữ
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *                 description: File hình ảnh cần upload
   *     responses:
   *       200:
   *         description: Upload thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/UploadResponse'
   *             example:
   *               success: true
   *               message: "File uploaded successfully"
   *               data:
   *                 url: "/uploads/products/abc123.jpg"
   *                 filename: "product-image.jpg"
   *                 size: 102400
   *                 mimetype: "image/jpeg"
   *       400:
   *         description: Lỗi validation (không có file, sai định dạng, quá kích thước)
   *       401:
   *         description: Chưa đăng nhập
   */
  router.post(
    '/image',
    authenticate,
    uploadImage.single('file'),
    uploadController.uploadImage
  );

  /**
   * @swagger
   * /api/upload/images:
   *   post:
   *     tags: [Upload]
   *     summary: Upload nhiều hình ảnh
   *     description: Upload nhiều hình ảnh cùng lúc (tối đa 10 file)
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: query
   *         name: folder
   *         schema:
   *           type: string
   *           enum: [products, materials, users, documents]
   *           default: products
   *         description: Thư mục lưu trữ
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - files
   *             properties:
   *               files:
   *                 type: array
   *                 items:
   *                   type: string
   *                   format: binary
   *                 description: Các file hình ảnh cần upload
   *     responses:
   *       200:
   *         description: Upload thành công
   *         content:
   *           application/json:
   *             schema:
   *               $ref: '#/components/schemas/MultiUploadResponse'
   *       400:
   *         description: Lỗi validation
   *       401:
   *         description: Chưa đăng nhập
   */
  router.post(
    '/images',
    authenticate,
    uploadImages.array('files', 10),
    uploadController.uploadImages
  );

  /**
   * @swagger
   * /api/upload:
   *   delete:
   *     tags: [Upload]
   *     summary: Xóa file đã upload
   *     description: Xóa một file đã upload khỏi server
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         application/json:
   *           schema:
   *             type: object
   *             required:
   *               - url
   *             properties:
   *               url:
   *                 type: string
   *                 description: URL của file cần xóa
   *                 example: "/uploads/products/abc123.jpg"
   *     responses:
   *       200:
   *         description: Xóa thành công
   *       404:
   *         description: File không tồn tại
   *       401:
   *         description: Chưa đăng nhập
   */
  router.delete('/', authenticate, uploadController.deleteFile);

  return router;
}

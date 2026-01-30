import { Request, Response } from 'express';
import { IStorageService } from '../../infrastructure/storage/LocalStorageService';

export class UploadController {
  constructor(private storageService: IStorageService) {}

  /**
   * Upload single image
   * POST /api/upload/image
   */
  uploadImage = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.file) {
        res.status(400).json({
          success: false,
          message: 'No file uploaded',
        });
        return;
      }

      const folder = (req.query.folder as string) || 'products';
      const allowedFolders = ['products', 'materials', 'users', 'documents'];

      if (!allowedFolders.includes(folder)) {
        res.status(400).json({
          success: false,
          message: `Invalid folder. Allowed: ${allowedFolders.join(', ')}`,
        });
        return;
      }

      const url = await this.storageService.saveFile(req.file, folder);

      res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: {
          url,
          filename: req.file.originalname,
          size: req.file.size,
          mimetype: req.file.mimetype,
        },
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload file',
      });
    }
  };

  /**
   * Upload multiple images
   * POST /api/upload/images
   */
  uploadImages = async (req: Request, res: Response): Promise<void> => {
    try {
      const files = req.files as Express.Multer.File[];

      if (!files || files.length === 0) {
        res.status(400).json({
          success: false,
          message: 'No files uploaded',
        });
        return;
      }

      const folder = (req.query.folder as string) || 'products';
      const allowedFolders = ['products', 'materials', 'users', 'documents'];

      if (!allowedFolders.includes(folder)) {
        res.status(400).json({
          success: false,
          message: `Invalid folder. Allowed: ${allowedFolders.join(', ')}`,
        });
        return;
      }

      const uploadedFiles = await Promise.all(
        files.map(async (file) => {
          const url = await this.storageService.saveFile(file, folder);
          return {
            url,
            filename: file.originalname,
            size: file.size,
            mimetype: file.mimetype,
          };
        })
      );

      res.status(200).json({
        success: true,
        message: `${uploadedFiles.length} files uploaded successfully`,
        data: uploadedFiles,
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to upload files',
      });
    }
  };

  /**
   * Delete a file
   * DELETE /api/upload
   */
  deleteFile = async (req: Request, res: Response): Promise<void> => {
    try {
      const { url } = req.body;

      if (!url) {
        res.status(400).json({
          success: false,
          message: 'URL is required',
        });
        return;
      }

      const deleted = await this.storageService.deleteFile(url);

      if (deleted) {
        res.status(200).json({
          success: true,
          message: 'File deleted successfully',
        });
      } else {
        res.status(404).json({
          success: false,
          message: 'File not found',
        });
      }
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: error.message || 'Failed to delete file',
      });
    }
  };
}

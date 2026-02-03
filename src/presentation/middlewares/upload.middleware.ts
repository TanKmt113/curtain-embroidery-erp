import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';

// Hàm chung để lọc tệp
function createFileFilter(allowedTypes: string[], errorMessage: string) {
  return (req: Request, file: Express.Multer.File, callback: FileFilterCallback): void => {
    if (allowedTypes.includes(file.mimetype)) {
      callback(null, true);
    } else {
      callback(new Error(errorMessage));
    }
  };
}

// Các loại được phép và giới hạn dung lượng
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
const MAX_IMAGE_FILE_SIZE = 5 * 1024 * 1024; // 5MB

const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const MAX_DOCUMENT_FILE_SIZE = 10 * 1024 * 1024; // 10MB

const imageFileFilter = createFileFilter(ALLOWED_IMAGE_TYPES, `Invalid image type.`);
const documentFileFilter = createFileFilter(ALLOWED_DOCUMENT_TYPES, `Invalid document type.`);

// Cấu hình Multer
export const uploadImage = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_FILE_SIZE,
  },
  fileFilter: imageFileFilter,
});

export const uploadImages = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_IMAGE_FILE_SIZE,
    files: 10, // Tối đa 10 tệp một lần
  },
  fileFilter: imageFileFilter,
});

export const uploadDocument = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_DOCUMENT_FILE_SIZE,
  },
  fileFilter: documentFileFilter,
});

import { UploadController } from '../../presentation/controllers/UploadController';
import { localStorageService } from '../../infrastructure/storage/LocalStorageService';

export function createUploadController(): UploadController {
  return new UploadController(localStorageService);
}

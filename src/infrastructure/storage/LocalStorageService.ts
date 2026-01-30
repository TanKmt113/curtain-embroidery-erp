import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface IStorageService {
  saveFile(file: Express.Multer.File, folder: string): Promise<string>;
  deleteFile(filePath: string): Promise<boolean>;
  getFilePath(relativePath: string): string;
}

export class LocalStorageService implements IStorageService {
  private uploadDir: string;
  private baseUrl: string;

  constructor(uploadDir: string = 'uploads', baseUrl: string = '/uploads') {
    this.uploadDir = uploadDir;
    this.baseUrl = baseUrl;
    this.ensureUploadDir();
  }

  private ensureUploadDir(): void {
    const dirs = ['products', 'materials', 'users', 'documents'];
    dirs.forEach((dir) => {
      const fullPath = path.join(this.uploadDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
      }
    });
  }

  async saveFile(file: Express.Multer.File, folder: string): Promise<string> {
    const ext = path.extname(file.originalname).toLowerCase();
    const filename = `${uuidv4()}${ext}`;
    const relativePath = path.join(folder, filename);
    const fullPath = path.join(this.uploadDir, relativePath);

    // Ensure folder exists
    const folderPath = path.join(this.uploadDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    // Write file
    fs.writeFileSync(fullPath, file.buffer);

    // Return URL path
    return `${this.baseUrl}/${folder}/${filename}`.replace(/\\/g, '/');
  }

  async deleteFile(filePath: string): Promise<boolean> {
    try {
      // Convert URL path to file system path
      const relativePath = filePath.replace(this.baseUrl, '');
      const fullPath = path.join(this.uploadDir, relativePath);

      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting file:', error);
      return false;
    }
  }

  getFilePath(relativePath: string): string {
    return path.join(this.uploadDir, relativePath);
  }
}

export const localStorageService = new LocalStorageService();

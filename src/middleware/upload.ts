import type { Request } from 'express';
import multer from 'multer';
import path from 'node:path';
import fs from 'node:fs';
import sharp from 'sharp';
import { AppError } from './errorHandler';
import { toSnakeCase } from '../utils/stringUtils';

// Ensure upload directories exist
const uploadsDir = path.join(__dirname, '../../public/uploads');
const thumbnailsDir = path.join(__dirname, '../../public/uploads/thumbnails');

// Create directories if they don't exist
for (const dir of [uploadsDir, thumbnailsDir]) {
  if (!fs.existsSync(dir)) {
    console.log(`Creating directory: ${dir}`);
    fs.mkdirSync(dir, { recursive: true });
  }
}

// Configure multer for file upload
const storage = multer.diskStorage({
  destination: (_req: Request, _file: Express.Multer.File, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req: Request, file: Express.Multer.File, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    const fileName = req.body.name ? 
      `${toSnakeCase(req.body.name)}-${uniqueSuffix}${path.extname(file.originalname)}` :
      `product-${uniqueSuffix}${path.extname(file.originalname)}`;
    cb(null, fileName);
  }
});

// File filter
const fileFilter = (_req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  // Accept images only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) {
    return cb(new AppError('Chỉ chấp nhận file hình ảnh (jpg, jpeg, png, gif, webp)', 400));
  }
  cb(null, true);
};

// Create multer upload instance
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: Number.parseInt(process.env.MAX_FILE_SIZE || '10485760', 10) // 10MB default
  }
});

// Image configuration - adjust these based on your website design
const IMAGE_SETTINGS = {
  thumbnail: {
    width: 300,
    height: 300,
    fit: 'cover' as const,  // square crop
    position: 'center' as const,
    quality: 100
  },
  main: {
    width: 800,
    height: null,  // keep aspect ratio
    fit: 'inside' as const,
    quality: 100
  }
};

// Process image to create thumbnail and optimized main image
export const processImage = async (file: Express.Multer.File) => {
  if (!file) return null;
  
  try {
    const fileExt = path.extname(file.filename).toLowerCase();
    const fileName = path.parse(file.filename).name;
    
    // Create thumbnail path
    const thumbnailPath = path.join(thumbnailsDir, `thumb-${fileName}${fileExt}`);
    
    // Process and save the thumbnail
    await sharp(file.path)
      .resize(
        IMAGE_SETTINGS.thumbnail.width, 
        IMAGE_SETTINGS.thumbnail.height, 
        {
          fit: IMAGE_SETTINGS.thumbnail.fit,
          position: IMAGE_SETTINGS.thumbnail.position
        }
      )
      .jpeg({ quality: IMAGE_SETTINGS.thumbnail.quality })
      .toFile(thumbnailPath);
    
    // Optimize original image
    const optimizedPath = `${file.path}.optimized`;
    await sharp(file.path)
      .resize(
        IMAGE_SETTINGS.main.width, 
        IMAGE_SETTINGS.main.height, 
        {
          fit: IMAGE_SETTINGS.main.fit,
          withoutEnlargement: true
        }
      )
      .jpeg({ quality: IMAGE_SETTINGS.main.quality })
      .toFile(optimizedPath);
    
    // Replace original with optimized version
    fs.unlinkSync(file.path);
    fs.renameSync(optimizedPath, file.path);
    
    return {
      original: `/uploads/${file.filename}`,
      thumbnail: `/uploads/thumbnails/thumb-${fileName}${fileExt}`
    };
  } catch (error) {
    console.error('Error processing image:', error);
    return {
      original: `/uploads/${file.filename}`,
      thumbnail: `/uploads/${file.filename}` // Fallback to original if processing fails
    };
  }
};

// Middleware for single file upload
export const uploadSingle = (fieldName: string) => upload.single(fieldName);

// Middleware for multiple files upload
export const uploadMultiple = (fieldName: string, maxCount: number) => upload.array(fieldName, maxCount);

// Middleware for multiple fields upload
export const uploadFields = (fields: { name: string; maxCount: number }[]) => upload.fields(fields); 
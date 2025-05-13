import type { IUser } from '../../models/User';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      flash(type: string, message?: string): string[];
      file?: Express.Multer.File;
      files?: { [fieldname: string]: Express.Multer.File[] } | Express.Multer.File[];
    }
  }
} 
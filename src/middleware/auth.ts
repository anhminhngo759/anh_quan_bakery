import type { NextFunction } from 'express';
import type { Request, Response } from 'express-serve-static-core';
import type { RequestHandler } from 'express-serve-static-core';
import jwt from 'jsonwebtoken';
import type { Secret, SignOptions, JwtPayload } from 'jsonwebtoken';
import type { IUser } from '../models/User';
import { User } from '../models/User';
import { Category } from '../models/Category';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    returnTo?: string;
  }
}

declare module 'express' {
  interface Request {
    user?: IUser;
  }
}

export const isAuthenticated: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.session.userId) {
      // Save the URL they were trying to access
      req.session.returnTo = req.originalUrl;
      return res.redirect('/auth/dang-nhap');
    }

    const user = await User.findById(req.session.userId);
    if (!user) {
      req.session.returnTo = req.originalUrl;
      return res.redirect('/auth/dang-nhap');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const isAdmin: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log('isAdmin middleware');
    if (!req.session.userId) {
      console.log('middleware');
      req.session.returnTo = req.originalUrl;
      return res.redirect('/auth/dang-nhap');
    }

    const user = await User.findById(req.session.userId);
    console.log('middleware', user);

    if (!user || user.role !== 'admin') {
      console.log('Access denied for user:', user?.email, 'Role:', user?.role);
      return res.redirect('/');
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Admin middleware error:', error);
    res.redirect('/');
  }
};

// Middleware để thêm user vào res.locals cho views
export const addUserToLocals: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (req.session.userId) {
      const user = await User.findById(req.session.userId);
      res.locals.user = user;
    } else {
      res.locals.user = null;
    }
    next();
  } catch (error) {
    console.error('Add user to locals error:', error);
    next(error);
  }
};

// Middleware để thêm danh mục sản phẩm vào res.locals cho header
export const addCategoriesToLocals: RequestHandler = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const categories = await Category.findAll();
    res.locals.categories = categories;
    next();
  } catch (error) {
    console.error('Add categories to locals error:', error);
    next(error);
  }
};

// Middleware để thêm giỏ hàng vào res.locals cho header
export const addCartCountToLocals: RequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const cartCount = req.session.cartCount || 0;
    res.locals.cartCount = cartCount;
    next();
  } catch (error) {
    console.error('Add cart count to locals error:', error);
    next(error);
  }
};

export const generateToken = (userId: number): string => {
  const secret = process.env.JWT_SECRET || 'your-secret-key';
  const options = { expiresIn: process.env.JWT_EXPIRES_IN || '24h' } as SignOptions;
  return jwt.sign({ id: userId }, secret as Secret, options);
}; 
import type { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus extends Error {
  status?: number;
}

export const errorHandler = (
  err: ErrorWithStatus,
  req: Request,
  res: Response,
): void => {
  const status = err.status || 500;
  const message = err.message || 'Something went wrong!';

  // Log error
  console.error(`[${new Date().toISOString()}] Error:`, {
    status,
    message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Send error response
  res.status(status).json({
    error: {
      message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    },
  });
};

export class AppError extends Error {
  constructor(message: string, public status = 500) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export const catchAsync = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void> | void) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}; 
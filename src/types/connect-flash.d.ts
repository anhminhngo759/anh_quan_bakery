declare module 'connect-flash' {
  import type { Request, Response, NextFunction } from 'express';

  interface FlashOptions {
    [key: string]: unknown;
  }

  interface Flash {
    (type: string, message: string): void;
    (type: string, message: string[]): void;
    (options: FlashOptions): void;
  }

  interface FlashMessage {
    type: string;
    message: string;
  }

  interface FlashMessages {
    [key: string]: FlashMessage[];
  }

  interface RequestWithFlash extends Request {
    flash(type: string, message: string): void;
    flash(type: string, message: string[]): void;
    flash(options: FlashOptions): void;
    flash(): FlashMessages;
  }

  interface ResponseWithFlash extends Response {
    flash(type: string, message: string): void;
    flash(type: string, message: string[]): void;
    flash(options: FlashOptions): void;
  }

  function flash(): (req: RequestWithFlash, res: ResponseWithFlash, next: NextFunction) => void;

  export = flash;
}

import type { Request, Response, RequestHandler } from 'express';
import { AppError } from '../middleware/errorHandler';
import { catchAsync } from '../middleware/errorHandler';
import type { IUser } from '../models/User';
import orderService from '../services/orderService';

export const getAllOrders = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('User not found', 404);
  }
  const userId = (req.user as IUser).id;
  const isAdmin = (req.user as IUser).role === 'admin';

  const orders = await orderService.getAllOrders(userId, isAdmin);

  res.json({
    data: { orders }
  });
});

export const getOrderById = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('User not found', 404);
  }
  const orderId = Number.parseInt(req.params.id, 10);
  const userId = (req.user as IUser).id;
  const isAdmin = (req.user as IUser).role === 'admin';

  const { order, items } = await orderService.getOrderById(orderId, userId, isAdmin);

  res.json({
    data: {
      order,
      items
    }
  });
});

export const createOrder = catchAsync(async (req: Request, res: Response) => {
  if (!req.user) {
    throw new AppError('User not found', 404);
  }
  const userId = (req.user as IUser).id;
  const { shipping_address, phone, payment_method, notes } = req.body;

  const { order, items } = await orderService.createOrder(userId, {
    shipping_address, 
    phone, 
    payment_method, 
    notes
  });

  res.status(201).json({
    message: 'Order created successfully',
    data: {
      order,
      items
    }
  });
});

export const updateOrderStatus = catchAsync(async (req: Request, res, next) => {
  try {
    const orderId = Number.parseInt(req.params.id, 10);
    const { status } = req.body;
    
    const result = await orderService.updateOrderStatus(orderId, status);
    
    if (!result.success) {
      // Return error with details about insufficient stock
      res.status(400).json({ 
        success: false,
        message: result.message,
        insufficientStock: result.insufficientStock
      });
      return;
    }

    res.json({ 
      success: true,
      message: result.message
    });
  } catch (error) {
    next(error);
  }
});

export const getOrderSummary = catchAsync(async (req: Request, res: Response) => {
  const startDate = req.query.start_date ? new Date(req.query.start_date as string) : new Date(0);
  const endDate = req.query.end_date ? new Date(req.query.end_date as string) : new Date();
  const summary = await orderService.getOrderSummary(startDate, endDate);
  res.json({ data: { summary } });
});

export const orderController = {
  getAllOrders: (async (req, res) => {
    if (!req.user) {
      return res.redirect('/auth/dang-nhap');
    }
    const userId = (req.user as IUser).id;
    const isAdmin = (req.user as IUser).role === 'admin';
    
    const orders = await orderService.getAllOrders(userId, isAdmin);
    res.json({ data: { orders } });
  }) as RequestHandler,

  getOrderById: (async (req, res) => {
    if (!req.user) {
      return res.redirect('/auth/dang-nhap');
    }
    const orderId = Number.parseInt(req.params.id, 10);
    const userId = (req.user as IUser).id;
    const isAdmin = (req.user as IUser).role === 'admin';

    try {
      const { order, items } = await orderService.getOrderById(orderId, userId, isAdmin);
      res.json({
        data: {
          order,
          items
        }
      });
    } catch (error) {
      if (error instanceof AppError && error.status === 404) {
        return res.status(404).json({ error: 'Order not found' });
      }
      throw error;
    }
  }) as RequestHandler,

  createOrder: (async (req, res) => {
    if (!req.user) {
      return res.redirect('/auth/dang-nhap');
    }
    const userId = (req.user as IUser).id;
    const { shipping_address, phone, payment_method, notes } = req.body;

    try {
      const { order, items } = await orderService.createOrder(userId, {
        shipping_address, 
        phone, 
        payment_method, 
        notes
      });
    
      res.status(201).json({
        message: 'Order created successfully',
        data: {
          order,
          items
        }
      });
    } catch (error) {
      if (error instanceof AppError) {
        return res.status(error.status).json({ error: error.message });
      }
      throw error;
    }
  }) as RequestHandler,

  updateOrderStatus: (async (req, res, next) => {
    try {
      const orderId = Number.parseInt(req.params.id, 10);
      const { status } = req.body;
      
      const result = await orderService.updateOrderStatus(orderId, status);
      
      if (!result.success) {
        // Return error with details about insufficient stock
        res.status(400).json({ 
          success: false,
          message: result.message,
          insufficientStock: result.insufficientStock
        });
        return;
      }

      res.json({ 
        success: true,
        message: result.message
      });
    } catch (error) {
      next(error);
    }
  }) as RequestHandler,

  getOrderSummary: (async (req, res) => {
    const startDate = req.query.start_date ? new Date(req.query.start_date as string) : new Date(0);
    const endDate = req.query.end_date ? new Date(req.query.end_date as string) : new Date();
    const summary = await orderService.getOrderSummary(startDate, endDate);
    res.json({ data: { summary } });
  }) as RequestHandler,

  getOrderDetails: (async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect('/auth/dang-nhap');
      }

      const orderId = Number.parseInt(req.params.id, 10);
      const userId = (req.user as IUser).id;
      const isAdmin = (req.user as IUser).role === 'admin';

      try {
        const { order, items } = await orderService.getOrderById(orderId, userId, isAdmin);
        
        const orderWithItems = {
          ...order,
          items
        };

        res.render('pages/order-details', {
          title: `Đơn hàng #${orderId}`,
          order: orderWithItems
        });
      } catch (error) {
        if (error instanceof AppError) {
          if (error.status === 404) {
            return res.status(404).render('error', {
              title: 'Lỗi',
              message: 'Không tìm thấy đơn hàng'
            });
          }
          
          if (error.status === 403) {
            return res.status(403).render('error', {
              title: 'Lỗi',
              message: 'Bạn không có quyền truy cập đơn hàng này'
            });
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Error in getOrderDetails:', error);
      res.status(500).render('error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải thông tin đơn hàng'
      });
    }
  }) as RequestHandler,

  printOrder: (async (req, res) => {
    try {
      if (!req.user) {
        return res.redirect('/auth/dang-nhap');
      }

      const orderId = Number.parseInt(req.params.id, 10);
      const userId = (req.user as IUser).id;
      const isAdmin = (req.user as IUser).role === 'admin';

      try {
        const { order, items } = await orderService.getOrderById(orderId, userId, isAdmin);
        
        const orderWithItems = {
          ...order,
          items
        };

        res.render('pages/admin/orders/print', {
          title: `In đơn hàng #${orderId}`,
          order: orderWithItems,
          layout: false
        });
      } catch (error) {
        if (error instanceof AppError) {
          if (error.status === 404) {
            return res.status(404).render('error', {
              title: 'Lỗi',
              message: 'Không tìm thấy đơn hàng'
            });
          }
          
          if (error.status === 403) {
            return res.status(403).render('error', {
              title: 'Lỗi',
              message: 'Bạn không có quyền truy cập đơn hàng này'
            });
          }
        }
        throw error;
      }
    } catch (error) {
      console.error('Error in printOrder:', error);
      res.status(500).render('error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải thông tin đơn hàng'
      });
    }
  }) as RequestHandler
};
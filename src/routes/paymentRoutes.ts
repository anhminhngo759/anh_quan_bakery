import express from 'express';
import { isAuthenticated } from '../middleware/auth';
// @ts-ignore - Suppress the declaration file error
import * as momoController from '../controllers/momoController';
import type { Request, Response } from 'express';

const router = express.Router();

// MoMo payment routes
// @ts-ignore - Suppress type compatibility errors
router.post('/momo/create', isAuthenticated, momoController.createMomoPayment);

// Handle MoMo return URLs - both GET and POST
console.log('Registering MoMo return URL handlers');
// @ts-ignore - Suppress type compatibility errors
router.get('/momo/return', 
// @ts-ignore - TypeScript user compatibility issue
(req: Request, res: Response) => {
  console.log('MoMo GET return handler called');
  // @ts-ignore - TypeScript user compatibility issue
  return momoController.handleReturnUrl(req, res);
});
// @ts-ignore - Suppress type compatibility errors
router.post('/momo/return', 
// @ts-ignore - TypeScript user compatibility issue
(req: Request, res: Response) => {
  console.log('MoMo POST return handler called');
  // @ts-ignore - TypeScript user compatibility issue
  return momoController.handleReturnUrl(req, res);
});

// Direct success URL for MoMo payments
// @ts-ignore - Suppress type compatibility errors
// router.get('/momo/success/:orderId', (req: Request, res: Response) => {
//   console.log('=== MOMO SUCCESS ROUTE CALLED ===');
//   console.log('Order ID:', req.params.orderId);
//   console.log('Full URL:', req.originalUrl);
//   console.log('Will redirect to:', `/gio-hang/order-confirmation/${req.params.orderId}`);
  
//   // Force the redirect to be absolute
//   return res.redirect(302, `/gio-hang/order-confirmation/${req.params.orderId}`);
// });

// Payment failure page
// @ts-ignore - Suppress type compatibility errors
router.get('/failed', async (req: Request, res: Response) => {
  try {
    console.log('=== PAYMENT FAILED ROUTE CALLED ===');
    console.log('Query params:', req.query);
    
    const orderId = req.query.orderId ? Number(req.query.orderId) : undefined;
    const message = req.query.message as string || 'Thanh toán không thành công';

    let order = null;
    if (orderId) {
      // Import Order model
      const { Order } = require('../models/Order');
      try {
        order = await Order.findById(orderId);
      } catch (error) {
        console.error('Error finding order:', error);
      }
    }
    
    return res.render('pages/payment-failed', {
      title: 'Thanh toán thất bại',
      message,
      order
    });
  } catch (error) {
    console.error('Error in payment failed route:', error);
    return res.render('pages/error', {
      title: 'Lỗi',
      message: 'Đã xảy ra lỗi không mong muốn'
    });
  }
});

// @ts-ignore - Suppress type compatibility errors
router.post('/momo/ipn', momoController.handleIpn);
// @ts-ignore - Suppress type compatibility errors
router.post('/momo/query', isAuthenticated, momoController.queryPaymentStatus);

export default router; 
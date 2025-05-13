import type { Request, Response, RequestHandler } from 'express';
import { Cart } from '../models/Cart';
import { Order } from '../models/Order';
import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';
import { catchAsync } from '../middleware/errorHandler';

interface CheckoutRequest {
  shipping_address: string;
  phone: string;
  payment_method: string;
  notes?: string;
}

export const checkoutController = {
  // Hiển thị trang thanh toán
  showCheckout: (async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/auth/dang-nhap');
      }

      const cartItems = await Cart.getItems(req.session.userId);
      
      if (cartItems.length === 0) {
        return res.redirect('/gio-hang?error=empty');
      }
      
      // Lấy thông tin sản phẩm trong giỏ hàng
      const products = [];
      let totalAmount = 0;
      
      for (const item of cartItems) {
        const product = await Product.findById(item.product_id);
        if (product) {
          products.push({
            ...product,
            quantity: item.quantity,
            total: product.price * item.quantity
          });
          totalAmount += product.price * item.quantity;
        }
      }
      
      // Check if we're retrying a failed payment
      let retryOrder = null;
      if (req.query.retry && req.session.userId) {
        const orderId = Number(req.query.retry);
        // Get the order to verify it belongs to the user
        const order = await Order.findById(orderId);
        
        if (order && order.user_id === req.session.userId) {
          retryOrder = order;
        }
      }
      
      res.render('pages/checkout', {
        title: 'Thanh toán',
        cartItems: products,
        totalAmount,
        retryOrder
      });
    } catch (error) {
      console.error('Error in showCheckout:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải trang thanh toán'
      });
    }
  }) as RequestHandler,

  // Xử lý thanh toán
  processCheckout: (async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ 
          message: 'Vui lòng đăng nhập để thanh toán' 
        });
      }

      const userId = req.session.userId;
      const { shipping_address, phone, payment_method, notes } = req.body as CheckoutRequest;

      // Validate required fields
      if (!shipping_address || !phone || !payment_method) {
        return res.status(400).json({ 
          message: 'Vui lòng điền đầy đủ thông tin thanh toán' 
        });
      }

      // Lấy thông tin giỏ hàng
      const cartItems = await Cart.getItems(userId);
      if (cartItems.length === 0) {
        return res.status(400).json({ 
          message: 'Giỏ hàng trống' 
        });
      }

      // Kiểm tra tồn kho và tính tổng tiền
      let totalAmount = 0;
      for (const item of cartItems) {
        const product = await Product.findById(item.product_id);
        if (!product) {
          return res.status(404).json({ 
            message: `Sản phẩm ${item.name} không tồn tại` 
          });
        }

        if (product.stock_quantity < item.quantity) {
          return res.status(400).json({ 
            message: `Sản phẩm ${product.name} không đủ số lượng trong kho` 
          });
        }

        totalAmount += product.price * item.quantity;
      }

      // Tạo đơn hàng
      const orderId = await Order.create({
        user_id: userId,
        items: cartItems.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price
        })),
        shipping_address,
        phone,
        payment_method,
        notes
      });

      // Xóa giỏ hàng
      await Cart.clear(userId);

      res.status(201).json({ 
        message: 'Đặt hàng thành công',
        orderId,
        totalAmount
      });
    } catch (error) {
      console.error('Error in processCheckout:', error);
      res.status(500).json({ 
        message: 'Đã xảy ra lỗi khi xử lý thanh toán' 
      });
    }
  }) as RequestHandler,

  // Hiển thị trang xác nhận đơn hàng
  showOrderConfirmation: (async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/auth/dang-nhap');
      }

      const orderId = Number.parseInt(req.params.orderId, 10);
      const order = await Order.findById(orderId);

      if (!order) {
        return res.status(404).render('pages/error', {
          title: 'Lỗi',
          message: 'Không tìm thấy đơn hàng'
        });
      }

      // Kiểm tra quyền truy cập
      if (order.user_id !== req.session.userId) {
        return res.status(403).render('pages/error', {
          title: 'Lỗi',
          message: 'Bạn không có quyền truy cập đơn hàng này'
        });
      }

      // Lấy chi tiết đơn hàng
      const orderItems = await Order.getOrderItems(orderId);
      const orderWithItems = {
        ...order,
        items: orderItems
      };

      res.render('pages/order-confirmation', {
        title: 'Xác nhận đơn hàng',
        order: orderWithItems
      });
    } catch (error) {
      console.error('Error in showOrderConfirmation:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải trang xác nhận đơn hàng'
      });
    }
  }) as RequestHandler
}; 
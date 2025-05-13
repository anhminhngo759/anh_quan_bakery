import type { Request, Response, RequestHandler } from 'express';
import { AppError } from '../middleware/errorHandler';
import cartService from '../services/cartService';

interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  name?: string;
}

interface OrderData {
  user_id: number;
  items: CartItem[];
  shipping_address: string;
  phone: string;
  payment_method: string;
  notes?: string;
}

interface OrderResponse {
  id: number;
  user_id: number;
  status: string;
  total_amount: number;
  created_at: Date;
}

export const cartController = {
  getCart: (async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/auth/dang-nhap');
      }

      const cartItems = await cartService.getItems(req.session.userId);
      const { totalItems, totalAmount } = await cartService.getSummary(req.session.userId);
      
      res.render('pages/cart', {
        title: 'Giỏ hàng',
        cartItems,
        totalItems,
        totalAmount
      });
    } catch (error) {
      console.error('Error in getCart:', error);
      res.status(500).render('pages/cart', {
        title: 'Giỏ hàng',
        error: 'Đã xảy ra lỗi khi tải giỏ hàng',
        cartItems: [],
        totalItems: 0,
        totalAmount: 0
      });
    }
  }) as RequestHandler,

  addToCart: (async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ 
          message: 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng' 
        });
      }

      const userId = req.session.userId;
      const productId = Number.parseInt(req.params.productId, 10);
      const { quantity } = req.body;

      try {
        await cartService.addItem(userId, productId, quantity);
        
        res.status(200).json({ 
          message: 'Đã thêm sản phẩm vào giỏ hàng',
          success: true 
        });
      } catch (error) {
        if (error instanceof AppError) {
          return res.status(error.status).json({ message: error.message });
        }
        throw error;
      }
    } catch (error) {
      console.error('Add to cart error:', error);
      res.status(500).json({ 
        message: 'Đã xảy ra lỗi khi thêm vào giỏ hàng' 
      });
    }
  }) as RequestHandler,

  updateCartItem: (async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ 
          message: 'Vui lòng đăng nhập để cập nhật giỏ hàng' 
        });
      }

      const userId = req.session.userId;
      const productId = Number.parseInt(req.params.productId, 10);
      const { quantity } = req.body;

      try {
        const { totalItems, totalAmount } = await cartService.updateQuantity(userId, productId, quantity);
        
        res.json({ 
          message: 'Cập nhật giỏ hàng thành công',
          totalItems,
          totalAmount
        });
      } catch (error) {
        if (error instanceof AppError) {
          return res.status(error.status).json({ message: error.message });
        }
        throw error;
      }
    } catch (error) {
      console.error('Update cart error:', error);
      res.status(500).json({ 
        message: 'Đã xảy ra lỗi khi cập nhật giỏ hàng' 
      });
    }
  }) as RequestHandler,

  removeFromCart: (async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ 
          message: 'Vui lòng đăng nhập để xóa sản phẩm' 
        });
      }

      const userId = req.session.userId;
      const productId = Number.parseInt(req.params.productId, 10);
      
      const { totalItems, totalAmount } = await cartService.removeItem(userId, productId);

      res.json({ 
        message: 'Xóa sản phẩm khỏi giỏ hàng thành công',
        totalItems,
        totalAmount
      });
    } catch (error) {
      console.error('Remove from cart error:', error);
      res.status(500).json({ 
        message: 'Đã xảy ra lỗi khi xóa sản phẩm' 
      });
    }
  }) as RequestHandler,

  clearCart: (async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ 
          message: 'Vui lòng đăng nhập để xóa giỏ hàng' 
        });
      }

      const userId = req.session.userId;
      await cartService.clear(userId);
      
      res.json({ 
        message: 'Xóa giỏ hàng thành công',
        totalItems: 0,
        totalAmount: 0
      });
    } catch (error) {
      console.error('Clear cart error:', error);
      res.status(500).json({ 
        message: 'Đã xảy ra lỗi khi xóa giỏ hàng' 
      });
    }
  }) as RequestHandler
}; 
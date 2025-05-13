import type { Request, Response, RequestHandler } from 'express';
import { User } from '../models/User';
import type { IUser } from '../models/User';
import { Order } from '../models/Order';
import bcrypt from 'bcryptjs';
import { AppError } from '../middleware/errorHandler';

export const accountController = {
  // Hiển thị trang thông tin tài khoản
  showProfile: (async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/auth/dang-nhap');
      }

      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.redirect('/auth/dang-nhap');
      }

      res.render('pages/account', {
        title: 'Tài khoản',
        user
      });
    } catch (error) {
      console.error('Error in showProfile:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải trang tài khoản'
      });
    }
  }) as RequestHandler,

  // Cập nhật thông tin cá nhân
  updateProfile: (async (req, res) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          message: 'Vui lòng đăng nhập để cập nhật thông tin' 
        });
      }

      const { full_name, email, phone, address } = req.body;
      const user = req.user as IUser;

      // Validate required fields
      if (!full_name || !email) {
        return res.status(400).json({ 
          message: 'Vui lòng điền đầy đủ thông tin bắt buộc' 
        });
      }

      // Check if email is already taken by another user
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== user.id) {
        return res.status(400).json({ 
          message: 'Email đã được sử dụng' 
        });
      }

      // Update user profile
      await User.update(user.id, {
        full_name,
        email,
        phone,
        address
      });

      res.json({ 
        message: 'Cập nhật thông tin thành công' 
      });
    } catch (error) {
      console.error('Error in updateProfile:', error);
      res.status(500).json({ 
        message: 'Đã xảy ra lỗi khi cập nhật thông tin' 
      });
    }
  }) as RequestHandler,

  // Hiển thị trang đổi mật khẩu
  showChangePassword: (async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/auth/dang-nhap');
      }

      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.redirect('/auth/dang-nhap');
      }

      res.render('pages/change-password', {
        title: 'Đổi mật khẩu',
        user
      });
    } catch (error) {
      console.error('Error in showChangePassword:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải trang đổi mật khẩu'
      });
    }
  }) as RequestHandler,

  // Xử lý đổi mật khẩu
  changePassword: (async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.status(401).json({ 
          message: 'Vui lòng đăng nhập để đổi mật khẩu' 
        });
      }

      const { currentPassword, newPassword } = req.body;

      // Validate input
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ 
          message: 'Vui lòng điền đầy đủ thông tin' 
        });
      }

      // Get user
      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.status(404).json({ 
          message: 'Không tìm thấy người dùng' 
        });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ 
          message: 'Mật khẩu hiện tại không chính xác' 
        });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      await User.changePassword(req.session.userId, hashedPassword);

      res.json({ 
        message: 'Đổi mật khẩu thành công' 
      });
    } catch (error) {
      console.error('Error in changePassword:', error);
      res.status(500).json({ 
        message: 'Đã xảy ra lỗi khi đổi mật khẩu' 
      });
    }
  }) as RequestHandler,

  // Hiển thị lịch sử đơn hàng
  showOrderHistory: (async (req, res) => {
    try {
      if (!req.session.userId) {
        return res.redirect('/auth/dang-nhap');
      }

      const user = await User.findById(req.session.userId);
      if (!user) {
        return res.redirect('/auth/dang-nhap');
      }

      const orders = await Order.findByUserId(req.session.userId);
      
      // Get order items for each order
      const ordersWithItems = await Promise.all(
        orders.map(async (order) => {
          const items = await Order.getOrderItems(order.id);
          return {
            ...order,
            items
          };
        })
      );

      res.render('pages/order-history', {
        title: 'Đơn hàng của tôi',
        user,
        orders: ordersWithItems
      });
    } catch (error) {
      console.error('Error in showOrderHistory:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải lịch sử đơn hàng'
      });
    }
  }) as RequestHandler
}; 
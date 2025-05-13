import express from 'express';
import { accountController } from '../controllers/accountController';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Tất cả các routes đều yêu cầu đăng nhập
router.use(isAuthenticated);

// Thông tin tài khoản
router.get('/', accountController.showProfile);
router.put('/cap-nhat', accountController.updateProfile);

// Đổi mật khẩu
router.get('/doi-mat-khau', accountController.showChangePassword);
router.put('/doi-mat-khau', accountController.changePassword);

// Lịch sử đơn hàng
router.get('/don-hang', accountController.showOrderHistory);

export default router; 
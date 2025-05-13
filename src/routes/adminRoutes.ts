import express from 'express';
import { isAuthenticated, isAdmin } from '../middleware/auth';
import { productController } from '../controllers/productController';
import { categoryController } from '../controllers/categoryController';
import { orderController } from '../controllers/orderController';
import { adminController } from '../controllers/adminController';
import { newsController } from '../controllers/newsController';
import { uploadSingle } from '../middleware/upload';

const router = express.Router();

// All admin routes require authentication and admin role
// Tạm thời bỏ các middleware xác thực để phát triển UI
// router.use(isAuthenticated);
// router.use(isAdmin);

// Dashboard
router.get('/', adminController.dashboard);

// Quản lý người dùng
router.get('/users', adminController.listUsers);
router.get('/users/:id', adminController.showUser);
router.get('/users/:id/edit', adminController.editUser);
router.post('/users/:id', adminController.updateUser);

// Quản lý sản phẩm
router.get('/products', adminController.listProducts);
router.get('/products/new', adminController.newProduct);
router.post('/products', uploadSingle('image'), adminController.createProduct);
router.get('/products/:id/edit', adminController.editProduct);
router.post('/products/:id', uploadSingle('image'), adminController.updateProduct);
router.delete('/products/:id', adminController.deleteProduct);

// Quản lý danh mục
router.get('/categories', adminController.listCategories);
router.get('/categories/new', adminController.newCategory);
router.post('/categories', adminController.createCategory);
router.get('/categories/:id/edit', adminController.editCategory);
router.post('/categories/:id', adminController.updateCategory);
router.delete('/categories/:id', adminController.deleteCategory);

// Quản lý đơn hàng
router.get('/orders', adminController.listOrders);
router.get('/orders/:id', adminController.showOrder);
router.get('/orders/:id/print', adminController.printOrder);
router.post('/orders/:id/status', express.json(), adminController.updateOrderStatus);

// Quản lý tin tức
router.get('/news', newsController.listNews);
router.get('/news/new', newsController.newNews);
router.post('/news', uploadSingle('image'), newsController.createNews);
router.get('/news/edit/:id', newsController.editNews);
router.post('/news/edit/:id', uploadSingle('image'), newsController.updateNews);
router.post('/news/delete/:id', newsController.deleteNews);

// Thống kê
router.get('/statistics', adminController.statistics);

export default router; 
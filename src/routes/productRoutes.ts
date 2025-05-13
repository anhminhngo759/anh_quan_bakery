import express from 'express';
import { productController } from '../controllers/productController';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', productController.renderProductsPage);
router.get('/api', productController.getAllProducts);
router.get('/:id', productController.renderProductDetailPage);

// Protected routes (admin only)
router.post('/', isAuthenticated, productController.createProduct);
router.put('/:id', isAuthenticated, productController.updateProduct);
router.delete('/:id', isAuthenticated, productController.deleteProduct);

export default router; 
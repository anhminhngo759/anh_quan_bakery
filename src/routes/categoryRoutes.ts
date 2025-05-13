import express from 'express';
import { categoryController } from '../controllers/categoryController';
import { isAdmin, isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/', categoryController.getAllCategories);
router.get('/:id', categoryController.renderCategoryPage);
router.get('/api/:id', categoryController.getCategoryById);

// Admin routes
router.post('/', isAuthenticated, isAdmin, categoryController.createCategory);
router.put('/:id', isAuthenticated, isAdmin, categoryController.updateCategory);
router.delete('/:id', isAuthenticated, isAdmin, categoryController.deleteCategory);

export default router; 
import express from 'express';
import { orderController } from '../controllers/orderController';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Protect all order routes
router.use(isAuthenticated);

// Order routes
router.get('/:id', orderController.getOrderDetails);
router.get('/:id/print', orderController.printOrder);

export default router; 
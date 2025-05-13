import express from 'express';
import { cartController } from '../controllers/cartController';
import { checkoutController } from '../controllers/checkoutController';
import { isAuthenticated } from '../middleware/auth';

const router = express.Router();

// Public cart routes
router.get('/', cartController.getCart);
router.post('/items/:productId', cartController.addToCart);
router.put('/items/:productId', cartController.updateCartItem);
router.delete('/items/:productId', cartController.removeFromCart);
router.delete('/', cartController.clearCart);

// Protected checkout routes
router.get('/checkout', isAuthenticated, checkoutController.showCheckout);
router.post('/checkout', isAuthenticated, checkoutController.processCheckout);
router.get('/order-confirmation/:orderId', isAuthenticated, checkoutController.showOrderConfirmation);

export default router; 
import { Router } from 'express';
import { indexController } from '../controllers/indexController';
import { isAuthenticated } from '../middleware/auth';

const router = Router();

// Public routes
router.get('/', indexController.home);

// Protected routes
router.get('/dashboard', isAuthenticated, (req, res) => {
  res.render('dashboard', { user: req.user });
});

export default router; 
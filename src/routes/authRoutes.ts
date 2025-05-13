import express from 'express';
import { authController } from '../controllers/authController';
import { isAuthenticated } from '../middleware/auth';
import passport from 'passport';

const router = express.Router();

// Public routes
router.get('/dang-nhap', authController.showLogin);
router.get('/dang-ky', authController.showRegister);
router.post('/dang-nhap', authController.login);
router.post('/dang-ky', authController.register);
router.get('/dang-xuat', authController.logout);

// Protected routes
router.get('/me', isAuthenticated, authController.getCurrentUser);
router.put('/profile', isAuthenticated, authController.updateProfile);
router.put('/change-password', isAuthenticated, authController.changePassword);

// Social media routes
router.get('/google', authController.googleAuth);
router.get('/google/callback', authController.googleCallback);

export default router; 
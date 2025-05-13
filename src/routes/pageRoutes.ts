import express from 'express';
import { pageController } from '../controllers/pageController';

const router = express.Router();

// Main pages
router.get('/gioi-thieu', pageController.about);
router.get('/lien-he', pageController.contact);
router.post('/lien-he', pageController.contactSubmit);
router.get('/cua-hang', pageController.stores);

export default router; 
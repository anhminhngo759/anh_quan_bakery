import express from 'express';
import { searchController } from '../controllers/searchController';

const router = express.Router();

// Tìm kiếm sản phẩm
router.get('/', searchController.search);

export default router; 
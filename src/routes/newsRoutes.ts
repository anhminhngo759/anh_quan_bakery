   // newsRoutes.ts
   import express from 'express';
   import { newsController } from '../controllers/newsController';
   import { upload } from '../middleware/upload';
   import { isAuthenticated, isAdmin } from '../middleware/auth';

   const router = express.Router();

   // Public routes
   router.get('/', newsController.getAllNews);
   router.get('/id/:id', newsController.getNewsById);
   router.get('/:slug', newsController.getNewsBySlug);

   // Admin routes
   router.get('/admin/news', isAuthenticated, isAdmin, newsController.listNews);
   router.get('/admin/news/new', isAuthenticated, isAdmin, newsController.newNews);
   router.post('/admin/news', isAuthenticated, isAdmin, upload.single('image'), newsController.createNews);
   router.get('/admin/news/edit/:id', isAuthenticated, isAdmin, newsController.editNews);
   router.post('/admin/news/edit/:id', isAuthenticated, isAdmin, upload.single('image'), newsController.updateNews);
   router.post('/admin/news/delete/:id', isAuthenticated, isAdmin, newsController.deleteNews);

   export default router;
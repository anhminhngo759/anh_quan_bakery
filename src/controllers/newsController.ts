import type { RequestHandler } from 'express';
import { News } from '../models/News';
import { processImage } from '../middleware/upload';

export const newsController = {
  // Get all news
  getAllNews: (async (req, res) => {
    try {
      const page = req.query.page ? Number.parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : 10;

      const newsItems = await News.findAll({
        page,
        limit,
        is_published: true,
        orderBy: 'published_at DESC'
      });
      
      const totalNews = await News.countAll({ is_published: true });
      const totalPages = Math.ceil(totalNews / limit);
      
      res.render('pages/news', { 
        title: 'Tin tức & Sự kiện',
        newsItems,
        pagination: {
          page,
          limit,
          totalPages,
          totalNews
        }
      });
    } catch (error) {
      console.error('Error in getAllNews:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải tin tức',
        error: { status: 500 }
      });
    }
  }) as RequestHandler,
  
  // Get news by ID
  getNewsById: (async (req, res) => {
    try {
      const newsId = Number.parseInt(req.params.id, 10);
      const newsItem = await News.findById(newsId);
      
      if (!newsItem || !newsItem.is_published) {
        return res.status(404).render('pages/error', {
          title: 'Không tìm thấy bài viết',
          message: 'Bài viết bạn đang tìm kiếm không tồn tại.',
          error: { status: 404 }
        });
      }
      
      // Get related news items
      const relatedNews = await News.findRelated(newsId, 3);
      
      res.render('pages/news-detail', {
        title: newsItem.title,
        newsItem,
        relatedNews
      });
    } catch (error) {
      console.error('Error in getNewsById:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải chi tiết tin tức',
        error: { status: 500 }
      });
    }
  }) as RequestHandler,
  
  // Get news by slug
  getNewsBySlug: (async (req, res) => {
    try {
      const slug = req.params.slug;
      const newsItem = await News.findBySlug(slug);
      
      if (!newsItem || !newsItem.is_published) {
        return res.status(404).render('pages/error', {
          title: 'Không tìm thấy bài viết',
          message: 'Bài viết bạn đang tìm kiếm không tồn tại.',
          error: { status: 404 }
        });
      }
      
      // Get related news items
      const relatedNews = await News.findRelated(newsItem.id, 3);
      
      res.render('pages/news-detail', {
        title: newsItem.title,
        newsItem,
        relatedNews
      });
    } catch (error) {
      console.error('Error in getNewsBySlug:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải chi tiết tin tức',
        error: { status: 500 }
      });
    }
  }) as RequestHandler,
  
  // ADMIN CONTROLLERS
  
  // List all news (admin)
  listNews: (async (req, res) => {
    try {
      const page = req.query.page ? Number.parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search as string || '';
      
      const newsItems = await News.findAll({
        page,
        limit,
        search,
        orderBy: 'created_at DESC'
      });
      
      const totalNews = await News.countAll({ search });
      const totalPages = Math.ceil(totalNews / limit);
      
      res.render('pages/admin/news/index', {
        title: 'Quản lý tin tức',
        newsItems,
        pagination: {
          page,
          limit,
          totalPages,
          totalNews,
          search
        }
      });
    } catch (error) {
      console.error('Error in listNews:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải danh sách tin tức'
      });
    }
  }) as RequestHandler,
  
  // Show news form (admin)
  newNews: ((req, res) => {
    res.render('pages/admin/news/new', {
      title: 'Thêm tin tức mới'
    });
  }) as RequestHandler,
  
  // Create news (admin)
  createNews: (async (req, res) => {
    try {
      const { title, summary, content, is_published } = req.body;
      const user = req.user as { id: number }; // Current logged-in user from session
      
      let imagePath = null;
      if (req.file) {
        const processed = await processImage(req.file);
        if (processed) {
          imagePath = processed.original;
        }
      }
      
      const newsData = {
        title,
        summary,
        content,
        image: imagePath,
        author_id: user.id,
        is_published: is_published === 'true'
      };
      
      await News.create(newsData);
      
      res.redirect('/admin/news');
    } catch (error) {
      console.error('Error in createNews:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tạo tin tức mới'
      });
    }
  }) as RequestHandler,
  
  // Edit news form (admin)
  editNews: (async (req, res) => {
    try {
      const newsId = Number.parseInt(req.params.id, 10);
      const newsItem = await News.findById(newsId);
      
      if (!newsItem) {
        return res.status(404).render('pages/error', {
          title: 'Lỗi',
          message: 'Không tìm thấy tin tức'
        });
      }
      
      res.render('pages/admin/news/edit', {
        title: `Chỉnh sửa tin tức: ${newsItem.title}`,
        newsItem
      });
    } catch (error) {
      console.error('Error in editNews:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải thông tin tin tức'
      });
    }
  }) as RequestHandler,
  
  // Update news (admin)
  updateNews: (async (req, res) => {
    try {
      const newsId = Number.parseInt(req.params.id, 10);
      const { title, summary, content, is_published } = req.body;
      
      const updateData: {
        title: string;
        summary: string;
        content: string;
        is_published: boolean;
        image?: string;
      } = {
        title,
        summary,
        content,
        is_published: is_published === 'true'
      };
      
      if (req.file) {
        const processed = await processImage(req.file);
        if (processed) {
          updateData.image = processed.original;
        }
      }
      
      await News.update(newsId, updateData);
      
      res.redirect('/admin/news');
    } catch (error) {
      console.error('Error in updateNews:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi cập nhật tin tức'
      });
    }
  }) as RequestHandler,
  
  // Delete news (admin)
  deleteNews: (async (req, res) => {
    try {
      const newsId = Number.parseInt(req.params.id, 10);
      
      await News.delete(newsId);
      
      res.redirect('/admin/news');
    } catch (error) {
      console.error('Error in deleteNews:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi xóa tin tức'
      });
    }
  }) as RequestHandler
}; 
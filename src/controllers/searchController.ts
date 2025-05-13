import type { Request, Response, RequestHandler } from 'express';
import { Product } from '../models/Product';

export const searchController = {
  // Hiển thị kết quả tìm kiếm
  search: (async (req, res) => {
    try {
      const query = req.query.q as string;
      
      if (!query) {
        return res.redirect('/');
      }

      const products = await Product.findAll({ search: query });

      res.render('pages/search', {
        title: 'Tìm kiếm',
        query,
        products
      });
    } catch (error) {
      console.error('Error in search:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tìm kiếm sản phẩm'
      });
    }
  }) as RequestHandler
}; 
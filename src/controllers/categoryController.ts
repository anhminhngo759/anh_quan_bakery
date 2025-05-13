import type { Request, Response, RequestHandler } from 'express';
import { AppError } from '../middleware/errorHandler';
import { catchAsync } from '../middleware/errorHandler';
import categoryService from '../services/categoryService';
import { Category } from '../models/Category';

export const getAllCategories = catchAsync(async (_: Request, res: Response) => {
  const categories = await categoryService.getAllCategories();

  res.json({
    data: { categories }
  });
});

export const getCategoryById = catchAsync(async (req: Request, res: Response) => {
  const categoryId = Number.parseInt(req.params.id, 10);
  const { category, productCount } = await categoryService.getCategoryById(categoryId);

  res.json({
    data: {
      category,
      product_count: productCount
    }
  });
});

export const createCategory = catchAsync(async (req: Request, res: Response) => {
  const { name, description } = req.body;

  const category = await categoryService.createCategory({
    name,
    description
  });

  res.status(201).json({
    message: 'Category created successfully',
    data: { category }
  });
});

export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = Number.parseInt(req.params.id, 10);
  const { name, description } = req.body;

  const category = await categoryService.updateCategory(categoryId, {
    name,
    description
  });

  res.json({
    message: 'Category updated successfully',
    data: { category }
  });
});

export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const categoryId = Number.parseInt(req.params.id, 10);

  await categoryService.deleteCategory(categoryId);

  res.json({
    message: 'Category deleted successfully'
  });
});

export const renderCategoryPage = catchAsync(async (req: Request, res: Response) => {
  const categoryId = Number.parseInt(req.params.id, 10);
  const page = Number.parseInt(req.query.page as string, 10) || 1;
  const limit = Number.parseInt(req.query.limit as string, 10) || 12;

  const { category, products, pagination } = await categoryService.getCategoryWithProducts(categoryId, page, limit);
  
  // Get all categories for the slider
  const categories = await Category.findAll();

  res.render('pages/category', {
    title: category.name,
    category,
    categories,
    products,
    pagination
  });
});

export const categoryController = {
  getAllCategories: (async (req, res) => {
    try {
      const categories = await categoryService.getAllCategories();

      res.json({
        data: { categories }
      });
    } catch (error) {
      console.error('Error in getAllCategories:', error);
      res.status(500).json({
        error: 'Failed to fetch categories'
      });
    }
  }) as RequestHandler,
  
  getCategoryById: (async (req, res) => {
    try {
      const categoryId = Number.parseInt(req.params.id, 10);
      const { category, productCount } = await categoryService.getCategoryById(categoryId);

      res.json({
        data: {
          category,
          product_count: productCount
        }
      });
    } catch (error) {
      console.error('Error in getCategoryById:', error);
      if (error instanceof AppError) {
        return res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Failed to fetch category'
      });
    }
  }) as RequestHandler,
  
  createCategory: (async (req, res) => {
    try {
      const { name, description } = req.body;

      const category = await categoryService.createCategory({
        name,
        description
      });

      res.status(201).json({
        message: 'Category created successfully',
        data: { category }
      });
    } catch (error) {
      console.error('Error in createCategory:', error);
      if (error instanceof AppError) {
        return res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Failed to create category'
      });
    }
  }) as RequestHandler,
  
  updateCategory: (async (req, res) => {
    try {
      const categoryId = Number.parseInt(req.params.id, 10);
      const { name, description } = req.body;

      const category = await categoryService.updateCategory(categoryId, {
        name,
        description
      });

      res.json({
        message: 'Category updated successfully',
        data: { category }
      });
    } catch (error) {
      console.error('Error in updateCategory:', error);
      if (error instanceof AppError) {
        return res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Failed to update category'
      });
    }
  }) as RequestHandler,
  
  deleteCategory: (async (req, res) => {
    try {
      const categoryId = Number.parseInt(req.params.id, 10);

      await categoryService.deleteCategory(categoryId);

      res.json({
        message: 'Category deleted successfully'
      });
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      if (error instanceof AppError) {
        return res.status(error.status).json({ error: error.message });
      }
      res.status(500).json({
        error: 'Failed to delete category'
      });
    }
  }) as RequestHandler,
  
  renderCategoryPage: (async (req, res) => {
    try {
      const categoryId = Number.parseInt(req.params.id, 10);
      const page = Number.parseInt(req.query.page as string, 10) || 1;
      const limit = Number.parseInt(req.query.limit as string, 10) || 12;

      const { category, products, pagination } = await categoryService.getCategoryWithProducts(categoryId, page, limit);
      
      // Get all categories for the slider
      const categories = await Category.findAll();

      res.render('pages/category', {
        title: category.name,
        category,
        categories,
        products,
        pagination
      });
    } catch (error) {
      console.error('Error in renderCategoryPage:', error);
      if (error instanceof AppError && error.status === 404) {
        return res.status(404).render('error', {
          title: 'Lỗi',
          message: 'Không tìm thấy danh mục sản phẩm'
        });
      }
      res.status(500).render('error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải trang danh mục'
      });
    }
  }) as RequestHandler
}; 
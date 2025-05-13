import type { Request, Response, RequestHandler } from 'express';
import { AppError } from '../middleware/errorHandler';
import { catchAsync } from '../middleware/errorHandler';
import { uploadSingle } from '../middleware/upload';
import productService from '../services/productService';
import { Category } from '../models/Category';

// Middleware for handling product image upload
export const uploadProductImage = uploadSingle('image');

// Render products page
const renderProductsPage: RequestHandler = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = 12;
    const search = req.query.search as string;
    const category_id = Number(req.query.category_id) || undefined;

    const { items: products, total, total_pages } = await productService.getProducts({
      category_id,
      search,
      page,
      limit
    });

    const categories = await Category.findAll();
    
    res.render('pages/products', {
      title: 'Sản phẩm',
      products,
      categories,
      pagination: {
        page,
        limit,
        total,
        total_pages
      },
      selectedCategory: category_id,
      search
    });
  } catch (error) {
    console.error('Error in renderProductsPage:', error);
    res.status(500).render('error', {
      title: 'Lỗi',
      message: 'Đã xảy ra lỗi khi tải trang sản phẩm'
    });
  }
};

const getAllProducts: RequestHandler = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 12;
    const search = req.query.search as string;
    const category_id = Number(req.query.category_id) || undefined;

    const { items: products, page: currentPage, limit: itemsPerPage, total, total_pages } = 
      await productService.getProducts({
        category_id,
        search,
        page,
        limit
      });

    res.json({
      data: {
        products,
        pagination: {
          page: currentPage,
          limit: itemsPerPage,
          total,
          total_pages
        }
      }
    });
  } catch (error) {
    console.error('Error in getAllProducts:', error);
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi tải danh sách sản phẩm' 
    });
  }
};

const getProductById = catchAsync(async (req: Request, res: Response) => {
  const productId = Number.parseInt(req.params.id, 10);
  
  const { product, similarProducts } = await productService.getProductById(productId);

  res.json({
    data: {
      product,
      similar_products: similarProducts
    }
  });
});

const createProduct: RequestHandler = async (req, res) => {
  try {
    const { name, category_id, description, price, stock_quantity } = req.body;
    const image = req.file;
    
    if (!image) {
      return res.status(400).json({ 
        error: 'Image is required' 
      });
    }

    const product = await productService.createProduct({
      name,
      category_id: Number(category_id),
      description,
      price: Number(price),
      stock_quantity: Number(stock_quantity),
      image_url: `/uploads/${image.filename}`,
      is_available: true
    });

    res.status(201).json({
      message: 'Product created successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Error in createProduct:', error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi tạo sản phẩm' 
    });
  }
};

const updateProduct: RequestHandler = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const { name, category_id, description, price, stock_quantity, is_available } = req.body;
    const image = req.file;

    // Explicitly type the updateData object
    const updateData: {
      name?: string;
      description?: string;
      category_id?: number;
      price?: number;
      stock_quantity?: number;
      image_url?: string;
      is_available?: boolean;
    } = {
      name,
      description,
      is_available: is_available === 'true'
    };

    if (category_id) updateData.category_id = Number(category_id);
    if (price) updateData.price = Number(price);
    if (stock_quantity) updateData.stock_quantity = Number(stock_quantity);
    if (image) updateData.image_url = `/uploads/${image.filename}`;

    const product = await productService.updateProduct(productId, updateData);

    res.json({
      message: 'Product updated successfully',
      data: { product }
    });
  } catch (error) {
    console.error('Error in updateProduct:', error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi cập nhật sản phẩm' 
    });
  }
};

const deleteProduct: RequestHandler = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    await productService.deleteProduct(productId);
    
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Error in deleteProduct:', error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi xóa sản phẩm' 
    });
  }
};

const updateStock: RequestHandler = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    const { quantity } = req.body;

    await productService.updateStock(productId, Number(quantity));
    
    res.json({ message: 'Stock updated successfully' });
  } catch (error) {
    console.error('Error in updateStock:', error);
    if (error instanceof AppError) {
      return res.status(error.status).json({ error: error.message });
    }
    res.status(500).json({ 
      error: 'Đã xảy ra lỗi khi cập nhật tồn kho' 
    });
  }
};

const renderProductDetailPage: RequestHandler = async (req, res) => {
  try {
    const productId = Number(req.params.id);
    
    const { product, category, relatedProducts } = await productService.getProductDetails(productId);
    const categories = await Category.findAll();

    res.render('pages/product-detail', {
      title: product.name,
      categories,
      product,
      category,
      relatedProducts
    });
  } catch (error) {
    console.error('Error in renderProductDetailPage:', error);
    if (error instanceof AppError && error.status === 404) {
      return res.status(404).render('error', { 
        title: 'Lỗi',
        message: 'Không tìm thấy sản phẩm' 
      });
    }
    res.status(500).render('error', {
      title: 'Lỗi',
      message: 'Đã xảy ra lỗi khi tải trang chi tiết sản phẩm'
    });
  }
};

export const productController = {
  renderProductsPage,
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  updateStock,
  uploadProductImage,
  renderProductDetailPage
}; 
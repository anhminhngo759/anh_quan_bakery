import { Product } from '../models/Product';
import type { IProduct, TopSellingProduct } from '../models/Product';
import { Category } from '../models/Category';
import type { ICategory } from '../models/Category';
import { AppError } from '../middleware/errorHandler';

// Types
interface ProductQueryOptions {
  category_id?: number;
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
}

interface PaginationResult {
  items: IProduct[];
  page: number;
  limit: number;
  total: number;
  total_pages: number;
}

interface ProductUpdateData {
  name?: string;
  category_id?: number;
  description?: string;
  price?: number;
  stock_quantity?: number;
  image_url?: string;
  thumbnail_url?: string;
  is_available?: boolean;
}

interface ProductCreateData {
  name: string;
  category_id: number;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  thumbnail_url?: string;
  is_available: boolean;
}

interface ProductService {
  getProducts(options: ProductQueryOptions): Promise<PaginationResult>;
  getProductById(id: number): Promise<{ 
    product: IProduct; 
    similarProducts: IProduct[] 
  }>;
  createProduct(data: ProductCreateData): Promise<IProduct>;
  updateProduct(id: number, data: ProductUpdateData): Promise<IProduct>;
  deleteProduct(id: number): Promise<boolean>;
  updateStock(id: number, quantity: number): Promise<boolean>;
  getProductDetails(id: number): Promise<{
    product: IProduct;
    category: ICategory;
    relatedProducts: IProduct[];
  }>;
  countAll(options?: { search?: string; category_id?: number }): Promise<number>;
  findByCategoryId(categoryId: number): Promise<IProduct[]>;
  getTopSellingProducts(limit: number): Promise<TopSellingProduct[]>;
  getLowStockProducts(limit: number): Promise<IProduct[]>;
}

const productService: ProductService = {
  /**
   * Get products with pagination and filtering
   */
  async getProducts(options: ProductQueryOptions): Promise<PaginationResult> {
    const {
      category_id,
      search,
      page = 1,
      limit = 10,
      orderBy = 'created_at DESC'
    } = options;

    const products = await Product.findAll({
      category_id,
      search,
      page,
      limit,
      orderBy
    });

    // Count total for pagination
    const total = await Product.countAll({ search, category_id });

    return {
      items: products as unknown as IProduct[],
      page,
      limit,
      total,
      total_pages: Math.ceil(total / limit)
    };
  },

  /**
   * Get product by ID with similar products
   */
  async getProductById(id: number): Promise<{ 
    product: IProduct; 
    similarProducts: IProduct[] 
  }> {
    const product = await Product.findById(id);

    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const similarProducts = await Product.findSimilar(id);

    return {
      product: product as unknown as IProduct,
      similarProducts: similarProducts as unknown as IProduct[]
    };
  },

  /**
   * Create a new product
   */
  async createProduct(data: ProductCreateData): Promise<IProduct> {
    const productId = await Product.create({
      name: data.name,
      category_id: data.category_id,
      description: data.description,
      price: data.price,
      stock_quantity: data.stock_quantity,
      image_url: data.image_url,
      thumbnail_url: data.thumbnail_url || data.image_url,
      is_available: data.is_available
    });

    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Failed to create product', 500);
    }

    return product as unknown as IProduct;
  },

  /**
   * Update a product
   */
  async updateProduct(id: number, data: ProductUpdateData): Promise<IProduct> {
    if (data.thumbnail_url === undefined && data.image_url) {
      data.thumbnail_url = data.image_url;
    }

    const success = await Product.update(id, data);
    if (!success) {
      throw new AppError('Product not found', 404);
    }

    const product = await Product.findById(id);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    return product as unknown as IProduct;
  },

  /**
   * Delete a product
   */
  async deleteProduct(id: number): Promise<boolean> {
    const success = await Product.delete(id);
    if (!success) {
      throw new AppError('Product not found', 404);
    }

    return true;
  },

  /**
   * Update product stock quantity
   */
  async updateStock(id: number, quantity: number): Promise<boolean> {
    if (quantity < 0) {
      throw new AppError('Stock quantity cannot be negative', 400);
    }

    const success = await Product.updateStock(id, quantity);
    if (!success) {
      throw new AppError('Product not found', 404);
    }

    return true;
  },

  /**
   * Get product details with category and related products
   */
  async getProductDetails(id: number): Promise<{
    product: IProduct;
    category: ICategory;
    relatedProducts: IProduct[];
  }> {
    const product = await Product.findById(id);
    
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    const category = await Category.findById(product.category_id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }
    
    const relatedProducts = await Product.findSimilar(id);

    return {
      product: product as unknown as IProduct,
      category: category as unknown as ICategory,
      relatedProducts: relatedProducts as unknown as IProduct[]
    };
  },

  /**
   * Count all products with optional filters
   */
  async countAll(options?: { search?: string; category_id?: number }): Promise<number> {
    return await Product.countAll(options || {});
  },

  /**
   * Find products by category ID
   */
  async findByCategoryId(categoryId: number): Promise<IProduct[]> {
    const products = await Product.findByCategoryId(categoryId);
    return products;
  },

  /**
   * Get top selling products
   */
  async getTopSellingProducts(limit: number): Promise<TopSellingProduct[]> {
    return await Product.getTopSellingProducts(limit);
  },

  /**
   * Get products with low stock
   */
  async getLowStockProducts(limit: number): Promise<IProduct[]> {
    const products = await Product.getLowStockProducts(limit);
    return products;
  }
};

export default productService; 
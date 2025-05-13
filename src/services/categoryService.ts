import { Category } from '../models/Category';
import type { ICategory } from '../models/Category';
import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';

interface CategoryService {
  getAllCategories(): Promise<ICategory[]>;
  getCategoryById(id: number): Promise<{ 
    category: ICategory; 
    productCount: number 
  }>;
  createCategory(data: { name: string; description: string }): Promise<ICategory>;
  updateCategory(id: number, data: { name: string; description: string }): Promise<ICategory>;
  deleteCategory(id: number): Promise<boolean>;
  getCategoryWithProducts(categoryId: number, page: number, limit: number): Promise<{
    category: ICategory;
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    }
  }>;
}

const categoryService: CategoryService = {
  /**
   * Get all categories
   */
  async getAllCategories(): Promise<ICategory[]> {
    const categories = await Category.findAll();
    return categories as unknown as ICategory[];
  },

  /**
   * Get category by ID with product count
   */
  async getCategoryById(id: number): Promise<{ 
    category: ICategory; 
    productCount: number 
  }> {
    const category = await Category.findById(id);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const productCount = await Category.getProductCount(id);

    return {
      category: category as unknown as ICategory,
      productCount
    };
  },

  /**
   * Create a new category
   */
  async createCategory(data: { name: string; description: string }): Promise<ICategory> {
    // Check if category with same name already exists
    const existingCategory = await Category.findByName(data.name);
    if (existingCategory) {
      throw new AppError('Category with this name already exists', 400);
    }

    const categoryId = await Category.create(data);
    
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new AppError('Failed to create category', 500);
    }

    return category as unknown as ICategory;
  },

  /**
   * Update a category
   */
  async updateCategory(id: number, data: { name: string; description: string }): Promise<ICategory> {
    // Check if name is already taken by another category
    const existingCategory = await Category.findByName(data.name);
    if (existingCategory && existingCategory.id !== id) {
      throw new AppError('Category with this name already exists', 400);
    }

    const success = await Category.update(id, data);
    
    if (!success) {
      throw new AppError('Category not found', 404);
    }

    const category = await Category.findById(id);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    return category as unknown as ICategory;
  },

  /**
   * Delete a category
   */
  async deleteCategory(id: number): Promise<boolean> {
    // Check if category has products
    const productCount = await Category.getProductCount(id);
    if (productCount > 0) {
      throw new AppError('Cannot delete category with existing products', 400);
    }

    const success = await Category.removeById(id);
    
    if (!success) {
      throw new AppError('Category not found', 404);
    }

    return true;
  },

  /**
   * Get category with products for rendering category page
   */
  async getCategoryWithProducts(categoryId: number, page: number, limit: number): Promise<{
    category: ICategory;
    products: Product[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      total_pages: number;
    }
  }> {
    // Get current category
    const category = await Category.findById(categoryId);
    if (!category) {
      throw new AppError('Category not found', 404);
    }

    // Get products in this category
    const products = await Product.findAll({
      category_id: categoryId,
      page,
      limit
    });

    // Get total count for pagination
    const total = await Product.countByCategoryId(categoryId);

    return {
      category: category as unknown as ICategory,
      products,
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit)
      }
    };
  }
};

export default categoryService; 
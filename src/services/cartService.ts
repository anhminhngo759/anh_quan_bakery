import { Cart } from '../models/Cart';
import { Product } from '../models/Product';
import { AppError } from '../middleware/errorHandler';

interface CartItem {
  product_id: number;
  quantity: number;
  price: number;
  name?: string;
  image_url?: string;
}

interface CartSummary {
  totalItems: number;
  totalAmount: number;
}

interface CartService {
  getItems(userId: number): Promise<CartItem[]>;
  getSummary(userId: number): Promise<CartSummary>;
  addItem(userId: number, productId: number, quantity: number): Promise<void>;
  updateQuantity(userId: number, productId: number, quantity: number): Promise<CartSummary>;
  removeItem(userId: number, productId: number): Promise<CartSummary>;
  clear(userId: number): Promise<void>;
}

const cartService: CartService = {
  /**
   * Get all items in the cart
   */
  async getItems(userId: number): Promise<CartItem[]> {
    return await Cart.getItems(userId);
  },

  /**
   * Get cart summary with total items and amount
   */
  async getSummary(userId: number): Promise<CartSummary> {
    return await Cart.getSummary(userId);
  },

  /**
   * Add an item to the cart with validation
   */
  async addItem(userId: number, productId: number, quantity: number): Promise<void> {
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if product is available
    if (!product.is_available) {
      throw new AppError('Product is not available', 400);
    }

    // Check if product is in stock
    if (product.stock_quantity <= 0) {
      throw new AppError('Product out of stock', 400);
    }

    // Check if requested quantity is available
    if (quantity > product.stock_quantity) {
      throw new AppError(`Only ${product.stock_quantity} items available in stock`, 400);
    }

    // Add to cart
    await Cart.addItem(userId, productId, quantity);
  },

  /**
   * Update item quantity in cart
   */
  async updateQuantity(userId: number, productId: number, quantity: number): Promise<CartSummary> {
    if (quantity < 1) {
      throw new AppError('Quantity must be greater than 0', 400);
    }

    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError('Product not found', 404);
    }

    // Check if product is available
    if (!product.is_available) {
      throw new AppError('Product is not available', 400);
    }

    // Check if product is in stock
    if (product.stock_quantity <= 0) {
      throw new AppError('Product out of stock', 400);
    }

    // Check if requested quantity is available
    if (quantity > product.stock_quantity) {
      throw new AppError(`Only ${product.stock_quantity} items available in stock`, 400);
    }

    // Update cart
    await Cart.updateQuantity(userId, productId, quantity);
    
    // Return updated summary
    return await Cart.getSummary(userId);
  },

  /**
   * Remove an item from cart
   */
  async removeItem(userId: number, productId: number): Promise<CartSummary> {
    await Cart.removeItem(userId, productId);
    return await Cart.getSummary(userId);
  },

  /**
   * Clear all items from cart
   */
  async clear(userId: number): Promise<void> {
    await Cart.clear(userId);
  }
};

export default cartService; 
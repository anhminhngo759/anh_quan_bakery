import { Order } from '../models/Order';
import type { IOrder, IOrderItem, IOrderWithUser } from '../models/Order';
import { Product } from '../models/Product';
import { Cart } from '../models/Cart';
import { AppError } from '../middleware/errorHandler';

interface OrderSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  ordersByStatus: Record<IOrder['status'], number>;
}

interface OrderService {
  getAllOrders(userId: number, isAdmin: boolean): Promise<IOrder[]>;
  getOrderById(orderId: number, userId: number, isAdmin: boolean): Promise<{order: IOrder, items: IOrderItem[]}>;
  createOrder(userId: number, orderData: {
    shipping_address: string,
    phone: string,
    payment_method: string,
    notes?: string
  }): Promise<{order: IOrder, items: IOrderItem[]}>;
  updateOrderStatus(orderId: number, status: IOrder['status']): Promise<{
    success: boolean;
    message?: string;
    insufficientStock?: Array<{
      productName: string;
      available: number;
      required: number;
    }>;
  }>;
  getOrderSummary(startDate: Date, endDate: Date): Promise<OrderSummary>;
  getRecentOrders(limit: number): Promise<IOrderWithUser[]>;
  getOrderStats(startDate: Date, endDate: Date): Promise<Record<string, number>>;
  getRevenueByDay(startDate: Date, endDate: Date): Promise<{date: string; revenue: number}[]>;
}

const orderService: OrderService = {
  /**
   * Get all orders, filtered by user ID if not admin
   */
  async getAllOrders(userId: number, isAdmin: boolean): Promise<IOrder[]> {
    return isAdmin ? await Order.findAll() : await Order.findByUserId(userId);
  },

  /**
   * Get order by ID with access control
   */
  async getOrderById(orderId: number, userId: number, isAdmin: boolean): Promise<{order: IOrder, items: IOrderItem[]}> {
    const order = await Order.findById(orderId);

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    // Check if user has access to this order
    if (!isAdmin && order.user_id !== userId) {
      throw new AppError('Unauthorized', 403);
    }

    const items = await Order.getOrderItems(orderId);

    return {
      order,
      items
    };
  },

  /**
   * Create a new order
   */
  async createOrder(userId: number, orderData: {
    shipping_address: string,
    phone: string,
    payment_method: string,
    notes?: string
  }): Promise<{order: IOrder, items: IOrderItem[]}> {
    const { shipping_address, phone, payment_method, notes } = orderData;
    
    // Get cart items
    const cartItems = await Cart.getItems(userId);
    if (cartItems.length === 0) {
      throw new AppError('Cart is empty', 400);
    }

    // Check stock availability and prepare order items
    const orderItems = await Promise.all(
      cartItems.map(async (item) => {
        const product = await Product.findById(item.product_id);
        if (!product) {
          throw new AppError(`Product ${item.product_id} not found`, 404);
        }

        if (!product.is_available) {
          throw new AppError(`Product ${product.name} is not available`, 400);
        }

        if (product.stock_quantity < item.quantity) {
          throw new AppError(`Not enough stock for ${product.name}`, 400);
        }

        return {
          product_id: item.product_id,
          quantity: item.quantity,
          price: product.price
        };
      })
    );

    // Create order
    const orderId = await Order.create({
      user_id: userId,
      items: orderItems,
      shipping_address,
      phone,
      payment_method,
      notes
    });

    // Clear cart
    await Cart.clear(userId);

    const order = await Order.findById(orderId);
    if (!order) {
      throw new AppError('Failed to create order', 500);
    }
    
    const items = await Order.getOrderItems(orderId);

    return {
      order,
      items
    };
  },

  /**
   * Update order status with stock validation
   */
  async updateOrderStatus(orderId: number, status: IOrder['status']): Promise<{
    success: boolean;
    message?: string;
    insufficientStock?: Array<{
      productName: string;
      available: number;
      required: number;
    }>;
  }> {
    const result = await Order.updateStatus(orderId, status);
    
    // Check if we got an error about insufficient stock
    if (result !== false && typeof result === 'object' && 'success' in result && result.success === false) {
      return {
        success: false,
        message: 'Không đủ số lượng tồn kho để xác nhận đơn hàng',
        insufficientStock: result.insufficientStock
      };
    }
    
    if (result === false) {
      throw new AppError('Order not found', 404);
    }

    return {
      success: true,
      message: 'Order status updated successfully'
    };
  },

  /**
   * Get order summary statistics for date range
   */
  async getOrderSummary(startDate: Date, endDate: Date): Promise<OrderSummary> {
    return await Order.getOrderSummary(startDate, endDate);
  },
  
  /**
   * Get recent orders with user information
   */
  async getRecentOrders(limit: number): Promise<IOrderWithUser[]> {
    return await Order.findRecent(limit);
  },
  
  /**
   * Get order statistics for dashboard
   */
  async getOrderStats(startDate: Date, endDate: Date): Promise<Record<string, number>> {
    return await Order.getOrderStats(startDate, endDate);
  },
  
  /**
   * Get revenue by day for date range
   */
  async getRevenueByDay(startDate: Date, endDate: Date): Promise<{date: string; revenue: number}[]> {
    return await Order.getRevenueByDay(startDate, endDate);
  }
};

export default orderService; 
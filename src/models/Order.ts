import type { RowDataPacket, ResultSetHeader } from 'mysql2';
import pool from '../config/database';

export interface IOrder extends RowDataPacket {
  id: number;
  user_id: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled';
  shipping_address: string;
  phone: string;
  payment_method: string;
  payment_status?: string;
  payment_date?: Date;
  transaction_id?: string;
  status_note?: string;
  total_amount: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IOrderItem extends RowDataPacket {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
  created_at: Date;
  product_name?: string;
  image_url?: string;
  category_name?: string;
}

export interface IOrderCreate {
  user_id: number;
  items: Array<{
    product_id: number;
    quantity: number;
    price: number;
  }>;
  shipping_address: string;
  phone: string;
  payment_method: string;
  notes?: string;
}

export interface IOrderWithUser extends IOrder {
  user_name?: string;
}

export class Order {
  id: number;
  user_id: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'canceled';
  shipping_address: string;
  phone: string;
  payment_method: string;
  total_amount: number;
  notes?: string;
  created_at: Date;
  updated_at: Date;

  constructor(data: Partial<IOrder>) {
    this.id = data.id || 0;
    this.user_id = data.user_id || 0;
    this.status = data.status || 'pending';
    this.shipping_address = data.shipping_address || '';
    this.phone = data.phone || '';
    this.payment_method = data.payment_method || '';
    this.total_amount = data.total_amount || 0;
    this.notes = data.notes;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  static async findById(id: number): Promise<IOrder | null> {
    try {
      const [rows] = await pool.execute<IOrder[]>(
        'SELECT * FROM orders WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding order by ID:', error);
      throw error;
    }
  }

  static async findByUserId(userId: number): Promise<IOrder[]> {
    try {
      const [rows] = await pool.execute<IOrder[]>(
        'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
        [userId]
      );
      return rows;
    } catch (error) {
      console.error('Error finding orders by user ID:', error);
      throw error;
    }
  }

  static async findAll(): Promise<IOrder[]> {
    try {
      const [rows] = await pool.execute<IOrder[]>(
        'SELECT * FROM orders ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error finding all orders:', error);
      throw error;
    }
  }

  static async create(orderData: IOrderCreate): Promise<number> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();

      // Calculate total amount
      const totalAmount = orderData.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

      // Create order
      const [orderResult] = await connection.execute<ResultSetHeader>(
        'INSERT INTO orders (user_id, shipping_address, phone, payment_method, notes, total_amount) VALUES (?, ?, ?, ?, ?, ?)',
        [
          orderData.user_id,
          orderData.shipping_address,
          orderData.phone,
          orderData.payment_method,
          orderData.notes || null,
          totalAmount
        ]
      );
      const orderId = orderResult.insertId;

      // Create order items
      for (const item of orderData.items) {
        await connection.execute(
          'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
          [orderId, item.product_id, item.quantity, item.price]
        );

        // Stock will be updated when the order is confirmed, not when it's created
      }

      await connection.commit();
      return orderId;
    } catch (error) {
      await connection.rollback();
      console.error('Error creating order:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async updateStatus(id: number, status: IOrder['status']): Promise<boolean | { success: false, insufficientStock: { productName: string, available: number, required: number }[] }> {
    const connection = await pool.getConnection();
    try {
      await connection.beginTransaction();
      
      // Check if order exists and get previous status
      const [orders] = await connection.execute<IOrder[]>(
        'SELECT * FROM orders WHERE id = ?',
        [id]
      );
      
      if (orders.length === 0) {
        return false;
      }
      
      const oldStatus = orders[0].status;
      
      // If changing from pending to confirmed, check stock availability first
      if (status === 'confirmed' && oldStatus === 'pending') {
        // Get order items
        const [items] = await connection.execute<IOrderItem[]>(
          'SELECT oi.*, p.name as product_name, p.stock_quantity as available_stock FROM order_items oi JOIN products p ON oi.product_id = p.id WHERE oi.order_id = ?',
          [id]
        );
        
        // Check if there's enough stock for all items
        const insufficientStock = [];
        
        for (const item of items) {
          // Check current stock
          const [productRows] = await connection.execute<RowDataPacket[]>(
            'SELECT name, stock_quantity FROM products WHERE id = ?',
            [item.product_id]
          );
          
          const currentStock = productRows[0].stock_quantity;
          
          if (currentStock < item.quantity) {
            insufficientStock.push({
              productName: productRows[0].name,
              available: currentStock,
              required: item.quantity
            });
          }
        }
        
        if (insufficientStock.length > 0) {
          await connection.rollback();
          return { 
            success: false, 
            insufficientStock 
          };
        }
      }
      
      // Update order status
      const [result] = await connection.execute<ResultSetHeader>(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );
      
      // If order status is changed to 'confirmed' and it was previously 'pending',
      // update the product stock
      if (status === 'confirmed' && oldStatus === 'pending') {
        // Get order items
        const [items] = await connection.execute<IOrderItem[]>(
          'SELECT * FROM order_items WHERE order_id = ?',
          [id]
        );
        
        // Update product stock
        for (const item of items) {
          await connection.execute(
            'UPDATE products SET stock_quantity = stock_quantity - ? WHERE id = ?',
            [item.quantity, item.product_id]
          );
        }
      }

      // If order status is changed to 'canceled' and it was previously 'confirmed' or 'shipped',
      // restore the product stock
      if (status === 'canceled' && (oldStatus === 'confirmed' || oldStatus === 'shipped')) {
        // Get order items
        const [items] = await connection.execute<IOrderItem[]>(
          'SELECT * FROM order_items WHERE order_id = ?',
          [id]
        );
        
        // Restore product stock
        for (const item of items) {
          await connection.execute(
            'UPDATE products SET stock_quantity = stock_quantity + ? WHERE id = ?',
            [item.quantity, item.product_id]
          );
        }
      }

      await connection.commit();
      return result.affectedRows > 0;
    } catch (error) {
      await connection.rollback();
      console.error('Error updating order status:', error);
      throw error;
    } finally {
      connection.release();
    }
  }

  static async update(data: Partial<IOrder>, id: number): Promise<boolean> {
    try {
      // Create SET clause for SQL query
      const keys = Object.keys(data);
      const setClause = keys.map(key => `${key} = ?`).join(', ');
      const values = keys.map(key => data[key as keyof Partial<IOrder>]);
      
      // Add ID to values array
      values.push(id);
      
      // Execute update query
      const [result] = await pool.execute<ResultSetHeader>(
        `UPDATE orders SET ${setClause}, updated_at = NOW() WHERE id = ?`,
        values
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      console.error('Error updating order:', error);
      throw error;
    }
  }

  static async getOrderItems(orderId: number): Promise<IOrderItem[]> {
    try {
      const [rows] = await pool.execute<IOrderItem[]>(
        `SELECT oi.*, p.name as product_name, p.image_url, c.name as category_name
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         LEFT JOIN categories c ON p.category_id = c.id
         WHERE oi.order_id = ?`,
        [orderId]
      );
      return rows;
    } catch (error) {
      console.error('Error getting order items:', error);
      throw error;
    }
  }

  static async getOrderSummary(startDate: Date, endDate: Date): Promise<{
    totalOrders: number;
    totalRevenue: number;
    averageOrderValue: number;
    ordersByStatus: Record<IOrder['status'], number>;
  }> {
    try {
      interface OrderTotals extends RowDataPacket {
        total_orders: number;
        total_revenue: number;
        average_order: number;
      }

      interface StatusCount extends RowDataPacket {
        status: IOrder['status'];
        count: number;
      }

      // Get total orders and revenue
      const [totals] = await pool.execute<OrderTotals[]>(
        `SELECT 
          COUNT(*) as total_orders,
          SUM(total_amount) as total_revenue,
          AVG(total_amount) as average_order
         FROM orders
         WHERE created_at BETWEEN ? AND ?`,
        [startDate, endDate]
      );

      // Get orders by status
      const [statusCounts] = await pool.execute<StatusCount[]>(
        `SELECT status, COUNT(*) as count
         FROM orders
         WHERE created_at BETWEEN ? AND ?
         GROUP BY status`,
        [startDate, endDate]
      );

      const ordersByStatus: Record<IOrder['status'], number> = {
        pending: 0,
        confirmed: 0,
        shipped: 0,
        delivered: 0,
        canceled: 0
      };

      for (const row of statusCounts) {
        ordersByStatus[row.status] = row.count;
      }

      return {
        totalOrders: totals[0].total_orders || 0,
        totalRevenue: totals[0].total_revenue || 0,
        averageOrderValue: totals[0].average_order || 0,
        ordersByStatus
      };
    } catch (error) {
      console.error('Error getting order summary:', error);
      throw error;
    }
  }

  static async countAll(): Promise<number> {
    try {
      const [result] = await pool.execute('SELECT COUNT(*) as count FROM orders');
      return (result as RowDataPacket[])[0].count;
    } catch (error) {
      console.error('Error counting orders:', error);
      throw error;
    }
  }

  static async calculateTotalRevenue(): Promise<number> {
    try {
      const [result] = await pool.execute(
        'SELECT SUM(total_amount) as revenue FROM orders WHERE status IN ("delivered", "shipped", "confirmed")'
      );
      return (result as RowDataPacket[])[0].revenue || 0;
    } catch (error) {
      console.error('Error calculating total revenue:', error);
      throw error;
    }
  }

  static async findRecent(limit: number): Promise<IOrderWithUser[]> {
    try {
      const limitNumber = Number(limit);
      const query = `SELECT o.*, u.full_name as user_name 
         FROM orders o 
         LEFT JOIN users u ON o.user_id = u.id 
         ORDER BY o.created_at DESC 
         LIMIT ${limitNumber}`;
      
      const [rows] = await pool.execute(query);
      return rows as IOrderWithUser[];
    } catch (error) {
      console.error('Error finding recent orders:', error);
      throw error;
    }
  }

  static async getOrderStats(startDate: Date, endDate: Date): Promise<Record<string, number>> {
    try {
      interface StatusCount extends RowDataPacket {
        status: string;
        count: number;
      }
      
      const [rows] = await pool.execute<StatusCount[]>(
        `SELECT status, COUNT(*) as count 
         FROM orders 
         WHERE created_at BETWEEN ? AND ? 
         GROUP BY status`, 
        [startDate, endDate]
      );
      
      // Convert to object with status as keys
      const result: Record<string, number> = {};
      for (const row of rows) {
        result[row.status] = row.count;
      }
      
      return result;
    } catch (error) {
      console.error('Error getting order stats:', error);
      throw error;
    }
  }
  
  static async getRevenueByDay(startDate: Date, endDate: Date): Promise<{date: string; revenue: number}[]> {
    try {
      interface DailyRevenue extends RowDataPacket {
        date: string;
        revenue: number;
      }
      
      const [rows] = await pool.execute<DailyRevenue[]>(
        `SELECT DATE(created_at) as date, SUM(total_amount) as revenue 
         FROM orders 
         WHERE status IN ('delivered') AND created_at BETWEEN ? AND ? 
         GROUP BY DATE(created_at) 
         ORDER BY date`, 
        [startDate, endDate]
      );
      return rows;
    } catch (error) {
      console.error('Error getting revenue by day:', error);
      throw error;
    }
  }
} 
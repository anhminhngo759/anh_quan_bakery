import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import pool from '../config/database';

export interface IProduct extends RowDataPacket {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string;
  thumbnail_url: string;
  stock_quantity: number;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface TopSellingProduct extends IProduct {
  sold_quantity: number;
  revenue: number;
}

interface FindAllOptions {
  category_id?: number;
  search?: string;
  page?: number;
  limit?: number;
  orderBy?: string;
}

interface CountOptions {
  search?: string;
  category_id?: number;
}

export class Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category_id: number;
  image_url: string;
  thumbnail_url: string;
  stock_quantity: number;
  is_available: boolean;
  created_at: Date;
  updated_at: Date;

  constructor(data: Partial<IProduct> = {}) {
    this.id = data.id || 0;
    this.name = data.name || '';
    this.description = data.description || '';
    this.price = data.price || 0;
    this.category_id = data.category_id || 0;
    this.image_url = data.image_url || '';
    this.thumbnail_url = data.thumbnail_url || '';
    this.stock_quantity = data.stock_quantity || 0;
    this.is_available = data.is_available ?? true;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  static async findAll(options: FindAllOptions = {}): Promise<Product[]> {
    const {
      category_id,
      search,
      page = 1,
      limit = 10,
      orderBy = 'created_at DESC'
    } = options;

    let query = 'SELECT * FROM products WHERE 1=1';
    const params: (string | number)[] = [];

    if (category_id) {
      query += ' AND category_id = ?';
      params.push(category_id);
    }

    if (search) {
      query += ' AND (name LIKE ? OR description LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    query += ` ORDER BY ${orderBy}`;
    query += ' LIMIT ? OFFSET ?';
    params.push(limit, (page - 1) * limit);

    const [rows] = await pool.query<IProduct[]>(query, params);
    console.log(rows);
    return rows.map(row => new Product(row));
  }

  static async findById(id: number): Promise<Product | null> {
    const [rows] = await pool.query<IProduct[]>('SELECT * FROM products WHERE id = ?', [id]);
    return rows.length ? new Product(rows[0]) : null;
  }

  static async create(data: Omit<IProduct, 'id' | 'created_at' | 'updated_at'>): Promise<number> {
    const [result] = await pool.query<ResultSetHeader>(
      'INSERT INTO products (name, description, price, category_id, image_url, thumbnail_url, stock_quantity, is_available) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [data.name, data.description, data.price, data.category_id, data.image_url, data.thumbnail_url || data.image_url, data.stock_quantity, data.is_available]
    );
    return result.insertId;
  }

  static async update(id: number, data: Partial<Omit<IProduct, 'id' | 'created_at' | 'updated_at'>>): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE products SET name = ?, description = ?, price = ?, category_id = ?, image_url = ?, thumbnail_url = ?, stock_quantity = ?, is_available = ? WHERE id = ?',
      [data.name, data.description, data.price, data.category_id, data.image_url, data.thumbnail_url || data.image_url, data.stock_quantity, data.is_available, id]
    );
    return result.affectedRows > 0;
  }

  static async delete(id: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>('DELETE FROM products WHERE id = ?', [id]);
    return result.affectedRows > 0;
  }

  static async updateStock(id: number, quantity: number): Promise<boolean> {
    const [result] = await pool.query<ResultSetHeader>(
      'UPDATE products SET stock_quantity = ? WHERE id = ?',
      [quantity, id]
    );
    return result.affectedRows > 0;
  }

  static async findSimilar(productId: number): Promise<Product[]> {
    const [rows] = await pool.query<IProduct[]>(
      'SELECT * FROM products WHERE id != ? AND category_id = (SELECT category_id FROM products WHERE id = ?) LIMIT 4',
      [productId, productId]
    );
    return rows.map(row => new Product(row));
  }

  static async countByCategoryId(categoryId: number): Promise<number> {
    const [rows] = await pool.query<RowDataPacket[]>(
      'SELECT COUNT(*) as count FROM products WHERE category_id = ?',
      [categoryId]
    );
    return rows[0].count;
  }

  static async countAll(options: CountOptions = {}): Promise<number> {
    try {
      const { search, category_id } = options;
      let query = 'SELECT COUNT(*) as count FROM products WHERE 1=1';
      const params: (string | number)[] = [];

      if (category_id) {
        query += ' AND category_id = ?';
        params.push(category_id);
      }

      if (search) {
        query += ' AND (name LIKE ? OR description LIKE ?)';
        params.push(`%${search}%`, `%${search}%`);
      }

      const [result] = await pool.query<RowDataPacket[]>(query, params);
      return result[0].count;
    } catch (error) {
      console.error('Error counting products:', error);
      throw error;
    }
  }

  static async findByCategoryId(categoryId: number): Promise<IProduct[]> {
    try {
      const [rows] = await pool.execute<IProduct[]>(
        'SELECT * FROM products WHERE category_id = ?',
        [categoryId]
      );
      return rows;
    } catch (error) {
      console.error('Error finding products by category:', error);
      throw error;
    }
  }
  
  static async getTopSellingProducts(limit: number): Promise<TopSellingProduct[]> {
    try {
      const [rows] = await pool.execute(
        `SELECT p.*, SUM(oi.quantity) as sold_quantity, SUM(oi.price * oi.quantity) as revenue
         FROM products p
         LEFT JOIN order_items oi ON p.id = oi.product_id
         INNER JOIN orders o ON oi.order_id = o.id AND o.status IN ('delivered', 'shipped', 'confirmed')
         GROUP BY p.id
         ORDER BY sold_quantity DESC
         LIMIT ${limit}`
      );
      return rows as TopSellingProduct[];
    } catch (error) {
      console.error('Error getting top selling products:', error);
      throw error;
    }
  }
  
  static async getLowStockProducts(limit: number): Promise<IProduct[]> {
    try {
      const [rows] = await pool.execute<IProduct[]>(
        `SELECT * FROM products WHERE is_available = true ORDER BY stock_quantity ASC LIMIT ${limit}`
      );
      return rows;
    } catch (error) {
      console.error('Error getting low stock products:', error);
      throw error;
    }
  }
} 
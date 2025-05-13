import db from '../config/database';
import type { RowDataPacket } from 'mysql2';

interface CartItemRow extends RowDataPacket {
  id: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at: Date;
  updated_at: Date;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
}

export interface CartItem {
  id?: number;
  user_id: number;
  product_id: number;
  quantity: number;
  created_at?: Date;
  updated_at?: Date;
  name: string;
  description: string;
  price: number;
  image_url: string;
  stock_quantity: number;
}

interface CartSummaryRow extends RowDataPacket {
  totalItems: number;
  totalAmount: number;
}

export namespace Cart {
  export async function getItems(userId: number): Promise<CartItem[]> {
    const [rows] = await db.query<CartItemRow[]>(
      `SELECT 
        ci.*,
        p.name,
        p.description,
        p.price,
        p.image_url,
        p.stock_quantity
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [userId]
    );

    return rows.map(row => ({
      ...row,
      price: Number(row.price),
      quantity: Number(row.quantity)
    }));
  }

  export async function addItem(userId: number, productId: number, quantity: number): Promise<void> {
    const [existing] = await db.query<CartItemRow[]>(
      'SELECT * FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );

    if (existing.length > 0) {
      await db.query(
        'UPDATE cart_items SET quantity = quantity + ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
    } else {
      await db.query(
        'INSERT INTO cart_items (user_id, product_id, quantity) VALUES (?, ?, ?)',
        [userId, productId, quantity]
      );
    }
  }

  export async function updateQuantity(userId: number, productId: number, quantity: number): Promise<void> {
    if (quantity <= 0) {
      await db.query(
        'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
        [userId, productId]
      );
    } else {
      await db.query(
        'UPDATE cart_items SET quantity = ? WHERE user_id = ? AND product_id = ?',
        [quantity, userId, productId]
      );
    }
  }

  export async function removeItem(userId: number, productId: number): Promise<void> {
    await db.query(
      'DELETE FROM cart_items WHERE user_id = ? AND product_id = ?',
      [userId, productId]
    );
  }

  export async function clear(userId: number): Promise<void> {
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
  }

  export async function getSummary(userId: number): Promise<{ totalItems: number; totalAmount: number }> {
    const [rows] = await db.query<CartSummaryRow[]>(
      `SELECT 
        COUNT(*) as totalItems, 
        COALESCE(SUM(ci.quantity * p.price), 0) as totalAmount
       FROM cart_items ci
       JOIN products p ON ci.product_id = p.id
       WHERE ci.user_id = ?`,
      [userId]
    );

    return {
      totalItems: Number(rows[0]?.totalItems) || 0,
      totalAmount: Number(rows[0]?.totalAmount) || 0
    };
  }
} 
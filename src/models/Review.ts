import type { RowDataPacket } from 'mysql2';
import pool from '../config/database';

export interface IReview extends RowDataPacket {
  id: number;
  user_id: number;
  product_id: number;
  rating: number;
  comment: string | null;
  created_at: Date;
  // User details
  username?: string;
  full_name?: string;
}

export interface IReviewCreate {
  user_id: number;
  product_id: number;
  rating: number;
  comment?: string;
}

export namespace Review {
  export async function findByProductId(productId: number): Promise<IReview[]> {
    try {
      const [rows] = await pool.execute<IReview[]>(
        `SELECT r.*, u.username, u.full_name 
         FROM reviews r 
         JOIN users u ON r.user_id = u.id 
         WHERE r.product_id = ? 
         ORDER BY r.created_at DESC`,
        [productId]
      );
      return rows;
    } catch (error) {
      console.error('Error finding reviews by product ID:', error);
      throw error;
    }
  }

  export async function create(reviewData: IReviewCreate): Promise<number> {
    try {
      const [result] = await pool.execute(
        'INSERT INTO reviews (user_id, product_id, rating, comment) VALUES (?, ?, ?, ?)',
        [
          reviewData.user_id,
          reviewData.product_id,
          reviewData.rating,
          reviewData.comment || null,
        ]
      );
      return (result as any).insertId;
    } catch (error) {
      console.error('Error creating review:', error);
      throw error;
    }
  }

  export async function update(id: number, rating: number, comment?: string): Promise<boolean> {
    try {
      const [result] = await pool.execute(
        'UPDATE reviews SET rating = ?, comment = ? WHERE id = ?',
        [rating, comment || null, id]
      );
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error updating review:', error);
      throw error;
    }
  }

  export async function removeById(id: number): Promise<boolean> {
    try {
      const [result] = await pool.execute(
        'DELETE FROM reviews WHERE id = ?',
        [id]
      );
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  }

  export async function getProductRating(productId: number): Promise<{
    averageRating: number;
    totalReviews: number;
    ratingDistribution: Record<number, number>;
  }> {
    try {
      const [avgResult] = await pool.execute<any[]>(
        'SELECT AVG(rating) as average, COUNT(*) as total FROM reviews WHERE product_id = ?',
        [productId]
      );

      const [distribution] = await pool.execute<any[]>(
        'SELECT rating, COUNT(*) as count FROM reviews WHERE product_id = ? GROUP BY rating',
        [productId]
      );

      const ratingDistribution: Record<number, number> = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
      };

      for (const row of distribution) {
        ratingDistribution[row.rating] = row.count;
      }

      return {
        averageRating: avgResult[0].average || 0,
        totalReviews: avgResult[0].total || 0,
        ratingDistribution,
      };
    } catch (error) {
      console.error('Error getting product rating:', error);
      throw error;
    }
  }
} 
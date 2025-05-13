import type { RowDataPacket } from 'mysql2';
import bcrypt from 'bcryptjs';
import pool from '../config/database';

export interface IUser extends RowDataPacket {
  id: number;
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;
}

export interface IUserCreate {
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  google_id?: string;
  facebook_id?: string;
  role?: 'user' | 'admin';
}

export class User {
  id: number;
  username: string;
  email: string;
  password: string;
  full_name: string;
  phone?: string;
  address?: string;
  role: 'user' | 'admin';
  created_at: Date;
  updated_at: Date;

  constructor(data: Partial<IUser>) {
    this.id = data.id || 0;
    this.username = data.username || '';
    this.email = data.email || '';
    this.password = data.password || '';
    this.full_name = data.full_name || '';
    this.phone = data.phone;
    this.address = data.address;
    this.role = data.role || 'user';
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
  }

  static async findById(id: number): Promise<IUser | null> {
    try {
      const [rows] = await pool.execute<IUser[]>(
        'SELECT * FROM users WHERE id = ?',
        [id]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user by ID:', error);
      throw error;
    }
  }

  static async findByEmail(email: string): Promise<IUser | null> {
    try {
      const [rows] = await pool.execute<IUser[]>(
        'SELECT * FROM users WHERE email = ?',
        [email]
      );
      return rows[0] || null;
    } catch (error) {
      console.error('Error finding user by email:', error);
      throw error;
    }
  }

  static async countAll(): Promise<number> {
    try {
      const [result] = await pool.execute('SELECT COUNT(*) as count FROM users');
      return (result as any)[0].count;
    } catch (error) {
      console.error('Error counting users:', error);
      throw error;
    }
  }

  static async create(userData: IUserCreate): Promise<number> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const [result] = await pool.execute(
        'INSERT INTO users (username, email, password, full_name, phone, address) VALUES (?, ?, ?, ?, ?, ?)',
        [
          userData.username,
          userData.email,
          hashedPassword,
          userData.full_name,
          userData.phone || null,
          userData.address || null,
        ]
      );
      return (result as any).insertId;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  static async update(id: number, userData: Partial<IUserCreate>): Promise<boolean> {
    try {
      const updates: string[] = [];
      const values: any[] = [];

      for (const [key, value] of Object.entries(userData)) {
        if (value !== undefined) {
          updates.push(`${key} = ?`);
          values.push(value);
        }
      }

      if (updates.length === 0) return false;

      values.push(id);
      const [result] = await pool.execute(
        `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
        values
      );

      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async changePassword(id: number, newPassword: string): Promise<boolean> {
    try {
      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const [result] = await pool.execute(
        'UPDATE users SET password = ? WHERE id = ?',
        [hashedPassword, id]
      );
      return (result as any).affectedRows > 0;
    } catch (error) {
      console.error('Error changing password:', error);
      throw error;
    }
  }

  static async findAll(): Promise<IUser[]> {
    try {
      const [rows] = await pool.execute<IUser[]>(
        'SELECT * FROM users ORDER BY created_at DESC'
      );
      return rows;
    } catch (error) {
      console.error('Error finding all users:', error);
      throw error;
    }
  }
} 

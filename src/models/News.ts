import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import pool from '../config/database';
import { toSnakeCase } from '../utils/stringUtils';

export interface NewsInput {
  title: string;
  slug?: string;
  summary: string;
  content: string;
  image?: string;
  author_id: number;
  is_published?: boolean;
  published_at?: Date;
}

export interface NewsOutput extends NewsInput {
  id: number;
  created_at: Date;
  updated_at: Date;
  author_name?: string;
}

export interface INews extends RowDataPacket {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string | null;
  author_id: number;
  is_published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  author_name?: string;
}

interface FindAllOptions {
  page?: number;
  limit?: number;
  search?: string;
  is_published?: boolean;
  orderBy?: string;
}

interface CountOptions {
  search?: string;
  is_published?: boolean;
}

export class News {
  id: number;
  title: string;
  slug: string;
  summary: string;
  content: string;
  image: string | null;
  author_id: number;
  is_published: boolean;
  published_at: Date | null;
  created_at: Date;
  updated_at: Date;
  author_name?: string;

  constructor(data: Partial<INews> = {}) {
    this.id = data.id || 0;
    this.title = data.title || '';
    this.slug = data.slug || '';
    this.summary = data.summary || '';
    this.content = data.content || '';
    this.image = data.image || null;
    this.author_id = data.author_id || 0;
    this.is_published = data.is_published ?? false;
    this.published_at = data.published_at || null;
    this.created_at = data.created_at || new Date();
    this.updated_at = data.updated_at || new Date();
    this.author_name = data.author_name;
  }

  // Lấy tất cả tin tức
  static async findAll(options: FindAllOptions = {}): Promise<News[]> {
    const {
      page = 1,
      limit = 10,
      search = '',
      is_published,
      orderBy = 'created_at DESC'
    } = options;
    
    const offset = (page - 1) * limit;
    
    let query = `
      SELECT n.*, u.full_name as author_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE 1=1
    `;
    
    const params: Array<string | number | boolean> = [];
    
    if (search) {
      query += " AND (n.title LIKE ? OR n.summary LIKE ? OR n.content LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (is_published !== undefined) {
      query += " AND n.is_published = ?";
      params.push(is_published);
    }
    
    // Xử lý orderBy để tách phần tên cột và hướng sắp xếp
    const orderByParts = orderBy.split(' ');
    const orderColumn = orderByParts[0]; // tên cột
    const orderDirection = orderByParts.length > 1 ? orderByParts[1] : 'ASC'; // ASC hoặc DESC
    
    query += " ORDER BY " + orderColumn + " " + orderDirection;
    query += " LIMIT ? OFFSET ?";
    params.push(limit, offset);
    
    const [rows] = await pool.query<INews[]>(query, params);
    return rows.map(row => new News(row));
  }
  
  // Đếm tổng số tin tức
  static async countAll(options: CountOptions = {}): Promise<number> {
    const { search = '', is_published } = options;
    
    let query = "SELECT COUNT(*) as count FROM news WHERE 1=1";
    const params: Array<string | number | boolean> = [];
    
    if (search) {
      query += " AND (title LIKE ? OR summary LIKE ? OR content LIKE ?)";
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }
    
    if (is_published !== undefined) {
      query += " AND is_published = ?";
      params.push(is_published);
    }
    
    const [rows] = await pool.query<RowDataPacket[]>(query, params);
    return rows[0].count;
  }
  
  // Lấy tin tức theo ID
  static async findById(id: number): Promise<News | null> {
    const query = `
      SELECT n.*, u.full_name as author_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.id = ?
    `;
    
    const [rows] = await pool.query<INews[]>(query, [id]);
    return rows.length ? new News(rows[0]) : null;
  }
  
  // Lấy tin tức theo slug
  static async findBySlug(slug: string): Promise<News | null> {
    const query = `
      SELECT n.*, u.full_name as author_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.slug = ?
    `;
    
    const [rows] = await pool.query<INews[]>(query, [slug]);
    return rows.length ? new News(rows[0]) : null;
  }
  
  // Tạo tin tức mới
  static async create(data: Omit<INews, 'id' | 'created_at' | 'updated_at' | 'author_name'>): Promise<number> {
    const {
      title,
      slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      summary,
      content,
      image,
      author_id,
      is_published = false,
      published_at
    } = data;
    
    const query = `
      INSERT INTO news (
        title, 
        slug, 
        summary, 
        content, 
        image, 
        author_id,
        is_published,
        published_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const [result] = await pool.query<ResultSetHeader>(
      query,
      [
        title,
        slug,
        summary,
        content,
        image,
        author_id,
        is_published,
        published_at || (is_published ? new Date() : null)
      ]
    );
    
    return result.insertId;
  }
  
  // Cập nhật tin tức
  static async update(id: number, data: Partial<Omit<INews, 'id' | 'created_at' | 'updated_at' | 'author_name'>>): Promise<boolean> {
    const fields: string[] = [];
    const values: Array<string | number | boolean | Date | null> = [];
    
    // Build field-value pairs for dynamic update
    if (data.title !== undefined) {
      fields.push('title = ?');
      values.push(data.title);
    }
    
    if (data.slug !== undefined) {
      fields.push('slug = ?');
      values.push(data.slug);
    }
    
    if (data.summary !== undefined) {
      fields.push('summary = ?');
      values.push(data.summary);
    }
    
    if (data.content !== undefined) {
      fields.push('content = ?');
      values.push(data.content);
    }
    
    if (data.image !== undefined) {
      fields.push('image = ?');
      values.push(data.image);
    }
    
    if (data.author_id !== undefined) {
      fields.push('author_id = ?');
      values.push(data.author_id);
    }
    
    if (data.is_published !== undefined) {
      fields.push('is_published = ?');
      values.push(data.is_published);
      
      if (data.is_published === true && !data.published_at) {
        fields.push('published_at = NOW()');
      }
    }
    
    if (data.published_at !== undefined) {
      fields.push('published_at = ?');
      values.push(data.published_at);
    }
    
    if (fields.length === 0) {
      return false;
    }
    
    fields.push('updated_at = NOW()');
    values.push(id);
    
    const query = `
      UPDATE news
      SET ${fields.join(', ')}
      WHERE id = ?
    `;
    
    const [result] = await pool.query<ResultSetHeader>(query, values);
    return result.affectedRows > 0;
  }
  
  // Xóa tin tức
  static async delete(id: number): Promise<boolean> {
    const query = 'DELETE FROM news WHERE id = ?';
    const [result] = await pool.query<ResultSetHeader>(query, [id]);
    
    return result.affectedRows > 0;
  }
  
  // Lấy các tin tức gần đây đã xuất bản
  static async findRecent(limit = 5): Promise<News[]> {
    const query = `
      SELECT n.*, u.full_name as author_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.is_published = true
      ORDER BY n.published_at DESC
      LIMIT ?
    `;
    
    const [rows] = await pool.query<INews[]>(query, [limit]);
    return rows.map(row => new News(row));
  }
  
  // Lấy tin tức liên quan
  static async findRelated(id: number, limit = 3): Promise<News[]> {
    const query = `
      SELECT n.*, u.full_name as author_name
      FROM news n
      LEFT JOIN users u ON n.author_id = u.id
      WHERE n.id != ? AND n.is_published = true
      ORDER BY n.published_at DESC
      LIMIT ?
    `;
    
    const [rows] = await pool.query<INews[]>(query, [id, limit]);
    return rows.map(row => new News(row));
  }
} 
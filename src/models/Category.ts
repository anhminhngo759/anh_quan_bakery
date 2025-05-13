import type { RowDataPacket, ResultSetHeader } from 'mysql2/promise';
import db from '../config/database';

export interface ICategory extends RowDataPacket {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;
}

export class Category {
    id: number;
    name: string;
    description: string;
    created_at: Date;
    updated_at: Date;

    constructor(data: Partial<ICategory> = {}) {
        this.id = data.id || 0;
        this.name = data.name || '';
        this.description = data.description || '';
        this.created_at = data.created_at || new Date();
        this.updated_at = data.updated_at || new Date();
    }

    static async findAll(): Promise<Category[]> {
        const [rows] = await db.query<ICategory[]>('SELECT * FROM categories ORDER BY name');
        return rows.map((row: ICategory) => new Category(row));
    }

    static async findById(id: number): Promise<Category | null> {
        const [rows] = await db.query<ICategory[]>('SELECT * FROM categories WHERE id = ?', [id]);
        return rows.length ? new Category(rows[0]) : null;
    }

    static async create(data: { name: string; description: string }): Promise<number> {
        const [result] = await db.query<ResultSetHeader>(
            'INSERT INTO categories (name, description) VALUES (?, ?)',
            [data.name, data.description]
        );
        return result.insertId;
    }

    async update(): Promise<void> {
        await db.query(
            'UPDATE categories SET name = ?, description = ?, updated_at = NOW() WHERE id = ?',
            [this.name, this.description, this.id]
        );
    }

    async delete(): Promise<void> {
        await db.query('DELETE FROM categories WHERE id = ?', [this.id]);
    }

    static async removeById(id: number): Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }

    static async update(id: number, data: { name: string; description: string }): Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>(
            'UPDATE categories SET name = ?, description = ?, updated_at = NOW() WHERE id = ?',
            [data.name, data.description, id]
        );
        return result.affectedRows > 0;
    }

    static async getProductCount(categoryId: number): Promise<number> {
        const [rows] = await db.query<RowDataPacket[]>('SELECT COUNT(*) as count FROM products WHERE category_id = ?', [categoryId]);
        return rows[0].count;
    }

    static async findByName(name: string): Promise<Category | null> {
        const [rows] = await db.query<ICategory[]>('SELECT * FROM categories WHERE name = ?', [name]);
        return rows.length ? new Category(rows[0]) : null;
    }

    static async delete(id: number): Promise<boolean> {
        const [result] = await db.query<ResultSetHeader>('DELETE FROM categories WHERE id = ?', [id]);
        return result.affectedRows > 0;
    }
} 
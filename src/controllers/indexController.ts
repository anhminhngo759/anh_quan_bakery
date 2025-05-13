import type { Request, Response } from 'express';
import type { Session } from 'express-session';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { News } from '../models/News';
import type { User } from '../models/User';
import type { RequestHandler } from 'express-serve-static-core';

declare module 'express-session' {
    interface Session {
        cartCount?: number;
        user?: User;
    }
}

export const indexController = {
    home: (async (req, res) => {
        const categories = await Category.findAll();
        const products = await Product.findAll({ 
            limit: 6,
            orderBy: 'RAND()'
        });
        
        // Lấy tin tức mới nhất đã xuất bản
        const recentNews = await News.findRecent(3);
        
        res.render('pages/index', {
            title: 'Trang chủ',
            categories,
            products,
            recentNews
        });
    }) as RequestHandler
};
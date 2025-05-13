import type { RequestHandler } from 'express-serve-static-core';
import { Product } from '../models/Product';
import { Category } from '../models/Category';

export const pageController = {
  // About Us page
  about: ((req, res) => {
    res.render('pages/about', { title: 'Về chúng tôi' });
  }) as RequestHandler,

  // Contact page
  contact: ((req, res) => {
    res.render('pages/contact', { 
      title: 'Liên hệ',
      messages: {
        success: req.flash('success'),
        error: req.flash('error')
      }
    });
  }) as RequestHandler,

  // Contact form submission
  contactSubmit: ((req, res) => {
    const { name, email, phone, subject, message } = req.body;
    
    // Here you would typically save the contact form data to a database
    // or send an email notification
    
    // For now, just flash a success message and redirect back to the contact page
    req.flash('success', 'Cảm ơn bạn đã liên hệ với chúng tôi. Chúng tôi sẽ phản hồi trong thời gian sớm nhất.');
    res.redirect('/lien-he');
  }) as RequestHandler,

  // Stores page
  stores: ((req, res) => {
    // Static store data
    const stores = [
      {
        id: 1,
        name: 'Anh Quân Bakery - Chi nhánh 240 Hồ Nghinh',
        address: '240 Hồ Nghinh, Sơn Trà, Đà Nẵng',
        phone: '028 1234 5678',
        email: 'honghinh@anhquanbakery.com',
        open_hours: '7:00 - 22:00',
        map_url: 'https://maps.google.com/?q=10.7758439,106.7017555',
        image: '/images/stores/store1.jpg'
      },
      {
        id: 2,
        name: 'Anh Quân Bakery - Chi nhánh 185 Phan Đăng Lưu',
        address: '185 Phan Đăng Lưu, Hòa Cường Bắc, Đà Nẵng',
        phone: '028 2345 6789',
        email: 'phandangluu@anhquanbakery.com',
        open_hours: '7:00 - 22:00',
        map_url: 'https://maps.google.com/?q=10.7812834,106.6908834',
        image: '/images/stores/store2.jpg'
      },
      {
        id: 3,
        name: 'Anh Quân Bakery - Chi nhánh 369 Tôn Đức Thắng',
        address: '369 Tôn Đức Thắng, Liên Chiểu, Đà Nẵng',
        phone: '028 3456 7890',
        email: 'tonducthang@anhquanbakery.com',
        open_hours: '7:00 - 22:00',
        map_url: 'https://maps.google.com/?q=10.7286737,106.7218058',
        image: '/images/stores/store3.jpg'
      },
      {
        id: 4,
        name: 'Anh Quân Bakery - Chi nhánh 44 Nguyễn Nhàn',
        address: '44 Nguyễn Nhàn, Cẩm Lệ, Đà Nẵng',
        phone: '028 4567 8901',
        email: 'nguyennhan@anhquanbakery.com',
        open_hours: '7:00 - 22:00',
        map_url: 'https://maps.google.com/?q=10.8010731,106.6638575',
        image: '/images/stores/store4.jpg'
      },
      {
        id: 5,
        name: 'Anh Quân Bakery - Chi nhánh 437 Hà Huy Tập',
        address: '437 Hà Huy Tập, Hòa Khê, Đà Nẵng',
        phone: '028 5678 9012',
        email: 'hahuytap@anhquanbakery.com',
        open_hours: '7:00 - 22:00',
        map_url: 'https://maps.google.com/?q=10.8499506,106.7684696',
        image: '/images/stores/store5.jpg'
      }
    ];
    
    res.render('pages/stores', {
      title: 'Hệ thống cửa hàng',
      stores
    });
  }) as RequestHandler
}; 
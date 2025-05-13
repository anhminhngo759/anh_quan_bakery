import type { Request, Response, RequestHandler } from 'express';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Category } from '../models/Category';
import { Order } from '../models/Order';
import { toSnakeCase } from '../utils/stringUtils';
import { processImage } from '../middleware/upload';
import orderService from '../services/orderService';

export const adminController = {
  // Hiển thị trang dashboard
  dashboard: (async (req, res) => {
    try {
      // Tổng số người dùng
      const totalUsers = await User.countAll();
      
      // Tổng số sản phẩm
      const totalProducts = await Product.countAll();
      
      // Tổng số đơn hàng
      const totalOrders = await Order.countAll();
      
      // Doanh thu
      const revenue = await Order.calculateTotalRevenue();
      
      // Đơn hàng gần đây
      const recentOrders = await Order.findRecent(5);
      
      res.render('pages/admin/dashboard', {
        title: 'Trang quản trị',
        totalUsers,
        totalProducts,
        totalOrders,
        revenue,
        recentOrders
      });
    } catch (error) {
      console.error('Error in dashboard:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải trang quản trị'
      });
    }
  }) as RequestHandler,
  
  // Quản lý người dùng
  listUsers: (async (req, res) => {
    try {
      const users = await User.findAll();
      
      res.render('pages/admin/users/index', {
        title: 'Quản lý người dùng',
        users
      });
    } catch (error) {
      console.error('Error in listUsers:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải danh sách người dùng'
      });
    }
  }) as RequestHandler,
  
  // Chi tiết người dùng
  showUser: (async (req, res) => {
    try {
      const userId = Number.parseInt(req.params.id, 10);
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).render('pages/error', {
          title: 'Lỗi',
          message: 'Không tìm thấy người dùng'
        });
      }
      
      // Lấy đơn hàng của người dùng
      const orders = await Order.findByUserId(userId);
      
      res.render('pages/admin/users/show', {
        title: `Thông tin người dùng: ${user.full_name}`,
        user,
        orders
      });
    } catch (error) {
      console.error('Error in showUser:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải thông tin người dùng'
      });
    }
  }) as RequestHandler,
  
  // Chỉnh sửa người dùng
  editUser: (async (req, res) => {
    try {
      const userId = Number.parseInt(req.params.id, 10);
      const user = await User.findById(userId);
      
      if (!user) {
        return res.status(404).render('pages/error', {
          title: 'Lỗi',
          message: 'Không tìm thấy người dùng'
        });
      }
      
      res.render('pages/admin/users/edit', {
        title: `Chỉnh sửa người dùng: ${user.full_name}`,
        user
      });
    } catch (error) {
      console.error('Error in editUser:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải thông tin người dùng'
      });
    }
  }) as RequestHandler,
  
  // Cập nhật người dùng
  updateUser: (async (req, res) => {
    try {
      const userId = Number.parseInt(req.params.id, 10);
      const { full_name, email, role, phone, address } = req.body;
      
      // Kiểm tra xem email đã tồn tại chưa
      const existingUser = await User.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        return res.status(400).json({
          message: 'Email đã được sử dụng bởi tài khoản khác'
        });
      }
      
      // Cập nhật thông tin người dùng
      await User.update(userId, {
        full_name,
        email,
        phone,
        address,
        role
      });
      
      res.redirect('/admin/users');
    } catch (error) {
      console.error('Error in updateUser:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi cập nhật thông tin người dùng'
      });
    }
  }) as RequestHandler,
  
  // Quản lý sản phẩm
  listProducts: (async (req, res) => {
    try {
      const page = req.query.page ? Number.parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? Number.parseInt(req.query.limit as string, 10) : 10;
      const search = req.query.search as string || '';
      const category_id = req.query.category_id ? Number.parseInt(req.query.category_id as string, 10) : undefined;
      
      // Get total count for pagination
      const totalProducts = await Product.countAll({search, category_id});
      const totalPages = Math.ceil(totalProducts / limit);
      
      // Get products with pagination
      const products = await Product.findAll({
        page,
        limit,
        search,
        category_id,
        orderBy: 'created_at DESC'
      });
      
      const categories = await Category.findAll();
      
      res.render('pages/admin/products/index', {
        title: 'Quản lý sản phẩm',
        products,
        categories,
        pagination: {
          page,
          limit,
          totalPages,
          totalProducts,
          search,
          category_id
        }
      });
    } catch (error) {
      console.error('Error in listProducts:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải danh sách sản phẩm'
      });
    }
  }) as RequestHandler,
  
  // Thêm mới sản phẩm (Form)
  newProduct: (async (req, res) => {
    try {
      const categories = await Category.findAll();
      
      res.render('pages/admin/products/new', {
        title: 'Thêm sản phẩm mới',
        categories
      });
    } catch (error) {
      console.error('Error in newProduct:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải trang thêm sản phẩm'
      });
    }
  }) as RequestHandler,
  
  // Lưu sản phẩm mới
  createProduct: (async (req, res) => {
    try {
      const { name, description, category_id, stock_quantity, is_available } = req.body;
      
      console.log('Form data received:', req.body);
      console.log('Files:', req.file);
      
      // Handle image upload
      let image_url = '/images/placeholder.jpg';
      let thumbnail_url = '/images/placeholder.jpg';
      
      if (req.file) {
        const processedImages = await processImage(req.file);
        if (processedImages) {
          image_url = processedImages.original;
          thumbnail_url = processedImages.thumbnail;
        }
      }
      
      // Ensure numeric values are properly parsed and handle empty values
      const price = req.body.price && req.body.price.trim() !== '' ? Number.parseFloat(req.body.price) : 0;
      const categoryId = category_id && category_id.trim() !== '' ? Number.parseInt(category_id, 10) : null;
      const stockQuantity = stock_quantity && stock_quantity.trim() !== '' ? Number.parseInt(stock_quantity, 10) : 0;
      
      console.log('Product creation parsed values:', {
        name,
        price,
        categoryId,
        stockQuantity,
        isNaNPrice: Number.isNaN(price),
        isNaNCategory: Number.isNaN(categoryId),
        isNaNStock: Number.isNaN(stockQuantity)
      });
      
      // Validate required fields (use more lenient validation)
      if (!name || name.trim() === '') {
        console.log('Missing name validation failed');
        const categories = await Category.findAll();
        return res.status(400).render('pages/admin/products/new', {
          title: 'Thêm sản phẩm mới',
          categories,
          error: 'Vui lòng nhập tên sản phẩm',
          values: req.body
        });
      }
      
      if (!category_id || category_id.trim() === '') {
        console.log('Missing category validation failed');
        const categories = await Category.findAll();
        return res.status(400).render('pages/admin/products/new', {
          title: 'Thêm sản phẩm mới',
          categories,
          error: 'Vui lòng chọn danh mục sản phẩm',
          values: req.body
        });
      }
      
      if (Number.isNaN(price)) {
        console.log('Invalid price validation failed');
        const categories = await Category.findAll();
        return res.status(400).render('pages/admin/products/new', {
          title: 'Thêm sản phẩm mới',
          categories,
          error: 'Giá sản phẩm không hợp lệ',
          values: req.body
        });
      }
      
      if (Number.isNaN(stockQuantity)) {
        console.log('Invalid stock validation failed');
        const categories = await Category.findAll();
        return res.status(400).render('pages/admin/products/new', {
          title: 'Thêm sản phẩm mới',
          categories,
          error: 'Số lượng trong kho không hợp lệ',
          values: req.body
        });
      }
      
      // Lưu sản phẩm mới
      console.log('Creating product with values:', {
        name,
        description: description || '',
        price,
        category_id: categoryId,
        image_url,
        thumbnail_url,
        stock_quantity: stockQuantity,
        is_available: Array.isArray(is_available) ? is_available.includes('true') : is_available === 'true'
      });
      
      await Product.create({
        name,
        description: description || '',
        price,
        category_id: categoryId,
        image_url,
        thumbnail_url,
        stock_quantity: stockQuantity,
        is_available: Array.isArray(is_available) ? is_available.includes('true') : is_available === 'true'
      });
      
      res.redirect('/admin/products');
    } catch (error) {
      console.error('Error in createProduct:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi thêm sản phẩm mới'
      });
    }
  }) as RequestHandler,
  
  // Chỉnh sửa sản phẩm (Form)
  editProduct: (async (req, res) => {
    try {
      const productId = Number.parseInt(req.params.id, 10);
      const product = await Product.findById(productId);
      
      if (!product) {
        return res.status(404).render('pages/error', {
          title: 'Lỗi',
          message: 'Không tìm thấy sản phẩm'
        });
      }
      
      const categories = await Category.findAll();
      
      res.render('pages/admin/products/edit', {
        title: `Chỉnh sửa sản phẩm: ${product.name}`,
        product,
        categories
      });
    } catch (error) {
      console.error('Error in editProduct:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải thông tin sản phẩm'
      });
    }
  }) as RequestHandler,
  
  // Cập nhật sản phẩm
  updateProduct: (async (req, res) => {
    try {
      const productId = Number.parseInt(req.params.id, 10);
      const { name, description, is_available } = req.body;
      
      console.log('Update form data received:', req.body);
      console.log('Update files:', req.file);
      console.log('Update is_available value:', is_available);
      
      // Get the existing product to preserve values if not provided
      const existingProduct = await Product.findById(productId);
      if (!existingProduct) {
        return res.status(404).render('pages/error', {
          title: 'Lỗi',
          message: 'Không tìm thấy sản phẩm'
        });
      }
      
      // Handle image upload
      let image_url = existingProduct.image_url;
      let thumbnail_url = existingProduct.thumbnail_url;
      if (req.file) {
        const processedImages = await processImage(req.file);
        if (processedImages) {
          image_url = processedImages.original;
          thumbnail_url = processedImages.thumbnail;
        }
      }
      
      // Parse numeric values carefully to avoid NaN
      let price = existingProduct.price;
      let categoryId = existingProduct.category_id;
      let stockQuantity = existingProduct.stock_quantity;
      
      // Only update if values are provided and not empty
      if (req.body.price && req.body.price.trim() !== '') {
        const parsedPrice = Number.parseFloat(req.body.price);
        if (!Number.isNaN(parsedPrice)) {
          price = parsedPrice;
        }
      }
      
      if (req.body.category_id && req.body.category_id.trim() !== '') {
        const parsedCategoryId = Number.parseInt(req.body.category_id, 10);
        if (!Number.isNaN(parsedCategoryId)) {
          categoryId = parsedCategoryId;
        }
      }
      
      if (req.body.stock_quantity && req.body.stock_quantity.trim() !== '') {
        const parsedStockQuantity = Number.parseInt(req.body.stock_quantity, 10);
        if (!Number.isNaN(parsedStockQuantity)) {
          stockQuantity = parsedStockQuantity;
        }
      }
      
      // Xử lý giá trị is_available
      // Nếu checkbox được chọn, giá trị sẽ là mảng ['false', 'true'] do cả hidden field và checkbox đều submit
      // Nếu không chọn, giá trị sẽ chỉ là 'false' từ hidden field
      const isAvailable = Array.isArray(is_available) ? is_available.includes('true') : is_available === 'true';
      
      console.log('Product update values:', {
        name: name || existingProduct.name,
        price,
        categoryId,
        stockQuantity,
        image_url,
        thumbnail_url,
        isAvailable
      });
      
      // Cập nhật thông tin sản phẩm
      await Product.update(productId, {
        name: name || existingProduct.name,
        description: description || existingProduct.description,
        price,
        category_id: categoryId,
        image_url,
        thumbnail_url,
        stock_quantity: stockQuantity,
        is_available: isAvailable
      });
      
      res.redirect('/admin/products');
    } catch (error) {
      console.error('Error in updateProduct:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi cập nhật thông tin sản phẩm'
      });
    }
  }) as RequestHandler,
  
  // Xóa sản phẩm
  deleteProduct: (async (req, res) => {
    try {
      const productId = Number.parseInt(req.params.id, 10);
      
      await Product.delete(productId);
      
      res.redirect('/admin/products');
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi xóa sản phẩm'
      });
    }
  }) as RequestHandler,
  
  // Quản lý danh mục
  listCategories: (async (req, res) => {
    try {
      const categories = await Category.findAll();
      
      res.render('pages/admin/categories/index', {
        title: 'Quản lý danh mục',
        categories
      });
    } catch (error) {
      console.error('Error in listCategories:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải danh sách danh mục'
      });
    }
  }) as RequestHandler,
  
  // Thêm mới danh mục (Form)
  newCategory: (async (req, res) => {
    try {
      res.render('pages/admin/categories/new', {
        title: 'Thêm danh mục mới'
      });
    } catch (error) {
      console.error('Error in newCategory:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải trang thêm danh mục'
      });
    }
  }) as RequestHandler,
  
  // Lưu danh mục mới
  createCategory: (async (req, res) => {
    try {
      const { name, description } = req.body;
      
      // Kiểm tra xem tên danh mục đã tồn tại chưa
      const existingCategory = await Category.findByName(name);
      if (existingCategory) {
        return res.status(400).render('pages/admin/categories/new', {
          title: 'Thêm danh mục mới',
          error: 'Tên danh mục đã tồn tại',
          values: req.body
        });
      }
      
      // Lưu danh mục mới
      await Category.create({
        name,
        description
      });
      
      res.redirect('/admin/categories');
    } catch (error) {
      console.error('Error in createCategory:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi thêm danh mục mới'
      });
    }
  }) as RequestHandler,
  
  // Chỉnh sửa danh mục (Form)
  editCategory: (async (req, res) => {
    try {
      const categoryId = Number.parseInt(req.params.id, 10);
      const category = await Category.findById(categoryId);
      
      if (!category) {
        return res.status(404).render('pages/error', {
          title: 'Lỗi',
          message: 'Không tìm thấy danh mục'
        });
      }
      
      res.render('pages/admin/categories/edit', {
        title: `Chỉnh sửa danh mục: ${category.name}`,
        category
      });
    } catch (error) {
      console.error('Error in editCategory:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải thông tin danh mục'
      });
    }
  }) as RequestHandler,
  
  // Cập nhật danh mục
  updateCategory: (async (req, res) => {
    try {
      const categoryId = Number.parseInt(req.params.id, 10);
      const { name, description } = req.body;
      
      // Kiểm tra xem tên danh mục đã tồn tại chưa
      const existingCategory = await Category.findByName(name);
      if (existingCategory && existingCategory.id !== categoryId) {
        return res.status(400).render('pages/admin/categories/edit', {
          title: 'Chỉnh sửa danh mục',
          category: { id: categoryId, ...req.body },
          error: 'Tên danh mục đã tồn tại'
        });
      }
      
      // Cập nhật thông tin danh mục
      await Category.update(categoryId, {
        name,
        description
      });
      
      res.redirect('/admin/categories');
    } catch (error) {
      console.error('Error in updateCategory:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi cập nhật thông tin danh mục'
      });
    }
  }) as RequestHandler,
  
  // Xóa danh mục
  deleteCategory: (async (req, res) => {
    try {
      const categoryId = Number.parseInt(req.params.id, 10);
      
      // Kiểm tra xem danh mục có sản phẩm không
      const products = await Product.findByCategoryId(categoryId);
      if (products.length > 0) {
        return res.status(400).json({
          message: 'Không thể xóa danh mục đã có sản phẩm'
        });
      }
      
      await Category.delete(categoryId);
      
      res.redirect('/admin/categories');
    } catch (error) {
      console.error('Error in deleteCategory:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi xóa danh mục'
      });
    }
  }) as RequestHandler,
  
  // Quản lý đơn hàng
  listOrders: (async (req, res) => {
    try {
      const orders = await Order.findAll();
      
      res.render('pages/admin/orders/index', {
        title: 'Quản lý đơn hàng',
        orders
      });
    } catch (error) {
      console.error('Error in listOrders:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải danh sách đơn hàng'
      });
    }
  }) as RequestHandler,
  
  // Chi tiết đơn hàng
  showOrder: (async (req, res) => {
    try {
      const orderId = Number.parseInt(req.params.id, 10);
      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).render('pages/error', {
          title: 'Lỗi',
          message: 'Không tìm thấy đơn hàng'
        });
      }
      
      // Lấy chi tiết đơn hàng
      const orderItems = await Order.getOrderItems(orderId);
      const user = await User.findById(order.user_id);
      
      res.render('pages/admin/orders/show', {
        title: `Chi tiết đơn hàng #${orderId}`,
        order,
        orderItems,
        user
      });
    } catch (error) {
      console.error('Error in showOrder:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải thông tin đơn hàng'
      });
    }
  }) as RequestHandler,
  
  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: (async (req, res) => {
    try {
      const orderId = Number.parseInt(req.params.id, 10);
      const { status } = req.body;
      
      const result = await orderService.updateOrderStatus(orderId, status);
      
      // Nếu yêu cầu là Ajax, trả về JSON
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        if (!result.success) {
          // Return error with details about insufficient stock
          return res.status(400).json({ 
            success: false,
            message: result.message,
            insufficientStock: result.insufficientStock
          });
        }

        return res.json({ 
          success: true,
          message: result.message
        });
      }
      
      // Nếu là form submission thông thường, chuyển hướng
      if (!result.success) {
        req.flash('error', result.message);
      } else {
        req.flash('success', 'Cập nhật trạng thái đơn hàng thành công');
      }
      
      res.redirect(`/admin/orders/${orderId}`);
    } catch (error) {
      console.error('Error in updateOrderStatus:', error);
      
      // Nếu yêu cầu là Ajax, trả về JSON
      if (req.xhr || req.headers.accept?.includes('application/json')) {
        return res.status(500).json({
          success: false,
          message: 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng'
        });
      }
      
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi cập nhật trạng thái đơn hàng'
      });
    }
  }) as RequestHandler,
  
  // In đơn hàng
  printOrder: (async (req, res) => {
    try {
      const orderId = Number.parseInt(req.params.id, 10);
      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).render('pages/error', {
          title: 'Lỗi',
          message: 'Không tìm thấy đơn hàng'
        });
      }
      
      // Lấy chi tiết đơn hàng
      const items = await Order.getOrderItems(orderId);
      
      // Thêm category_name vào mỗi item
      order.items = items;
      
      res.render('pages/admin/orders/print', {
        title: `In Đơn Hàng #${orderId}`,
        order
      });
    } catch (error) {
      console.error('Error in printOrder:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải thông tin đơn hàng để in'
      });
    }
  }) as RequestHandler,
  
  // Thống kê
  statistics: (async (req, res) => {
    try {
      const startDate = req.query.start_date ? new Date(req.query.start_date as string) : new Date(new Date().setMonth(new Date().getMonth() - 1));
      const endDate = req.query.end_date ? new Date(req.query.end_date as string) : new Date();
      
      // Số lượng đơn hàng theo trạng thái
      const orderStats = await Order.getOrderStats(startDate, endDate);
      
      // Doanh thu theo ngày (chỉ từ đơn hàng đã giao)
      const revenueByDay = await Order.getRevenueByDay(startDate, endDate);
      
      // Doanh thu tạm thời (bao gồm đơn hàng đã xác nhận, đang giao và đã giao)
      const totalTempRevenue = await Order.calculateTotalRevenue();
      
      // Sản phẩm bán chạy
      const topProducts = await Product.getTopSellingProducts(5);
      
      // Số lượng sản phẩm còn trong kho
      const lowStockProducts = await Product.getLowStockProducts(10);
      
      res.render('pages/admin/statistics', {
        title: 'Thống kê',
        orderStats,
        revenueByDay,
        topProducts,
        lowStockProducts,
        totalTempRevenue,
        startDate,
        endDate
      });
    } catch (error) {
      console.error('Error in statistics:', error);
      res.status(500).render('pages/error', {
        title: 'Lỗi',
        message: 'Đã xảy ra lỗi khi tải dữ liệu thống kê'
      });
    }
  }) as RequestHandler
}; 

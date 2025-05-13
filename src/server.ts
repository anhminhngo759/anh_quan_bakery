import express from 'express';
import path from 'node:path';
import MySQLStore from 'express-mysql-session';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { User } from './models/User';
import indexRoutes from './routes/indexRoutes';
import pageRoutes from './routes/pageRoutes';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import cartRoutes from './routes/cartRoutes';
import orderRoutes from './routes/orderRoutes';
import adminRoutes from './routes/adminRoutes';
import categoryRoutes from './routes/categoryRoutes';
import { addUserToLocals } from './middleware/auth';
import { addCategoriesToLocals } from './middleware/auth';
import { addCartCountToLocals } from './middleware/auth';
import type { ErrorRequestHandler } from 'express';
import accountRoutes from './routes/accountRoutes';
import searchRoutes from './routes/searchRoutes';
import newsRoutes from './routes/newsRoutes';
import session from 'express-session';
import passport from 'passport';
import { configurePassport } from './controllers/authController';
import flash from 'connect-flash';
import type { Router } from 'express';

// Dynamically import payment routes (will be available after TypeScript compiles)
// eslint-disable-next-line @typescript-eslint/no-var-requires
const paymentRoutes = require('./routes/paymentRoutes').default as Router;

// Load environment variables
dotenv.config();

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

// Middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'", 
        "https://code.jquery.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com",
        "https://maps.googleapis.com",
        "https://www.google.com"
      ],
      styleSrc: ["'self'", "'unsafe-inline'",
        "https://fonts.googleapis.com",
        "https://cdn.jsdelivr.net",
        "https://cdnjs.cloudflare.com"
      ],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://cdn.jsdelivr.net"],
      connectSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'", "https://www.google.com", "https://maps.google.com"]
    }
  }
}));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration
const MySQLStoreSession = MySQLStore(session);
const sessionStore = new MySQLStoreSession({
  host: process.env.DB_HOST || 'localhost',
  port: 3306,
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'bakery'
});

app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  store: sessionStore,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Add flash middleware
app.use(flash() as unknown as express.RequestHandler);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Configure Passport strategies
configurePassport();

// Add user data to all views
app.use(addUserToLocals);

// Add categories data to all views for header
app.use(addCategoriesToLocals);

// Add cart count to all views for header
app.use(addCartCountToLocals);

// Add middleware to catch 'undefined' in paths
app.use((req, res, next) => {
  if (req.path.includes('/undefined')) {
    console.log('Caught undefined in path:', req.path);
    return res.redirect('/gio-hang/checkout');
  }
  next();
});

// Add logging middleware for MoMo-related requests
app.use((req, res, next) => {
  if (req.path.includes('/momo') || req.path.includes('/payment')) {
    console.log('→ Request:', req.method, req.path);
    console.log('  Query:', JSON.stringify(req.query));
  }
  next();
});

// Routes
app.use('/', indexRoutes);
app.use('/', pageRoutes);
app.use('/auth', authRoutes);
app.use('/san-pham', productRoutes);
app.use('/danh-muc', categoryRoutes);
app.use('/gio-hang', cartRoutes);
app.use('/don-hang', orderRoutes);
app.use('/admin', adminRoutes);
app.use('/tai-khoan', accountRoutes);
app.use('/tim-kiem', searchRoutes);
app.use('/payment', paymentRoutes);
app.use('/tin-tuc', newsRoutes);

// Error handling middleware
const errorHandler: ErrorRequestHandler = (err, _req, res, _next) => {
  console.error(err.stack);
  res.status(500).render('error', { 
    title: 'Lỗi hệ thống',
    message: 'Đã có lỗi xảy ra. Vui lòng thử lại sau.',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
};

app.use(errorHandler);

// Socket.IO connection handling
io.on('connection', (socket) => {
  console.log('A user connected');
  
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

const PORT = process.env.PORT || 3001;
httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 
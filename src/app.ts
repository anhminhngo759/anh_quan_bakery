// import accountRoutes from './routes/accountRoutes';
// import searchRoutes from './routes/searchRoutes';
// import orderRoutes from './routes/orderRoutes';
// import session from 'express-session';
// import passport from 'passport';
// import { configurePassport } from './controllers/authController';

// // Routes
// app.use('/tai-khoan', accountRoutes);
// app.use('/tim-kiem', searchRoutes);
// app.use('/don-hang', orderRoutes);

// // Cấu hình session
// app.use(session({
//   secret: process.env.SESSION_SECRET!,
//   resave: false,
//   saveUninitialized: false,
//   cookie: {
//     secure: process.env.NODE_ENV === 'production',
//     maxAge: 24 * 60 * 60 * 1000 // 24 hours
//   }
// }));

// // Cấu hình Passport
// app.use(passport.initialize());
// app.use(passport.session());
// configurePassport(); 
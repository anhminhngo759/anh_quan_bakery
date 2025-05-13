import type {RequestHandler } from 'express';
import { User } from '../models/User';
import type { IUser } from '../models/User';
import bcrypt from 'bcryptjs';
import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';

export const authController = {
  // Hiển thị trang đăng nhập
  showLogin: (async (req, res) => {
    res.render('pages/login', {
      title: 'Đăng nhập',
      error: req.flash('error')
    });
  }) as RequestHandler,

  // Hiển thị trang đăng ký
  showRegister: ((_req, res) => {
    res.render('pages/auth/register', {
      title: 'Đăng ký',
      error: null
    });
  }) as RequestHandler,

  // Xử lý đăng nhập
  login: (async (req, res, next) => {
    passport.authenticate('local', (err: Error | null, user: IUser | null, info: { message: string }) => {
      if (err) {
        console.error('Passport authentication error:', err);
        return next(err);
      }
      if (!user) {
        console.error('Login failed:', info.message);
        req.flash('error', info.message);
        return res.redirect('/auth/dang-nhap');
      }
      
      console.log('User authenticated successfully:', user.email);
      
      req.logIn(user, (err) => {
        if (err) {
          console.error('Login error:', err);
          return next(err);
        }
        
        // Save user ID to session explicitly
        req.session.userId = user.id;
        console.log('User ID saved to session:', user.id);
        
        // Save session before redirecting
        req.session.save((err) => {
          if (err) {
            console.error('Session save error:', err);
            return next(err);
          }
          
          // Redirect admin users to admin dashboard
          if (user.role === 'admin') {
            return res.redirect('/admin');
          }
          // Redirect normal users to homepage
          return res.redirect('/');
        });
      });
    })(req, res, next);
  }) as RequestHandler,

  // Đăng nhập với Google
  googleAuth: passport.authenticate('google', {
    scope: ['profile', 'email']
  }) as RequestHandler,

  // Callback sau khi đăng nhập Google
  googleCallback: passport.authenticate('google', {
    successRedirect: '/',
    failureRedirect: '/auth/dang-nhap',
    failureFlash: true
  }) as RequestHandler,

  // Xử lý đăng ký
  register: (async (req, res) => {
    try {
      const { email, password, fullName: full_name, phone, address } = req.body;
      
      // Validate required fields
      if (!email || !password || !full_name) {
        return res.render('pages/auth/register', {
          title: 'Đăng ký',
          error: 'Vui lòng điền đầy đủ thông tin bắt buộc',
          values: req.body
        });
      }

      // Check if email already exists
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.render('pages/auth/register', {
          title: 'Đăng ký',
          error: 'Email đã được sử dụng',
          values: req.body
        });
      }

      // Create username from email
      const username = email.split('@')[0];

      // Create user with all fields
      const userId = await User.create({
        email,
        password,
        full_name,
        username,
        phone: phone || null,
        address: address || null
      });

      // Auto login after registration
      req.session.userId = userId;
      
      // Redirect to home page
      res.redirect('/');
    } catch (error) {
      console.error('Registration error:', error);
      res.render('pages/auth/register', {
        title: 'Đăng ký',
        error: 'Đã xảy ra lỗi trong quá trình đăng ký',
        values: req.body
      });
    }
  }) as RequestHandler,

  // Xử lý đăng xuất
  logout: (async (req, res) => {
    // Xóa session ID
    req.session.userId = undefined;
    // Xóa session
    req.session.destroy((err) => {
      if (err) {
        console.error('Error destroying session:', err);
      }
      res.redirect('/');
    });
  }) as RequestHandler,

  getCurrentUser: (async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    res.json({ data: { user: req.user } });
  }) as RequestHandler,

  updateProfile: (async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { full_name, email } = req.body;
    const user = req.user as IUser;
    await User.update(user.id, { full_name, email });
    res.json({ message: 'Profile updated successfully' });
  }) as RequestHandler,

  changePassword: (async (req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }
    const { newPassword } = req.body;
    const user = req.user as IUser;
    await User.changePassword(user.id, newPassword);
    res.json({ message: 'Password changed successfully' });
  }) as RequestHandler
};

// Cấu hình Passport
export const configurePassport = () => {
  // Local Strategy
  passport.use(new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password'
  }, async (email, password, done) => {
    try {
      const user = await User.findByEmail(email);
      
      if (!user) {
        return done(null, false, { message: 'Email không tồn tại' });
      }
      
      const isMatch = await bcrypt.compare(password, user.password);
      
      if (!isMatch) {
        return done(null, false, { message: 'Mật khẩu không chính xác' });
      }
      
      return done(null, user);
    } catch (error) {
      return done(error);
    }
  }));

  // Google Strategy
  const googleClientId = process.env.GOOGLE_CLIENT_ID;
  const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;
  
  if (!googleClientId || !googleClientSecret) {
    throw new Error('Google OAuth credentials not configured');
  }

  passport.use(new GoogleStrategy({
    clientID: googleClientId,
    clientSecret: googleClientSecret,
    callbackURL: '/auth/google/callback'
  }, async (accessToken, refreshToken, profile, done) => {
    try {
      // Tìm hoặc tạo user
      if (!profile.emails || profile.emails.length === 0) {
        return done(new Error('No email found in profile'));
      }
      let user = await User.findByEmail(profile.emails[0].value);
      
      if (!user) {
        const userId = await User.create({
          username: profile.emails[0].value.split('@')[0],
          full_name: profile.displayName,
          email: profile.emails[0].value,
          password: await bcrypt.hash(Math.random().toString(36), 10),
          google_id: profile.id
        });
        user = await User.findById(userId);
      } else if (!user.google_id) {
        // Cập nhật google_id nếu user đã tồn tại
        await User.update(user.id, { google_id: profile.id });
      }

      if (!user) {
        return done(new Error('Failed to create or find user'));
      }
      return done(null, user);
    } catch (error) {
      return done(error as Error);
    }
  }));

  // Serialize user
  passport.serializeUser((user, done) => {
    done(null, (user as Express.User & IUser).id);
  });

  // Deserialize user
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}; 
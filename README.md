# bakery - Bakery Management System

A full-stack web application for managing a bakery business, built with Express.js, TypeScript, and MySQL.

## Features

### User Features
- User authentication (Register/Login)
- Product browsing and search
- Shopping cart management
- Order placement and tracking
- Order history
- Personal profile management
- Social media integration

### Admin Features
- Dashboard with statistics
- Product management
- Category management
- Order management
- User management
- Inventory tracking

## Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- Docker and Docker Compose (optional)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bakery
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory and configure your environment variables:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=bakery
SESSION_SECRET=your_secret_key
JWT_SECRET=your_jwt_secret
```

## Running the Application

### Using Docker (Recommended)

1. Build and start the containers:
```bash
docker-compose up --build
```

2. Access the application at `http://localhost:3000`

### Without Docker

1. Start the MySQL server

2. Build the TypeScript files:
```bash
npm run build
```

3. Start the application:
```bash
npm start
```

4. Access the application at `http://localhost:3000`

## Development

To run the application in development mode with hot-reload:

```bash
npm run dev
```

## Testing

To run the test suite:

```bash
npm test
```

## Project Structure

```
bakery/
├── src/
│   ├── config/         # Configuration files
│   ├── controllers/    # Route controllers
│   ├── middleware/     # Custom middleware
│   ├── models/        # Database models
│   ├── routes/        # Route definitions
│   ├── services/      # Business logic
│   ├── utils/         # Utility functions
│   ├── views/         # EJS templates
│   └── server.ts      # Application entry point
├── public/            # Static files
├── tests/             # Test files
├── .env              # Environment variables
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── README.md
└── tsconfig.json
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Cấu hình đăng nhập với mạng xã hội

### Google OAuth

1. Truy cập [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo project mới hoặc chọn project hiện có
3. Bật Google+ API
4. Tạo OAuth 2.0 Client ID
5. Thêm Authorized redirect URI: `http://localhost:3000/auth/google/callback`
6. Sao chép Client ID và Client Secret vào file `.env`

### Facebook OAuth

1. Truy cập [Facebook Developers](https://developers.facebook.com/)
2. Tạo ứng dụng mới
3. Thêm Facebook Login product
4. Cấu hình OAuth redirect URI: `http://localhost:3000/auth/facebook/callback`
5. Sao chép App ID và App Secret vào file `.env`

### Cấu hình Session

1. Tạo một chuỗi ngẫu nhiên làm SESSION_SECRET
2. Thêm vào file `.env`:
   ```
   SESSION_SECRET=your_session_secret_here
   ```

## MoMo Payment Integration

This project includes integration with MoMo e-wallet payment gateway. To use the MoMo payment feature, you'll need to configure the following environment variables:

```
# MoMo Payment Configuration
MOMO_PARTNER_CODE=your_partner_code
MOMO_ACCESS_KEY=your_access_key
MOMO_SECRET_KEY=your_secret_key
MOMO_API_URL=https://test-payment.momo.vn (for sandbox) or https://payment.momo.vn (for production)
MOMO_RETURN_URL=http://your-domain/payment/momo/return
MOMO_NOTIFY_URL=http://your-domain/payment/momo/ipn
MOMO_SANDBOX=true (for sandbox) or false (for production)
```

To set up MoMo payment:
1. Register for a MoMo merchant account at [MoMo Business Portal](https://business.momo.vn/)
2. Obtain your Partner Code, Access Key, and Secret Key
3. Add these credentials to your environment variables
4. For development, you can use the sandbox environment for testing

Note: Make sure your MOMO_RETURN_URL and MOMO_NOTIFY_URL are accessible to MoMo servers. For local development, you might need to use a service like ngrok. 
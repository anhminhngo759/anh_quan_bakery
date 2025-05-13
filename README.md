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
- Integrating MoMo wallet payment

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

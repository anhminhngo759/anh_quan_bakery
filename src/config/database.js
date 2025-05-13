require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'bakery',
    host: process.env.DB_HOST || 'mysql',
    dialect: 'mysql',
    logging: console.log,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci',
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  test: {
    username: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'bakery_test',
    host: process.env.DB_HOST || 'mysql',
    dialect: 'mysql',
    logging: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    dialect: 'mysql',
    logging: false,
    charset: 'utf8mb4',
    collate: 'utf8mb4_unicode_ci'
  }
}; 
'use strict';
const bcrypt = require('bcryptjs');

module.exports = {
  async up(queryInterface) {
    const hashedPassword = '$2a$10$QfhAtbOl537coHZzsNvRcOuI6KSI7Qdek4jBThdOlnBSKJ2OgNn2u';
    
    await queryInterface.bulkInsert('users', [{
      username: 'admin',
      email: 'admin@anhquanbakery.com',
      password: hashedPassword,
      full_name: 'Admin',
      phone: '0123456789',
      address: 'Admin Address',
      role: 'admin',
      created_at: new Date(),
      updated_at: new Date()
    }], {});
  },

  async down(queryInterface) {
    await queryInterface.bulkDelete('users', { email: 'admin@anhquanbakery.com' }, {});
  }
}; 
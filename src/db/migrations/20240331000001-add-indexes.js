'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add indexes for orders
    await queryInterface.addIndex('orders', ['user_id']);
    await queryInterface.addIndex('orders', ['status']);

    // Add indexes for order_items
    await queryInterface.addIndex('order_items', ['order_id']);
    await queryInterface.addIndex('order_items', ['product_id']);

    // Add indexes for cart_items
    await queryInterface.addIndex('cart_items', ['user_id']);
    await queryInterface.addIndex('cart_items', ['product_id']);

    // Add unique constraint for cart_items
    await queryInterface.addConstraint('cart_items', {
      fields: ['user_id', 'product_id'],
      type: 'unique',
      name: 'unique_user_product'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove unique constraint from cart_items
    await queryInterface.removeConstraint('cart_items', 'unique_user_product');

    // Remove indexes from cart_items
    await queryInterface.removeIndex('cart_items', ['user_id']);
    await queryInterface.removeIndex('cart_items', ['product_id']);

    // Remove indexes from order_items
    await queryInterface.removeIndex('order_items', ['order_id']);
    await queryInterface.removeIndex('order_items', ['product_id']);

    // Remove indexes from orders
    await queryInterface.removeIndex('orders', ['user_id']);
    await queryInterface.removeIndex('orders', ['status']);
  }
}; 
/**
 * Migration to add thumbnail_url column to products table
 */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      // Check if column exists
      const [columns] = await queryInterface.sequelize.query(
        `SHOW COLUMNS FROM products LIKE 'thumbnail_url'`
      );
      
      if (columns.length === 0) {
        // Add thumbnail_url column
        await queryInterface.sequelize.query(
          `ALTER TABLE products 
           ADD COLUMN thumbnail_url VARCHAR(255) 
           AFTER image_url;`
        );
        
        // Update existing records to use image_url as thumbnail_url
        await queryInterface.sequelize.query(
          `UPDATE products 
           SET thumbnail_url = image_url 
           WHERE thumbnail_url IS NULL;`
        );
        
        console.log('Successfully added thumbnail_url column to products table');
      } else {
        console.log('thumbnail_url column already exists');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error adding thumbnail_url column:', error);
      return Promise.reject(error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    try {
      // Check if column exists before trying to remove it
      const [columns] = await queryInterface.sequelize.query(
        `SHOW COLUMNS FROM products LIKE 'thumbnail_url'`
      );
      
      if (columns.length > 0) {
        await queryInterface.sequelize.query(
          `ALTER TABLE products 
           DROP COLUMN thumbnail_url;`
        );
        console.log('Successfully removed thumbnail_url column from products table');
      } else {
        console.log('thumbnail_url column does not exist');
      }
      
      return Promise.resolve();
    } catch (error) {
      console.error('Error removing thumbnail_url column:', error);
      return Promise.reject(error);
    }
  }
}; 
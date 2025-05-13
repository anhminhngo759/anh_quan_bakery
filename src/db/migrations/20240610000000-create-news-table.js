'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create news table
    await queryInterface.createTable('news', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: false,
        unique: true
      },
      summary: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      content: {
        type: Sequelize.TEXT('LONG'),
        allowNull: false
      },
      image: {
        type: Sequelize.STRING(255),
        allowNull: true
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        }
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false
      },
      published_at: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });

    // Add index for author_id
    await queryInterface.addIndex('news', ['author_id']);
    
    // Add index for slug
    await queryInterface.addIndex('news', ['slug'], {
      unique: true,
      name: 'idx_news_slug'
    });
    
    // Add index for is_published and published_at to optimize queries for published news
    await queryInterface.addIndex('news', ['is_published', 'published_at']);
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('news');
  }
}; 
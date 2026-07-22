'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable("reviews", {
    
        review_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
    
        rating: {
            type: Sequelize.DECIMAL(2,1),
            allowNull: false,
            validate: {
              min: 1,
              max: 5
            }
        },
    
        comment: {
            type: Sequelize.STRING(255),
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [1, 255]
            }
        },
    
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "users",
                key: "user_id"
            },

            onDelete: "CASCADE"
        },
    
        book_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: "books",
                key: "book_id"
            },

            onDelete: "CASCADE"
        },

        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
        },
      
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal("CURRENT_TIMESTAMP")
        }

    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable("reviews");
  }
};

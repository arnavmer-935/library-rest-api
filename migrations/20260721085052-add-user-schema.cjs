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

    await queryInterface.createTable("users", {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      
      username: {
          type: Sequelize.STRING(30),
          allowNull: false,
          unique: true,
      },
      
      email: {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
      },
      
      password_hash: {
          type: Sequelize.STRING,
          allowNull: false
      },
      
      role: {
          type: Sequelize.ENUM("USER", "ADMIN"),
          allowNull: false,
          defaultValue: "USER"
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
    })
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */

    await queryInterface.dropTable("users");
  }
};

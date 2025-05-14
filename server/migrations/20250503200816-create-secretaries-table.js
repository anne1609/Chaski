'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('secretaries', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      names: {
        type: Sequelize.STRING,
        allowNull: false
      },
      last_names: {
        type: Sequelize.STRING,
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: Sequelize.STRING,
        allowNull: false
      },
      phone_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
  });
},

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('secretaries');
  }
};

'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('teachers', 'password', {
      type: Sequelize.STRING,
      allowNull: true,
      after: 'email'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('teachers', 'password');
  }
};

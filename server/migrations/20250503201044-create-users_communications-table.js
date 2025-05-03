'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('users_communications', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id'
        },
      },
      communication_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'communications',
          key: 'id'
        },
      },
      confirmed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      date_confirmed: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      presence: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('users_communications');
  }
};

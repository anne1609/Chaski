'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tutors_communications', {
      tutor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'tutors',
          key: 'id',
        },
      },
      communication_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'communications',
          key: 'id',
        },
      },
      confirmed: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      date_confirmed: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      presence: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tutors_communications');
  }
};

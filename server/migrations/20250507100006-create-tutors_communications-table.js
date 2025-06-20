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
        type: Sequelize.STRING, 
        allowNull: true,
        defaultValue: 'pendiente', 
      },
      meeting_datetime: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tutors_communications');
  }
};

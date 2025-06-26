'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('students_communications', {
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'students',
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
    await queryInterface.dropTable('students_communications'); 
  }
};

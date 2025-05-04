'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('tutors_students', {
      tutor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'tutors',
          key: 'id',
        },
      },
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        references: {
          model: 'students',
          key: 'id',
        },
      },
      grades_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'grades',
          key: 'id',
        },
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('tutors_students');
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tutors_students', [
      {
        // Patricia Mendoza es tutora de Ana López (1er grado)
        tutor_id: 1,
        student_id: 1,
        grades_id: 1
      },
      {
        // Patricia Mendoza también es tutora de Pedro García (1er grado)
        tutor_id: 1,
        student_id: 2,
        grades_id: 1
      },
      {
        // Jorge Benavides es tutor de Lucía Ramírez (2do grado)
        tutor_id: 2,
        student_id: 3,
        grades_id: 2
      },
      {
        // Mónica Gutiérrez es tutora de Miguel Torres (3er grado)
        tutor_id: 3,
        student_id: 4,
        grades_id: 3
      },
      {
        // Ricardo Paredes es tutor de Carmen Díaz (4to grado)
        tutor_id: 4,
        student_id: 5,
        grades_id: 4
      },
      {
        // Silvia Campos es tutora de Javier Herrera (5to grado)
        tutor_id: 5,
        student_id: 6,
        grades_id: 5
      },
      {
        // Fernando Quiroz es tutor de Sofía Castro (6to grado)
        tutor_id: 6,
        student_id: 7,
        grades_id: 6
      },
      {
        // Claudia Montes es tutora de Daniel Flores (1ero de secundaria)
        tutor_id: 7,
        student_id: 8,
        grades_id: 7
      },
      {
        // Gabriel Herrera es tutor de Valeria Vargas (2do de secundaria)
        tutor_id: 8,
        student_id: 9,
        grades_id: 8
      },
      {
        // Patricia Mendoza también es tutora de Alejandro Rojas (3ero de secundaria)
        // Este estudiante es de un grado diferente a sus otros tutorados
        tutor_id: 1,
        student_id: 10,
        grades_id: 9
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tutors_students', null, {});
  }
};

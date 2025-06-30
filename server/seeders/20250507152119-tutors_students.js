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
      },
      // Nuevas relaciones de tutores para los nuevos estudiantes (rotando tutores)
      // Primero de Primaria (IDs 11-14)
      { tutor_id: 2, student_id: 11, grades_id: 1 },
      { tutor_id: 3, student_id: 12, grades_id: 1 },
      { tutor_id: 4, student_id: 13, grades_id: 1 },
      { tutor_id: 5, student_id: 14, grades_id: 1 },
      // Segundo de Primaria (IDs 15-19)
      { tutor_id: 6, student_id: 15, grades_id: 2 },
      { tutor_id: 7, student_id: 16, grades_id: 2 },
      { tutor_id: 8, student_id: 17, grades_id: 2 },
      { tutor_id: 1, student_id: 18, grades_id: 2 },
      { tutor_id: 2, student_id: 19, grades_id: 2 },
      // Tercero de Primaria (IDs 20-24)
      { tutor_id: 3, student_id: 20, grades_id: 3 },
      { tutor_id: 4, student_id: 21, grades_id: 3 },
      { tutor_id: 5, student_id: 22, grades_id: 3 },
      { tutor_id: 6, student_id: 23, grades_id: 3 },
      { tutor_id: 7, student_id: 24, grades_id: 3 },
      // Cuarto de Primaria (IDs 25-29)
      { tutor_id: 8, student_id: 25, grades_id: 4 },
      { tutor_id: 1, student_id: 26, grades_id: 4 },
      { tutor_id: 2, student_id: 27, grades_id: 4 },
      { tutor_id: 3, student_id: 28, grades_id: 4 },
      { tutor_id: 4, student_id: 29, grades_id: 4 },
      // Quinto de Primaria (IDs 30-34)
      { tutor_id: 5, student_id: 30, grades_id: 5 },
      { tutor_id: 6, student_id: 31, grades_id: 5 },
      { tutor_id: 7, student_id: 32, grades_id: 5 },
      { tutor_id: 8, student_id: 33, grades_id: 5 },
      { tutor_id: 1, student_id: 34, grades_id: 5 },
      // Sexto de Primaria (IDs 35-39)
      { tutor_id: 2, student_id: 35, grades_id: 6 },
      { tutor_id: 3, student_id: 36, grades_id: 6 },
      { tutor_id: 4, student_id: 37, grades_id: 6 },
      { tutor_id: 5, student_id: 38, grades_id: 6 },
      { tutor_id: 6, student_id: 39, grades_id: 6 },
      // Primero de Secundaria (IDs 40-44)
      { tutor_id: 7, student_id: 40, grades_id: 7 },
      { tutor_id: 8, student_id: 41, grades_id: 7 },
      { tutor_id: 1, student_id: 42, grades_id: 7 },
      { tutor_id: 2, student_id: 43, grades_id: 7 },
      { tutor_id: 3, student_id: 44, grades_id: 7 },
      // Segundo de Secundaria (IDs 45-49)
      { tutor_id: 4, student_id: 45, grades_id: 8 },
      { tutor_id: 5, student_id: 46, grades_id: 8 },
      { tutor_id: 6, student_id: 47, grades_id: 8 },
      { tutor_id: 7, student_id: 48, grades_id: 8 },
      { tutor_id: 8, student_id: 49, grades_id: 8 },
      // Tercero de Secundaria (IDs 50-54)
      { tutor_id: 1, student_id: 50, grades_id: 9 },
      { tutor_id: 2, student_id: 51, grades_id: 9 },
      { tutor_id: 3, student_id: 52, grades_id: 9 },
      { tutor_id: 4, student_id: 53, grades_id: 9 },
      { tutor_id: 5, student_id: 54, grades_id: 9 },
      // Si se agregan más estudiantes, asignar tutores nuevos a partir del ID 55
      { tutor_id: 9, student_id: 55, grades_id: 10 },
      { tutor_id: 10, student_id: 56, grades_id: 10 },
      { tutor_id: 11, student_id: 57, grades_id: 10 },
      { tutor_id: 12, student_id: 58, grades_id: 10 },
      { tutor_id: 13, student_id: 59, grades_id: 10 },
      { tutor_id: 14, student_id: 60, grades_id: 10 },
      { tutor_id: 15, student_id: 61, grades_id: 10 },
      { tutor_id: 16, student_id: 62, grades_id: 10 },
      { tutor_id: 17, student_id: 63, grades_id: 10 },
      { tutor_id: 18, student_id: 64, grades_id: 10 }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tutors_students', null, {});
  }
};

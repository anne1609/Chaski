'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('subjects_teachers', [
      {
        // Matemáticas Básicas (1) - Roberto Gómez (1)
        subject_id: 1,
        teacher_id: 1
      },
      {
        // Matemáticas Básicas (1) - María Rodríguez (2) como profesora auxiliar
        subject_id: 1,
        teacher_id: 2
      },
      {
        // Lenguaje y Comunicación (2) - María Rodríguez (2)
        subject_id: 2,
        teacher_id: 2
      },
      {
        // Ciencias Naturales (3) - Juan Pérez (3)
        subject_id: 3,
        teacher_id: 3
      },
      {
        // Ciencias Naturales (3) - Laura Martínez (4) como profesora auxiliar
        subject_id: 3,
        teacher_id: 4
      },
      {
        // Historia del Perú (4) - Laura Martínez (4)
        subject_id: 4,
        teacher_id: 4
      },
      {
        // Educación Física (5) - Carlos Sánchez (5)
        subject_id: 5,
        teacher_id: 5
      },
      {
        // Álgebra (6) - Roberto Gómez (1)
        subject_id: 6,
        teacher_id: 1
      },
      {
        // Álgebra (6) - Juan Pérez (3) como profesor auxiliar
        subject_id: 6,
        teacher_id: 3
      },
      {
        // Literatura Universal (7) - María Rodríguez (2)
        subject_id: 7,
        teacher_id: 2
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subjects_teachers', null, {});
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('teachers_grades', [
      {
        teacher_id: 1, // Roberto Gómez (Matemáticas)
        grade_id: 1,   // Primero de Primaria
      },
      {
        teacher_id: 1, // Roberto Gómez (Matemáticas)
        grade_id: 2,   // Segundo de Primaria
      },
      {
        teacher_id: 1, // Roberto Gómez (Matemáticas)
        grade_id: 7,   // Primero de Secundaria
      },
      {
        teacher_id: 2, // María Rodríguez (Lenguaje)
        grade_id: 1,   // Primero de Primaria
      },
      {
        teacher_id: 2, // María Rodríguez (Lenguaje)
        grade_id: 9,   // Tercero de Secundaria
      },
      {
        teacher_id: 3, // Juan Pérez (Ciencias Naturales)
        grade_id: 1,   // Primero de Primaria
      },
      {
        teacher_id: 3, // Juan Pérez (Ciencias Naturales)
        grade_id: 8,   // Segundo de Secundaria
      },
      {
        teacher_id: 4, // Laura Martínez (Historia)
        grade_id: 4,   // Cuarto de Primaria
      },
      {
        teacher_id: 4, // Laura Martínez (Historia)
        grade_id: 10,  // Cuarto de Secundaria
      },
      {
        teacher_id: 5, // Carlos Sánchez (Educación Física)
        grade_id: 2,   // Segundo de Primaria
      },
      {
        teacher_id: 5, // Carlos Sánchez (Educación Física)
        grade_id: 11,  // Quinto de Secundaria
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('teachers_grades', null, {});
  }
};

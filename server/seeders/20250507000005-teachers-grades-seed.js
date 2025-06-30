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
        teacher_id: 1, // Asignar a Roberto Gómez como profesor de Quinto de Primaria
        grade_id: 5,   // Quinto de Primaria
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
      },
      {
        teacher_id: 10, // Asignar a un profesor existente (id 10) a Sexto de Primaria
        grade_id: 6,   // Sexto de Primaria
      },
      {
        teacher_id: 11, // Profesor de Matemáticas para Tercero de Primaria
        grade_id: 3,    // Tercero de Primaria
      },
      {
        teacher_id: 12, // Profesor de Ciencias para Tercero de Primaria
        grade_id: 3,    // Tercero de Primaria
      },
      {
        teacher_id: 13, // Profesor de Lenguaje para Tercero de Primaria
        grade_id: 3,    // Tercero de Primaria
      },
      // Solo teacher_id del 1 al 10, no usar 99 (demo)
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('teachers_grades', null, {});
  }
};

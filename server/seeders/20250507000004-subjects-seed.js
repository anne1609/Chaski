'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('subjects', [
      {
        name: 'Matemáticas Básicas',
        description: 'Fundamentos de aritmética y geometría',
        grade_id: 1, // Primero de Primaria
        teacher_id: 1, // Roberto Gómez
      },
      {
        name: 'Lenguaje y Comunicación',
        description: 'Desarrollo de habilidades comunicativas y lectoescritura',
        grade_id: 1, // Primero de Primaria
        teacher_id: 2, // María Rodríguez
      },
      {
        name: 'Ciencias Naturales',
        description: 'Introducción al mundo natural y sus fenómenos',
        grade_id: 1, // Primero de Primaria
        teacher_id: 3, // Juan Pérez

      },
      {
        name: 'Historia del Perú',
        description: 'Introducción a la historia y civilizaciones peruanas',
        grade_id: 4, // Cuarto de Primaria
        teacher_id: 4, // Laura Martínez
      },
      {
        name: 'Educación Física',
        description: 'Desarrollo de capacidades físicas y deportivas',
        grade_id: 2, // Segundo de Primaria
        teacher_id: 5, // Carlos Sánchez
      },
      {
        name: 'Álgebra',
        description: 'Fundamentos algebraicos y resolución de ecuaciones',
        grade_id: 7, // Primero de Secundaria
        teacher_id: 1, // Roberto Gómez
      },
      {
        name: 'Literatura Universal',
        description: 'Estudio de obras literarias representativas',
        grade_id: 9, // Tercero de Secundaria
        teacher_id: 2, // María Rodríguez
      },
      {
        name: 'Biología',
        description: 'Estudio de los seres vivos y sus procesos',
        grade_id: 8, // Segundo de Secundaria
        teacher_id: 3, // Juan Pérez
      },
      {
        name: 'Historia Universal',
        description: 'Estudio de las principales civilizaciones y eventos históricos',
        grade_id: 10, // Cuarto de Secundaria
        teacher_id: 4, // Laura Martínez
      },
      {
        name: 'Educación Física Avanzada',
        description: 'Desarrollo deportivo y preparación física',
        grade_id: 11, // Quinto de Secundaria
        teacher_id: 5, // Carlos Sánchez
      },
      // Segundo de Primaria
      { name: 'Matemáticas', description: 'Matemáticas para segundo de primaria', grade_id: 2, teacher_id: 6 },
      { name: 'Ciencias', description: 'Ciencias para segundo de primaria', grade_id: 2, teacher_id: 7 },
      { name: 'Lenguaje', description: 'Lenguaje para segundo de primaria', grade_id: 2, teacher_id: 8 },
      // Tercero de Primaria
      { name: 'Matemáticas', description: 'Matemáticas para tercero de primaria', grade_id: 3, teacher_id: 11 },
      { name: 'Ciencias', description: 'Ciencias para tercero de primaria', grade_id: 3, teacher_id: 12 },
      { name: 'Lenguaje', description: 'Lenguaje para tercero de primaria', grade_id: 3, teacher_id: 13 },
      // Quinto de Primaria (todos con el mismo profesor asignado)
      { name: 'Matemáticas', description: 'Matemáticas para quinto de primaria', grade_id: 5, teacher_id: 1 },
      { name: 'Ciencias', description: 'Ciencias para quinto de primaria', grade_id: 5, teacher_id: 1 },
      { name: 'Lenguaje', description: 'Lenguaje para quinto de primaria', grade_id: 5, teacher_id: 1 },
      // Sexto de Primaria
      { name: 'Matemáticas', description: 'Matemáticas para sexto de primaria', grade_id: 6, teacher_id: 10 },
      { name: 'Ciencias', description: 'Ciencias para sexto de primaria', grade_id: 6, teacher_id: 6 },
      { name: 'Lenguaje', description: 'Lenguaje para sexto de primaria', grade_id: 6, teacher_id: 7 },
      // Segundo de Secundaria
      { name: 'Matemáticas', description: 'Matemáticas para segundo de secundaria', grade_id: 8, teacher_id: 8 },
      { name: 'Ciencias', description: 'Ciencias para segundo de secundaria', grade_id: 8, teacher_id: 9 },
      { name: 'Lenguaje', description: 'Lenguaje para segundo de secundaria', grade_id: 8, teacher_id: 10 },
      // Materias de Robótica para todos los grados de secundaria (7 a 11)
      { name: 'Robótica', description: 'Robótica para primero de secundaria', grade_id: 7, teacher_id: 99 },
      { name: 'Robótica', description: 'Robótica para segundo de secundaria', grade_id: 8, teacher_id: 99 },
      { name: 'Robótica', description: 'Robótica para tercero de secundaria', grade_id: 9, teacher_id: 99 },
      { name: 'Robótica', description: 'Robótica para cuarto de secundaria', grade_id: 10, teacher_id: 99 },
      { name: 'Robótica', description: 'Robótica para quinto de secundaria', grade_id: 11, teacher_id: 99 },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subjects', null, {});
  }
};

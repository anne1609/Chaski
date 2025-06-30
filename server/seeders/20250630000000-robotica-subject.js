'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Crear la materia Robótica después de que el profesor demo ya existe
    await queryInterface.bulkInsert('subjects', [
      {
        name: 'Robótica Básica',
        description: 'Introducción a la robótica y programación básica',
        grade_id: 1, // Puedes cambiar el grado si lo deseas
        teacher_id: 99 // Asignar directamente el id del profesor demo
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subjects', { name: 'Robótica Básica' }, {});
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('students', [
      {
        names: 'Ana',
        last_names: 'López',
        email: 'ana.lopez@estudiante.chaski.edu',
        grade_id: 1 // Primero de Primaria
      },
      {
        names: 'Pedro',
        last_names: 'García',
        email: 'pedro.garcia@estudiante.chaski.edu',
        grade_id: 1 // Primero de Primaria
      },
      {
        names: 'Lucía',
        last_names: 'Ramírez',
        email: 'lucia.ramirez@estudiante.chaski.edu',
        grade_id: 2 // Segundo de Primaria
      },
      {
        names: 'Miguel',
        last_names: 'Torres',
        email: 'miguel.torres@estudiante.chaski.edu',
        grade_id: 3 // Tercero de Primaria
      },
      {
        names: 'Carmen',
        last_names: 'Díaz',
        email: 'carmen.diaz@estudiante.chaski.edu',
        grade_id: 4 // Cuarto de Primaria
      },
      {
        names: 'Javier',
        last_names: 'Herrera',
        email: 'javier.herrera@estudiante.chaski.edu',
        grade_id: 5 // Quinto de Primaria
      },
      {
        names: 'Sofía',
        last_names: 'Castro',
        email: 'sofia.castro@estudiante.chaski.edu',
        grade_id: 6 // Sexto de Primaria
      },
      {
        names: 'Daniel',
        last_names: 'Flores',
        email: 'daniel.flores@estudiante.chaski.edu',
        grade_id: 7 // Primero de Secundaria
      },
      {
        names: 'Valeria',
        last_names: 'Vargas',
        email: 'valeria.vargas@estudiante.chaski.edu',
        grade_id: 8 // Segundo de Secundaria
      },
      {
        names: 'Alejandro',
        last_names: 'Rojas',
        email: 'alejandro.rojas@estudiante.chaski.edu',
        grade_id: 9 // Tercero de Secundaria
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('students', null, {});
  }
};

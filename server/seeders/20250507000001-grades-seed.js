'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('grades', [
      {
        id: 1,
        name: 'Primero de Primaria',
        description: 'Primer grado de educación primaria'
      },
      {
        id: 2,
        name: 'Segundo de Primaria',
        description: 'Segundo grado de educación primaria'
      },
      {
        id: 3,
        name: 'Tercero de Primaria',
        description: 'Tercer grado de educación primaria'
      },
      {
        id: 4,
        name: 'Cuarto de Primaria',
        description: 'Cuarto grado de educación primaria'
      },
      {
        id: 5,
        name: 'Quinto de Primaria',
        description: 'Quinto grado de educación primaria'
      },
      {
        id: 6,
        name: 'Sexto de Primaria',
        description: 'Sexto grado de educación primaria'
      },
      {
        id: 7,
        name: 'Primero de Secundaria',
        description: 'Primer grado de educación secundaria'
      },
      {
        id: 8,
        name: 'Segundo de Secundaria',
        description: 'Segundo grado de educación secundaria'
      },
      {
        id: 9,
        name: 'Tercero de Secundaria',
        description: 'Tercer grado de educación secundaria'
      },
      {
        id: 10,
        name: 'Cuarto de Secundaria',
        description: 'Cuarto grado de educación secundaria'
      },
      {
        id: 11,
        name: 'Quinto de Secundaria',
        description: 'Quinto grado de educación secundaria'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('grades', null, {});
  }
};

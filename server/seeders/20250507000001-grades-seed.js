'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('grades', [
      {
        name: 'Primero de Primaria',
        description: 'Primer grado de educación primaria'
      },
      {
        name: 'Segundo de Primaria',
        description: 'Segundo grado de educación primaria'
      },
      {
        name: 'Tercero de Primaria',
        description: 'Tercer grado de educación primaria'
      },
      {
        name: 'Cuarto de Primaria',
        description: 'Cuarto grado de educación primaria'
      },
      {
        name: 'Quinto de Primaria',
        description: 'Quinto grado de educación primaria'
      },
      {
        name: 'Sexto de Primaria',
        description: 'Sexto grado de educación primaria'
      },
      {
        name: 'Primero de Secundaria',
        description: 'Primer grado de educación secundaria'
      },
      {
        name: 'Segundo de Secundaria',
        description: 'Segundo grado de educación secundaria'
      },
      {
        name: 'Tercero de Secundaria',
        description: 'Tercer grado de educación secundaria'
      },
      {
        name: 'Cuarto de Secundaria',
        description: 'Cuarto grado de educación secundaria'
      },
      {
        name: 'Quinto de Secundaria',
        description: 'Quinto grado de educación secundaria'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('grades', null, {});
  }
};

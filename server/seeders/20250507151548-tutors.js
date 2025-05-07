'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('tutors', [
      {
        names: 'Patricia',
        last_names: 'Mendoza',
        email: 'patricia.mendoza@gmail.com',
        phone_number: '987654321'
      },
      {
        names: 'Jorge',
        last_names: 'Benavides',
        email: 'jorge.benavides@gmail.com',
        phone_number: '987654322'
      },
      {
        names: 'Mónica',
        last_names: 'Gutiérrez',
        email: 'monica.gutierrez@gmail.com',
        phone_number: '987654323'
      },
      {
        names: 'Ricardo',
        last_names: 'Paredes',
        email: 'ricardo.paredes@gmail.com',
        phone_number: '987654324'
      },
      {
        names: 'Silvia',
        last_names: 'Campos',
        email: 'silvia.campos@gmail.com',
        phone_number: '987654325'
      },
      {
        names: 'Fernando',
        last_names: 'Quiroz',
        email: 'fernando.quiroz@gmail.com',
        phone_number: '987654326'
      },
      {
        names: 'Claudia',
        last_names: 'Montes',
        email: 'claudia.montes@gmail.com',
        phone_number: '987654327'
      },
      {
        names: 'Gabriel',
        last_names: 'Herrera',
        email: 'gabriel.herrera@gmail.com',
        phone_number: '987654328'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tutors', null, {});
  }
};

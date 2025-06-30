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
      },
      {
        names: 'Esteban',
        last_names: 'Salazar',
        email: 'esteban.salazar@gmail.com',
        phone_number: '987654329'
      },
      {
        names: 'Rosa',
        last_names: 'Vargas',
        email: 'rosa.vargas@gmail.com',
        phone_number: '987654330'
      },
      {
        names: 'Mario',
        last_names: 'Cáceres',
        email: 'mario.caceres@gmail.com',
        phone_number: '987654331'
      },
      {
        names: 'Elena',
        last_names: 'Mora',
        email: 'elena.mora@gmail.com',
        phone_number: '987654332'
      },
      {
        names: 'Pablo',
        last_names: 'Soto',
        email: 'pablo.soto@gmail.com',
        phone_number: '987654333'
      },
      {
        names: 'Teresa',
        last_names: 'Ríos',
        email: 'teresa.rios@gmail.com',
        phone_number: '987654334'
      },
      {
        names: 'Raúl',
        last_names: 'Guzmán',
        email: 'raul.guzman@gmail.com',
        phone_number: '987654335'
      },
      {
        names: 'Lorena',
        last_names: 'Peña',
        email: 'lorena.pena@gmail.com',
        phone_number: '987654336'
      },
      {
        names: 'Hugo',
        last_names: 'Navarro',
        email: 'hugo.navarro@gmail.com',
        phone_number: '987654337'
      },
      {
        names: 'Marina',
        last_names: 'Bravo',
        email: 'marina.bravo@gmail.com',
        phone_number: '987654338'
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('tutors', null, {});
  }
};

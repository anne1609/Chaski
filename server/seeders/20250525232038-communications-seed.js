'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('communications', [
      {
        category_id: 1,
        secretary_id: 1,
        teacher_id: null,
        subject: 'Reunión de padres',
        body: 'Se convoca a los padres de familia a una reunión el día viernes a las 5 PM.',
        status: 'Enviado',
        priority: 1,
        type: 'Citacion',
        meeting_datetime: new Date('2024-06-07T17:00:00'),
        attendance_status: 'Confirmado',
        attachment: null,
        created_at: new Date(),
      },
      {
        category_id: 2,
        secretary_id: 1,
        teacher_id: null,
        subject: 'Consulta sobre tareas',
        body: '¿Cuándo se entregan las tareas de matemáticas?',
        status: 'Guardado',
        priority: 2,
        type: 'Mensaje',
        meeting_datetime: new Date('2024-06-07T17:00:00'),
        attendance_status: null,
        attachment: null,
        created_at: new Date(),
      },
      {
        category_id: 3,
        secretary_id: 1,
        teacher_id: null,
        subject: 'Cambio de horario de clase',
        body: 'El horario de la clase de historia ha cambiado a los lunes a las 10 AM.',
        status: 'Guardado',
        priority: 3,
        type: 'Aviso',
        meeting_datetime: new Date('2024-06-07T17:00:00'),
        attendance_status: null,
        attachment: null,
        created_at: new Date(),
      },
      {
        category_id: 1,
        secretary_id: 1,
        teacher_id: null,
        subject: 'Recordatorio de pago',
        body: 'Se recuerda a los padres de familia que el plazo para el pago de matrícula vence el viernes.',
        status: 'Guardado',
        priority: 1,
        type: 'Aviso',
        meeting_datetime: new Date('2024-06-07T17:00:00'),
        attendance_status: null,
        attachment: null,
        created_at: new Date(),
      },
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('communications', null, {});
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('subjects_teachers', [
      // Asignación 1 a 1: cada profesor dicta solo una materia, y cada materia solo tiene un profesor
      { subject_id: 1, teacher_id: 1 }, // Matemáticas Básicas - Roberto Gómez
      { subject_id: 2, teacher_id: 2 }, // Lenguaje y Comunicación - María Rodríguez
      { subject_id: 3, teacher_id: 3 }, // Ciencias Naturales - Juan Pérez
      { subject_id: 4, teacher_id: 4 }, // Historia del Perú - Laura Martínez
      { subject_id: 5, teacher_id: 5 }, // Educación Física - Carlos Sánchez
      { subject_id: 6, teacher_id: 6 }, // Álgebra - Andrea López
      { subject_id: 7, teacher_id: 7 }, // Literatura Universal - Miguel Torres
      { subject_id: 8, teacher_id: 8 }, // Biología - Paula Ramírez
      { subject_id: 9, teacher_id: 9 }, // Historia Universal - Javier Díaz
      { subject_id: 10, teacher_id: 10 }, // Educación Física Avanzada - Lucía Castro
      { subject_id: 14, teacher_id: 11 }, // Matemáticas para tercero de primaria - Sofía Mendoza
      { subject_id: 15, teacher_id: 12 }, // Ciencias para tercero de primaria - Diego Vargas
      { subject_id: 16, teacher_id: 13 } // Lenguaje para tercero de primaria - Valeria Paredes
    ], {});

    // Asignar Robótica Básica al profesor demo si ambos existen
    const [robotica] = await queryInterface.sequelize.query(
      `SELECT id FROM subjects WHERE name ILIKE '%robotica%' OR name ILIKE '%robótica%' ORDER BY id DESC LIMIT 1`
    );
    const [demoTeacher] = await queryInterface.sequelize.query(
      `SELECT id FROM teachers WHERE email = 'profesor@mail.com'`
    );
    if (robotica.length > 0 && demoTeacher.length > 0) {
      await queryInterface.bulkInsert('subjects_teachers', [
        { subject_id: robotica[0].id, teacher_id: demoTeacher[0].id }
      ], {});
    }
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subjects_teachers', null, {});
  }
};

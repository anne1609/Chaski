'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    // Obtener todos los profesores excepto el demo (id 99)
    const [teachers] = await queryInterface.sequelize.query(
      `SELECT id FROM teachers WHERE id != 99 ORDER BY id`
    );
    // Obtener todas las materias excepto Robótica Básica
    const [subjects] = await queryInterface.sequelize.query(
      `SELECT id FROM subjects WHERE name NOT ILIKE '%robotica%' AND name NOT ILIKE '%robótica%' ORDER BY id`
    );

    // Mezclar aleatoriamente los arrays
    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }
    const shuffledTeachers = shuffle([...teachers]);
    const shuffledSubjects = shuffle([...subjects]);

    // Asignar 1 a 1 hasta que se acabe el menor de los dos
    const assignments = [];
    const count = Math.min(shuffledTeachers.length, shuffledSubjects.length);
    for (let i = 0; i < count; i++) {
      assignments.push({
        subject_id: shuffledSubjects[i].id,
        teacher_id: shuffledTeachers[i].id
      });
    }

    // Insertar las asignaciones
    await queryInterface.bulkInsert('subjects_teachers', assignments, {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('subjects_teachers', null, {});
  }
};
